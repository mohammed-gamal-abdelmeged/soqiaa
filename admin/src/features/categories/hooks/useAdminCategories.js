import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  updateAdminSubcategory,
} from "../../../services/categories.service";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function sortCategories(
  categories,
) {
  return [
    ...categories,
  ].sort(
    (
      firstCategory,
      secondCategory,
    ) => {
      /*
       * الأول حسب الترتيب.
       */
      const sortDifference =
        firstCategory.sortOrder -
        secondCategory.sortOrder;

      if (
        sortDifference !== 0
      ) {
        return sortDifference;
      }

      /*
       * لو فيه Inactive Category
       * بنفس الرقم، نخلي الـActive
       * يظهر قبله في الـAdmin.
       */
      if (
        firstCategory.isActive !==
        secondCategory.isActive
      ) {
        return firstCategory.isActive
          ? -1
          : 1;
      }

      return 0;
    },
  );
}

function sortSubcategories(
  subcategories,
) {
  return [
    ...subcategories,
  ].sort(
    (
      firstSubcategory,
      secondSubcategory,
    ) => {
      /*
       * الأول حسب الترتيب.
       */
      const sortDifference =
        firstSubcategory.sortOrder -
        secondSubcategory.sortOrder;

      if (
        sortDifference !== 0
      ) {
        return sortDifference;
      }

      /*
       * لو Active وInactive
       * عندهم نفس sortOrder،
       * نخلي الـActive يظهر الأول.
       */
      if (
        firstSubcategory.isActive !==
        secondSubcategory.isActive
      ) {
        return firstSubcategory
          .isActive
          ? -1
          : 1;
      }

      return 0;
    },
  );
}

/*
|--------------------------------------------------------------------------
| Categories List
|--------------------------------------------------------------------------
*/

export function useAdminCategories() {
  return useQuery({
    queryKey:
      queryKeys.categories,

    queryFn:
      getAdminCategories,

    staleTime:
      cacheTimes.categories,
  });
}

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export function useCreateAdminCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createAdminCategory,

    onSuccess: (
      createdCategory,
    ) => {
      /*
       * نضيف القسم مباشرة للكاش.
       *
       * بدون GET جديد.
       */
      queryClient.setQueryData(
        queryKeys.categories,
        (
          currentCategories = [],
        ) =>
          sortCategories([
            ...currentCategories,
            createdCategory,
          ]),
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/

export function useUpdateAdminCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateAdminCategory,

    onSuccess: (
      updatedCategory,
    ) => {
      /*
       * الـBackend ممكن يرجع:
       *
       * {
       *   ...updatedCategory,
       *
       *   replacement: {
       *     movedCategory: {...}
       *   }
       * }
       *
       * لو حصل Replacement.
       */
      const {
        replacement,
        ...categoryForCache
      } = updatedCategory;

      const movedCategory =
        replacement
          ?.movedCategory ??
        null;

      queryClient.setQueryData(
        queryKeys.categories,
        (
          currentCategories = [],
        ) => {
          const nextCategories =
            currentCategories.map(
              (
                category,
              ) => {
                /*
                 * القسم اللي الأدمن
                 * عدله / فعله.
                 */
                if (
                  category.id ===
                  categoryForCache.id
                ) {
                  return categoryForCache;
                }

                /*
                 * لو حصل Replacement،
                 * نحدث القسم القديم
                 * اللي اتحرك لآخر الترتيب.
                 */
                if (
                  movedCategory &&
                  category.id ===
                    movedCategory.id
                ) {
                  return movedCategory;
                }

                return category;
              },
            );

          return sortCategories(
            nextCategories,
          );
        },
      );

      /*
       * لو عندنا تفاصيل Category
       * متخزنة، نشيلها عشان
       * ما نعرضش بيانات قديمة.
       *
       * ده لا يعمل Request فورًا.
       */
      queryClient.removeQueries({
        queryKey: [
          ...queryKeys.categories,
          "detail",
        ],
      });
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Subcategory
|--------------------------------------------------------------------------
*/

export function useUpdateAdminSubcategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateAdminSubcategory,

    onSuccess: (
      updatedSubcategory,
    ) => {
      /*
       * الـBackend ممكن يرجع:
       *
       * {
       *   ...updatedSubcategory,
       *
       *   replacement: {
       *     movedSubcategory: {...}
       *   }
       * }
       *
       * لو حصل Sort Order Replacement.
       */
      const {
        replacement,
        ...subcategoryForCache
      } = updatedSubcategory;

      const movedSubcategory =
        replacement
          ?.movedSubcategory ??
        null;

      /*
       * نحدث أي Category Detail
       * موجودة في الكاش وتحتوي
       * على الـSubcategory المطلوبة.
       *
       * كده مش محتاجين categorySlug
       * داخل الـmutation variables،
       * ومفيش GET إضافي.
       */
      queryClient.setQueriesData(
        {
          queryKey: [
            ...queryKeys.categories,
            "detail",
          ],
        },
        (
          currentCategory,
        ) => {
          if (
            !currentCategory ||
            !Array.isArray(
              currentCategory
                .subcategories,
            )
          ) {
            return currentCategory;
          }

          const hasUpdatedSubcategory =
            currentCategory
              .subcategories
              .some(
                (
                  subcategory,
                ) =>
                  subcategory.id ===
                  subcategoryForCache.id,
              );

          const hasMovedSubcategory =
            movedSubcategory
              ? currentCategory
                  .subcategories
                  .some(
                    (
                      subcategory,
                    ) =>
                      subcategory.id ===
                      movedSubcategory.id,
                  )
              : false;

          /*
           * الكاش ده خاص Category تانية،
           * فمالوش علاقة بالـmutation.
           */
          if (
            !hasUpdatedSubcategory &&
            !hasMovedSubcategory
          ) {
            return currentCategory;
          }

          const nextSubcategories =
            currentCategory
              .subcategories
              .map(
                (
                  subcategory,
                ) => {
                  /*
                   * الـSubcategory اللي
                   * اتعدلت / اتفعلت.
                   */
                  if (
                    subcategory.id ===
                    subcategoryForCache.id
                  ) {
                    return subcategoryForCache;
                  }

                  /*
                   * لو حصل Replacement،
                   * نحدث الـSubcategory
                   * اللي اتحركت لآخر
                   * ترتيب نشط.
                   */
                  if (
                    movedSubcategory &&
                    subcategory.id ===
                      movedSubcategory.id
                  ) {
                    return movedSubcategory;
                  }

                  return subcategory;
                },
              );

          return {
            ...currentCategory,

            subcategories:
              sortSubcategories(
                nextSubcategories,
              ),
          };
        },
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
|
| الـAdmin UI الحالي مش بيستخدم Delete،
| لكن بنحتفظ بالـhook لأن الـAPI موجود.
|--------------------------------------------------------------------------
*/

export function useDeleteAdminCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminCategory,

    onSuccess: (
      deletedCategory,
    ) => {
      queryClient.setQueryData(
        queryKeys.categories,
        (
          currentCategories = [],
        ) =>
          currentCategories.filter(
            (
              category,
            ) =>
              category.id !==
              deletedCategory.id,
          ),
      );

      queryClient.removeQueries({
        queryKey: [
          ...queryKeys.categories,
          "detail",
        ],
      });
    },
  });
}