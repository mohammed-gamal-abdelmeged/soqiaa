import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from "../../../services/products.service";

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

function normalizeFilters(
  filters = {},
) {
  return {
    ...(filters.search
      ? {
          search:
            filters.search,
        }
      : {}),

    ...(filters.categorySlug
      ? {
          categorySlug:
            filters.categorySlug,
        }
      : {}),

    ...(typeof filters.isBestSeller ===
    "boolean"
      ? {
          isBestSeller:
            filters.isBestSeller,
        }
      : {}),

    ...(typeof filters.isActive ===
    "boolean"
      ? {
          isActive:
            filters.isActive,
        }
      : {}),
  };
}

function matchesProductFilters(
  product,
  filters = {},
) {
  if (filters.search) {
    const normalizedSearch =
      filters.search
        .trim()
        .toLocaleLowerCase();

    const normalizedName =
      product.name
        ?.toLocaleLowerCase() ??
      "";

    if (
      !normalizedName.includes(
        normalizedSearch,
      )
    ) {
      return false;
    }
  }

  if (
    filters.categorySlug &&
    product.categorySlug !==
      filters.categorySlug
  ) {
    return false;
  }

  if (
    typeof filters.isBestSeller ===
      "boolean" &&
    product.isBestSeller !==
      filters.isBestSeller
  ) {
    return false;
  }

  if (
    typeof filters.isActive ===
      "boolean" &&
    product.isActive !==
      filters.isActive
  ) {
    return false;
  }

  return true;
}

function isProductsListQuery(
  queryKey,
) {
  return (
    Array.isArray(queryKey) &&
    queryKey[0] === "admin" &&
    queryKey[1] === "products" &&
    queryKey.length === 3 &&
    typeof queryKey[2] ===
      "object" &&
    queryKey[2] !== null
  );
}

function updateProductsListCaches(
  queryClient,
  updater,
) {
  const cachedQueries =
    queryClient.getQueriesData({
      queryKey: [
        "admin",
        "products",
      ],
    });

  cachedQueries.forEach(
    ([
      queryKey,
      currentProducts,
    ]) => {
      if (
        !isProductsListQuery(
          queryKey,
        ) ||
        !Array.isArray(
          currentProducts,
        )
      ) {
        return;
      }

      const filters =
        queryKey[2] ?? {};

      queryClient.setQueryData(
        queryKey,
        updater(
          currentProducts,
          filters,
        ),
      );
    },
  );
}

/*
|--------------------------------------------------------------------------
| Products List
|--------------------------------------------------------------------------
*/

export function useAdminProducts(
  filters = {},
) {
  const normalizedFilters =
    normalizeFilters(
      filters,
    );

  return useQuery({
    queryKey:
      queryKeys.products(
        normalizedFilters,
      ),

    queryFn: () =>
      getAdminProducts(
        normalizedFilters,
      ),

    staleTime:
      cacheTimes.products,
  });
}

/*
|--------------------------------------------------------------------------
| Product Details
|--------------------------------------------------------------------------
*/

export function useAdminProduct(
  productId,
) {
  return useQuery({
    queryKey:
      queryKeys.product(
        productId,
      ),

    queryFn: () =>
      getAdminProduct(
        productId,
      ),

    enabled:
      Boolean(productId),

    staleTime:
      cacheTimes.product,
  });
}

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export function useCreateAdminProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createAdminProduct,

    onSuccess: (
      createdProduct,
    ) => {
      /*
       * نضيف المنتج لكل List Cache
       * ينطبق عليها المنتج الجديد.
       *
       * بدون GET إضافي.
       */
      updateProductsListCaches(
        queryClient,
        (
          currentProducts,
          filters,
        ) => {
          if (
            !matchesProductFilters(
              createdProduct,
              filters,
            )
          ) {
            return currentProducts;
          }

          const alreadyExists =
            currentProducts.some(
              (
                product,
              ) =>
                product.id ===
                createdProduct.id,
            );

          if (alreadyExists) {
            return currentProducts;
          }

          return [
            createdProduct,
            ...currentProducts,
          ];
        },
      );

      /*
       * نخزن التفاصيل مباشرة
       * من نتيجة POST.
       */
      queryClient.setQueryData(
        queryKeys.product(
          createdProduct.id,
        ),
        createdProduct,
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export function useUpdateAdminProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateAdminProduct,

    onSuccess: (
      updatedProduct,
    ) => {
      /*
       * نحدث كل List Cache
       * حسب الفلاتر الخاصة بها.
       *
       * المنتج ممكن:
       *
       * - يفضل داخل القائمة
       * - يخرج منها
       * - يدخل قائمة مكانش فيها
       */
      updateProductsListCaches(
        queryClient,
        (
          currentProducts,
          filters,
        ) => {
          const exists =
            currentProducts.some(
              (
                product,
              ) =>
                product.id ===
                updatedProduct.id,
            );

          const matches =
            matchesProductFilters(
              updatedProduct,
              filters,
            );

          if (
            exists &&
            matches
          ) {
            return currentProducts.map(
              (
                product,
              ) =>
                product.id ===
                updatedProduct.id
                  ? updatedProduct
                  : product,
            );
          }

          if (
            exists &&
            !matches
          ) {
            return currentProducts.filter(
              (
                product,
              ) =>
                product.id !==
                updatedProduct.id,
            );
          }

          if (
            !exists &&
            matches
          ) {
            return [
              updatedProduct,
              ...currentProducts,
            ];
          }

          return currentProducts;
        },
      );

      /*
       * نحدث Detail Cache
       * من نتيجة PATCH نفسها.
       */
      queryClient.setQueryData(
        queryKeys.product(
          updatedProduct.id,
        ),
        updatedProduct,
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export function useDeleteAdminProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminProduct,

    onSuccess: (
      deletedProduct,
    ) => {
      /*
       * نشيل المنتج من كل
       * Product List Cache.
       *
       * بدون GET إضافي.
       */
      updateProductsListCaches(
        queryClient,
        (
          currentProducts,
        ) =>
          currentProducts.filter(
            (
              product,
            ) =>
              product.id !==
              deletedProduct.id,
          ),
      );

      /*
       * نشيل Detail Cache
       * الخاصة بالمنتج المحذوف.
       */
      queryClient.removeQueries({
        queryKey:
          queryKeys.product(
            deletedProduct.id,
          ),
      });
    },
  });
}