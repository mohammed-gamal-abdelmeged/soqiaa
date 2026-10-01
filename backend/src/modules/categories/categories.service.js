import { prisma } from "../../database/prisma.js";

import { AppError } from "../../shared/errors/AppError.js";

import {
  processImage,
} from "../../shared/uploads/imageProcessor.js";

import {
  deleteStoredImage,
  saveProcessedImage,
} from "../../shared/uploads/imageStorage.js";

import {
  toPublicAssetUrl,
} from "../../shared/uploads/assetUrl.js";

import {
  generateUniqueSlug,
} from "../../shared/utils/slug.js";

/*
|--------------------------------------------------------------------------
| Shared Selects
|--------------------------------------------------------------------------
*/

const CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,

  imageUrl: true,

  bannerImageUrl: true,
  bannerTitle: true,
  bannerSubtitle: true,

  sortOrder: true,
  isActive: true,
};

const SUBCATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,

  sortOrder: true,
  isActive: true,
};

/*
|--------------------------------------------------------------------------
| Serializers
|--------------------------------------------------------------------------
*/

function serializeSubcategory(
  subcategory
) {
  return {
    id: subcategory.id,
    name: subcategory.name,
    slug: subcategory.slug,

    sortOrder:
      subcategory.sortOrder,

    isActive:
      subcategory.isActive,
  };
}

function serializeCategoryListItem(
  category
) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,

    image:
      toPublicAssetUrl(
        category.imageUrl
      ),

    sortOrder:
      category.sortOrder,

    isActive:
      category.isActive,
  };
}

function serializeCategory(
  category
) {
  const result = {
    id: category.id,
    name: category.name,
    slug: category.slug,

    image:
      toPublicAssetUrl(
        category.imageUrl
      ),

    sortOrder:
      category.sortOrder,

    isActive:
      category.isActive,

    banner: {
      image:
        toPublicAssetUrl(
          category.bannerImageUrl
        ),

      title:
        category.bannerTitle,

      subtitle:
        category.bannerSubtitle,
    },
  };

  if (
    Array.isArray(
      category.subcategories
    )
  ) {
    result.subcategories =
      category.subcategories.map(
        serializeSubcategory
      );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

async function ensureCategoryExists(
  categoryId
) {
  const category =
    await prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!category) {
    throw new AppError(
      "Category not found",
      404,
      "CATEGORY_NOT_FOUND"
    );
  }

  return category;
}

/*
|--------------------------------------------------------------------------
| Active Sort Order
|--------------------------------------------------------------------------
|
| الـ sortOrder محجوز فقط للأقسام النشطة.
|
| لذلك:
|
| Active + Active بنفس الرقم      => Conflict
| Inactive + Active بنفس الرقم    => Allowed
| Inactive + Inactive بنفس الرقم  => Allowed
|
|--------------------------------------------------------------------------
*/

async function findActiveCategoryBySortOrder(
  sortOrder,
  excludeCategoryId = null,
  client = prisma
) {
  return client.category.findFirst({
    where: {
      sortOrder,

      isActive: true,

      deletedAt: null,

      ...(excludeCategoryId
        ? {
            id: {
              not:
                excludeCategoryId,
            },
          }
        : {}),
    },

    select: {
      id: true,
      name: true,
      slug: true,
      sortOrder: true,
      isActive: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Next Active Sort Order
|--------------------------------------------------------------------------
|
| لو عندنا أقسام نشطة:
|
| 1 2 3 4 5 6 7 8
|
| القسم الذي سيتم إزاحته أثناء الاستبدال
| ينتقل إلى:
|
| 9
|
|--------------------------------------------------------------------------
*/

async function getNextActiveCategorySortOrder(
  client = prisma
) {
  const lastActiveCategory =
    await client.category.findFirst({
      where: {
        deletedAt: null,
        isActive: true,
      },

      orderBy: [
        {
          sortOrder:
            "desc",
        },
        {
          id:
            "desc",
        },
      ],

      select: {
        sortOrder: true,
      },
    });

  return (
    lastActiveCategory
      ?.sortOrder ?? 0
  ) + 1;
}

/*
|--------------------------------------------------------------------------
| Sort Order Conflict
|--------------------------------------------------------------------------
|
| نرجع للـ Admin:
|
| - الرقم المتعارض
| - القسم الذي يستخدم الرقم
| - الرقم الذي سينتقل إليه عند الاستبدال
|
|--------------------------------------------------------------------------
*/

async function throwCategorySortOrderConflict(
  sortOrder,
  conflictingCategory,
  client = prisma
) {
  const replacementSortOrder =
    await getNextActiveCategorySortOrder(
      client
    );

  throw new AppError(
    `Sort order ${sortOrder} is already in use by category ${conflictingCategory.name}`,
    409,
    "CATEGORY_SORT_ORDER_CONFLICT",
    {
      sortOrder,

      conflictingCategory: {
        id:
          conflictingCategory.id,

        name:
          conflictingCategory.name,

        slug:
          conflictingCategory.slug,

        sortOrder:
          conflictingCategory.sortOrder,
      },

      replacementSortOrder,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Active Subcategory Sort Order
|--------------------------------------------------------------------------
|
| نفس قاعدة الأقسام الرئيسية، لكن داخل نفس الـCategory فقط.
|
| Active + Active بنفس الرقم      => Conflict
| Inactive + Active بنفس الرقم    => Allowed
| Inactive + Inactive بنفس الرقم  => Allowed
|
|--------------------------------------------------------------------------
*/

async function findActiveSubcategoryBySortOrder(
  categoryId,
  sortOrder,
  excludeSubcategoryId = null,
  client = prisma
) {
  return client.subcategory.findFirst({
    where: {
      categoryId,

      sortOrder,

      isActive: true,

      deletedAt: null,

      ...(excludeSubcategoryId
        ? {
            id: {
              not:
                excludeSubcategoryId,
            },
          }
        : {}),
    },

    select:
      SUBCATEGORY_SELECT,
  });
}

async function getNextActiveSubcategorySortOrder(
  categoryId,
  client = prisma
) {
  const lastActiveSubcategory =
    await client.subcategory.findFirst({
      where: {
        categoryId,
        deletedAt: null,
        isActive: true,
      },

      orderBy: [
        {
          sortOrder:
            "desc",
        },
        {
          id:
            "desc",
        },
      ],

      select: {
        sortOrder: true,
      },
    });

  return (
    lastActiveSubcategory
      ?.sortOrder ?? 0
  ) + 1;
}

async function throwSubcategorySortOrderConflict(
  categoryId,
  sortOrder,
  conflictingSubcategory,
  client = prisma
) {
  const replacementSortOrder =
    await getNextActiveSubcategorySortOrder(
      categoryId,
      client
    );

  throw new AppError(
    `Sort order ${sortOrder} is already in use by subcategory ${conflictingSubcategory.name}`,
    409,
    "SUBCATEGORY_SORT_ORDER_CONFLICT",
    {
      sortOrder,

      conflictingSubcategory: {
        id:
          conflictingSubcategory.id,

        name:
          conflictingSubcategory.name,

        slug:
          conflictingSubcategory.slug,

        sortOrder:
          conflictingSubcategory.sortOrder,
      },

      replacementSortOrder,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Serializable Transaction
|--------------------------------------------------------------------------
|
| مهم في التبديل عشان العملية تكون Atomic:
|
| - القسم الجديد ياخد مكان القديم
| - القديم يروح آخر القائمة
|
| يا الاتنين يحصلوا مع بعض
| يا مفيش أي تغيير.
|
|--------------------------------------------------------------------------
*/

async function runSerializableTransaction(
  work,
  maxAttempts = 3
) {
  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt += 1
  ) {
    try {
      return await prisma.$transaction(
        work,
        {
          isolationLevel:
            "Serializable",
        }
      );
    } catch (error) {
      const canRetry =
        error?.code ===
          "P2034" &&
        attempt <
          maxAttempts;

      if (canRetry) {
        continue;
      }

      throw error;
    }
  }
}

async function createCategorySlug(
  name
) {
  return generateUniqueSlug({
    value: name,

    exists: async (
      slug
    ) => {
      const category =
        await prisma.category.findUnique({
          where: {
            slug,
          },

          select: {
            id: true,
          },
        });

      return Boolean(
        category
      );
    },
  });
}

async function createSubcategorySlug(
  categoryId,
  name
) {
  return generateUniqueSlug({
    value: name,

    exists: async (
      slug
    ) => {
      const subcategory =
        await prisma.subcategory.findFirst({
          where: {
            categoryId,
            slug,
          },

          select: {
            id: true,
          },
        });

      return Boolean(
        subcategory
      );
    },
  });
}

async function processAndStoreImage(
  file,
  presetName,
  storageType
) {
  const processedImage =
    await processImage(
      file.buffer,
      presetName
    );

  return saveProcessedImage(
    processedImage.buffer,
    storageType
  );
}

async function cleanupImages(
  publicPaths
) {
  const results =
    await Promise.allSettled(
      publicPaths
        .filter(Boolean)
        .map(
          (
            publicPath
          ) =>
            deleteStoredImage(
              publicPath
            )
        )
    );

  for (
    const result of results
  ) {
    if (
      result.status ===
      "rejected"
    ) {
      console.error(
        "Failed to clean up image:",
        result.reason
      );
    }
  }
}

/*
|--------------------------------------------------------------------------
| Public Categories
|--------------------------------------------------------------------------
*/

export async function getPublicCategories() {
  const categories =
    await prisma.category.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },

      orderBy: [
        {
          sortOrder:
            "asc",
        },
        {
          id:
            "asc",
        },
      ],

      select: {
        id: true,
        name: true,
        slug: true,

        imageUrl: true,

        sortOrder: true,
        isActive: true,
      },
    });

  return categories.map(
    serializeCategoryListItem
  );
}

export async function getPublicCategoryBySlug(
  slug
) {
  const category =
    await prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        slug: true,

        imageUrl: true,

        bannerImageUrl: true,
        bannerTitle: true,
        bannerSubtitle: true,

        sortOrder: true,
        isActive: true,

        subcategories: {
          where: {
            deletedAt: null,
            isActive: true,
          },

          orderBy: {
            sortOrder:
              "asc",
          },

          select: {
            id: true,
            name: true,
            slug: true,

            sortOrder:
              true,

            isActive:
              true,
          },
        },
      },
    });

  if (!category) {
    throw new AppError(
      "Category not found",
      404,
      "CATEGORY_NOT_FOUND"
    );
  }

  return serializeCategory(
    category
  );
}

/*
|--------------------------------------------------------------------------
| Admin Categories
|--------------------------------------------------------------------------
*/

export async function getAdminCategories() {
  const categories =
    await prisma.category.findMany({
      where: {
        deletedAt: null,
      },

      /*
       * دلوقتي ممكن أكتر من Inactive Category
       * يكون عنده نفس sortOrder.
       *
       * لذلك نعمل Sort ثابت وواضح.
       */
      orderBy: [
        {
          sortOrder:
            "asc",
        },
        {
          isActive:
            "desc",
        },
        {
          createdAt:
            "asc",
        },
        {
          id:
            "asc",
        },
      ],

      select:
        CATEGORY_SELECT,
    });

  return categories.map(
    serializeCategory
  );
}

export async function getAdminCategoryBySlug(
  slug
) {
  const category =
    await prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
      },

      select: {
        ...CATEGORY_SELECT,

        subcategories: {
          where: {
            deletedAt: null,
          },

          orderBy: [
            {
              sortOrder:
                "asc",
            },
            {
              isActive:
                "desc",
            },
            {
              id:
                "asc",
            },
          ],

          select:
            SUBCATEGORY_SELECT,
        },
      },
    });

  if (!category) {
    throw new AppError(
      "Category not found",
      404,
      "CATEGORY_NOT_FOUND"
    );
  }

  return serializeCategory(
    category
  );
}

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export async function createCategory(
  data,
  files
) {
  const categoryImage =
    files?.categoryImage?.[0];

  const bannerImage =
    files?.bannerImage?.[0];

  if (!categoryImage) {
    throw new AppError(
      "Category image is required",
      400,
      "CATEGORY_IMAGE_REQUIRED"
    );
  }

  if (!bannerImage) {
    throw new AppError(
      "Banner image is required",
      400,
      "BANNER_IMAGE_REQUIRED"
    );
  }

  /*
   * مهم:
   *
   * القسم غير النشط لا يحجز sortOrder.
   *
   * لذلك نتحقق من التعارض فقط
   * لو القسم الجديد سيكون Active.
   */
  if (data.isActive) {
    const conflict =
      await findActiveCategoryBySortOrder(
        data.sortOrder
      );

    if (conflict) {
      await throwCategorySortOrderConflict(
        data.sortOrder,
        conflict
      );
    }
  }

  const slug =
    await createCategorySlug(
      data.name
    );

  let storedCategoryImage =
    null;

  let storedBannerImage =
    null;

  try {
    /*
      Intentionally sequential.

      Image processing is CPU intensive.

      Admin uploads are infrequent,
      so avoiding two simultaneous
      Sharp jobs helps protect
      storefront responsiveness.
    */

    storedCategoryImage =
      await processAndStoreImage(
        categoryImage,
        "category",
        "category"
      );

    storedBannerImage =
      await processAndStoreImage(
        bannerImage,
        "categoryBanner",
        "categoryBanner"
      );

    /*
     * نعيد التحقق داخل Transaction
     * لحماية العملية من Race Conditions.
     */
    const category =
      await runSerializableTransaction(
        async (
          tx
        ) => {
          if (
            data.isActive
          ) {
            const conflict =
              await findActiveCategoryBySortOrder(
                data.sortOrder,
                null,
                tx
              );

            if (
              conflict
            ) {
              await throwCategorySortOrderConflict(
                data.sortOrder,
                conflict,
                tx
              );
            }
          }

          return tx.category.create({
            data: {
              name:
                data.name,

              slug,

              imageUrl:
                storedCategoryImage.publicPath,

              bannerImageUrl:
                storedBannerImage.publicPath,

              bannerTitle:
                data.bannerTitle,

              bannerSubtitle:
                data.bannerSubtitle,

              sortOrder:
                data.sortOrder,

              isActive:
                data.isActive,
            },

            select:
              CATEGORY_SELECT,
          });
        }
      );

    return serializeCategory(
      category
    );
  } catch (error) {
    await cleanupImages([
      storedCategoryImage
        ?.publicPath,

      storedBannerImage
        ?.publicPath,
    ]);

    if (
      error?.code ===
      "P2002"
    ) {
      throw new AppError(
        "Category conflicts with an existing category",
        409,
        "CATEGORY_CONFLICT"
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/

export async function updateCategory(
  categoryId,
  data,
  files
) {
  const existingCategory =
    await prisma.category.findFirst({
      where: {
        id:
          categoryId,

        deletedAt:
          null,
      },

      select: {
        id: true,
        name: true,
        slug: true,

        imageUrl:
          true,

        bannerImageUrl:
          true,

        sortOrder:
          true,

        isActive:
          true,
      },
    });

  if (!existingCategory) {
    throw new AppError(
      "Category not found",
      404,
      "CATEGORY_NOT_FOUND"
    );
  }

  const categoryImage =
    files?.categoryImage?.[0];

  const bannerImage =
    files?.bannerImage?.[0];

  /*
   * دي Command Flag.
   *
   * مش Field داخل جدول Category.
   *
   * لما الأدمن يوافق على:
   *
   * "تفعيل القسم بدل القسم الموجود"
   *
   * الـFrontend هيبعتها true.
   */
  const {
    replaceSortOrderConflict =
      false,

    ...categoryChanges
  } = data;

  const hasBodyChanges =
    Object.keys(
      categoryChanges
    ).length > 0;

  if (
    !hasBodyChanges &&
    !categoryImage &&
    !bannerImage
  ) {
    throw new AppError(
      "At least one field or image must be provided",
      400,
      "NO_CATEGORY_CHANGES"
    );
  }

  const targetSortOrder =
    categoryChanges
      .sortOrder ??
    existingCategory
      .sortOrder;

  const targetIsActive =
    categoryChanges
      .isActive ??
    existingCategory
      .isActive;

  if (
    targetIsActive &&
    !replaceSortOrderConflict
  ) {
    const conflict =
      await findActiveCategoryBySortOrder(
        targetSortOrder,
        categoryId
      );

    if (conflict) {
      await throwCategorySortOrderConflict(
        targetSortOrder,
        conflict
      );
    }
  }

  let newCategoryImage =
    null;

  let newBannerImage =
    null;

  try {
    if (categoryImage) {
      newCategoryImage =
        await processAndStoreImage(
          categoryImage,
          "category",
          "category"
        );
    }

    if (bannerImage) {
      newBannerImage =
        await processAndStoreImage(
          bannerImage,
          "categoryBanner",
          "categoryBanner"
        );
    }

    const updateData = {
      ...categoryChanges,
    };

    if (
      newCategoryImage
    ) {
      updateData.imageUrl =
        newCategoryImage
          .publicPath;
    }

    if (
      newBannerImage
    ) {
      updateData.bannerImageUrl =
        newBannerImage
          .publicPath;
    }

    /*
      Slug intentionally does NOT change
      when the category name is edited.

      This prevents breaking existing URLs.
    */

    const result =
      await runSerializableTransaction(
        async (
          tx
        ) => {
          const currentCategory =
            await tx.category.findFirst({
              where: {
                id:
                  categoryId,

                deletedAt:
                  null,
              },

              select: {
                id: true,

                sortOrder:
                  true,

                isActive:
                  true,
              },
            });

          if (
            !currentCategory
          ) {
            throw new AppError(
              "Category not found",
              404,
              "CATEGORY_NOT_FOUND"
            );
          }

          const effectiveSortOrder =
            updateData
              .sortOrder ??
            currentCategory
              .sortOrder;

          const effectiveIsActive =
            updateData
              .isActive ??
            currentCategory
              .isActive;

          let movedCategory =
            null;

          if (
            effectiveIsActive
          ) {
            const conflict =
              await findActiveCategoryBySortOrder(
                effectiveSortOrder,
                categoryId,
                tx
              );

            if (
              conflict
            ) {
              if (
                !replaceSortOrderConflict
              ) {
                await throwCategorySortOrderConflict(
                  effectiveSortOrder,
                  conflict,
                  tx
                );
              }

              const nextSortOrder =
                await getNextActiveCategorySortOrder(
                  tx
                );

              movedCategory =
                await tx.category.update({
                  where: {
                    id:
                      conflict.id,
                  },

                  data: {
                    sortOrder:
                      nextSortOrder,
                  },

                  select:
                    CATEGORY_SELECT,
                });
            }
          }

          const category =
            await tx.category.update({
              where: {
                id:
                  categoryId,
              },

              data:
                updateData,

              select:
                CATEGORY_SELECT,
            });

          return {
            category,
            movedCategory,
          };
        }
      );

    const oldImages = [];

    if (
      newCategoryImage &&
      existingCategory
        .imageUrl
    ) {
      oldImages.push(
        existingCategory
          .imageUrl
      );
    }

    if (
      newBannerImage &&
      existingCategory
        .bannerImageUrl
    ) {
      oldImages.push(
        existingCategory
          .bannerImageUrl
      );
    }

    await cleanupImages(
      oldImages
    );

    const serializedCategory =
      serializeCategory(
        result.category
      );

    if (
      result.movedCategory
    ) {
      serializedCategory
        .replacement = {
        movedCategory:
          serializeCategory(
            result.movedCategory
          ),
      };
    }

    return serializedCategory;
  } catch (error) {
    await cleanupImages([
      newCategoryImage
        ?.publicPath,

      newBannerImage
        ?.publicPath,
    ]);

    if (
      error?.code ===
      "P2002"
    ) {
      throw new AppError(
        "Category conflicts with an existing category",
        409,
        "CATEGORY_CONFLICT"
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
|
| مازلنا محتفظين بالـAPI كـsoft delete،
| حتى لو Admin UI مش هيستخدم زر الحذف حاليًا.
|
|--------------------------------------------------------------------------
*/

export async function deleteCategory(
  categoryId
) {
  await ensureCategoryExists(
    categoryId
  );

  await prisma.category.update({
    where: {
      id:
        categoryId,
    },

    data: {
      isActive:
        false,

      deletedAt:
        new Date(),
    },
  });

  return {
    id:
      categoryId,
  };
}

/*
|--------------------------------------------------------------------------
| Subcategories
|--------------------------------------------------------------------------
*/

export async function createSubcategory(
  categoryId,
  data
) {
  await ensureCategoryExists(
    categoryId
  );

  const MAX_ATTEMPTS =
    5;

  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS;
    attempt += 1
  ) {
    /*
     * الـInactive لا يحجز sortOrder.
     * لذلك القسم الفرعي الجديد يأخذ:
     * highest active sortOrder + 1
     */
    const sortOrder =
      await getNextActiveSubcategorySortOrder(
        categoryId
      );

    const slug =
      await createSubcategorySlug(
        categoryId,
        data.name
      );

    try {
      const subcategory =
        await prisma.subcategory.create({
          data: {
            categoryId,

            name:
              data.name,

            slug,

            sortOrder,

            isActive:
              true,
          },

          select:
            SUBCATEGORY_SELECT,
        });

      return serializeSubcategory(
        subcategory
      );
    } catch (error) {
      const isUniqueConflict =
        error?.code ===
        "P2002";

      if (
        isUniqueConflict &&
        attempt <
          MAX_ATTEMPTS
      ) {
        continue;
      }

      if (
        isUniqueConflict
      ) {
        throw new AppError(
          "Could not create subcategory because of a concurrent update. Please try again.",
          409,
          "SUBCATEGORY_CONFLICT"
        );
      }

      throw error;
    }
  }
}

export async function updateSubcategory(
  subcategoryId,
  data
) {
  const existingSubcategory =
    await prisma.subcategory.findFirst({
      where: {
        id:
          subcategoryId,

        deletedAt:
          null,
      },

      select: {
        id: true,
        categoryId: true,
        sortOrder: true,
        isActive: true,
      },
    });

  if (
    !existingSubcategory
  ) {
    throw new AppError(
      "Subcategory not found",
      404,
      "SUBCATEGORY_NOT_FOUND"
    );
  }

  /*
   * Command flag فقط.
   * لا يتم حفظها في جدول Subcategory.
   */
  const {
    replaceSortOrderConflict =
      false,

    ...subcategoryChanges
  } = data;

  const hasChanges =
    Object.keys(
      subcategoryChanges
    ).length > 0;

  if (!hasChanges) {
    throw new AppError(
      "At least one subcategory field must be provided",
      400,
      "NO_SUBCATEGORY_CHANGES"
    );
  }

  const targetSortOrder =
    subcategoryChanges
      .sortOrder ??
    existingSubcategory
      .sortOrder;

  const targetIsActive =
    subcategoryChanges
      .isActive ??
    existingSubcategory
      .isActive;

  /*
   * Fast pre-check قبل الـTransaction.
   * لو التفعيل سيصطدم بقسم فرعي نشط آخر،
   * نرجع 409 ومعاه بيانات الـConfirmation Modal.
   */
  if (
    targetIsActive &&
    !replaceSortOrderConflict
  ) {
    const conflict =
      await findActiveSubcategoryBySortOrder(
        existingSubcategory.categoryId,
        targetSortOrder,
        subcategoryId
      );

    if (conflict) {
      await throwSubcategorySortOrderConflict(
        existingSubcategory.categoryId,
        targetSortOrder,
        conflict
      );
    }
  }

  const result =
    await runSerializableTransaction(
      async (
        tx
      ) => {
        const currentSubcategory =
          await tx.subcategory.findFirst({
            where: {
              id:
                subcategoryId,

              deletedAt:
                null,
            },

            select: {
              id: true,
              categoryId: true,
              sortOrder: true,
              isActive: true,
            },
          });

        if (
          !currentSubcategory
        ) {
          throw new AppError(
            "Subcategory not found",
            404,
            "SUBCATEGORY_NOT_FOUND"
          );
        }

        const effectiveSortOrder =
          subcategoryChanges
            .sortOrder ??
          currentSubcategory
            .sortOrder;

        const effectiveIsActive =
          subcategoryChanges
            .isActive ??
          currentSubcategory
            .isActive;

        let movedSubcategory =
          null;

        if (effectiveIsActive) {
          const conflict =
            await findActiveSubcategoryBySortOrder(
              currentSubcategory.categoryId,
              effectiveSortOrder,
              subcategoryId,
              tx
            );

          if (conflict) {
            if (
              !replaceSortOrderConflict
            ) {
              await throwSubcategorySortOrderConflict(
                currentSubcategory.categoryId,
                effectiveSortOrder,
                conflict,
                tx
              );
            }

            const nextSortOrder =
              await getNextActiveSubcategorySortOrder(
                currentSubcategory.categoryId,
                tx
              );

            movedSubcategory =
              await tx.subcategory.update({
                where: {
                  id:
                    conflict.id,
                },

                data: {
                  sortOrder:
                    nextSortOrder,
                },

                select:
                  SUBCATEGORY_SELECT,
              });
          }
        }

        const subcategory =
          await tx.subcategory.update({
            where: {
              id:
                subcategoryId,
            },

            data:
              subcategoryChanges,

            select:
              SUBCATEGORY_SELECT,
          });

        return {
          subcategory,
          movedSubcategory,
        };
      }
    );

  /*
   * Same rule as Category:
   * editing the name does not change slug.
   */
  const serializedSubcategory =
    serializeSubcategory(
      result.subcategory
    );

  if (
    result.movedSubcategory
  ) {
    serializedSubcategory
      .replacement = {
      movedSubcategory:
        serializeSubcategory(
          result.movedSubcategory
        ),
    };
  }

  return serializedSubcategory;
}

/*
|--------------------------------------------------------------------------
| Delete Subcategory
|--------------------------------------------------------------------------
|
| نحتفظ بالـAPI كـsoft delete.
| واجهة الإدارة الرئيسية للـSubcategories
| ستستخدم Active / Inactive بدل زر الحذف.
|
|--------------------------------------------------------------------------
*/

export async function deleteSubcategory(
  subcategoryId
) {
  const subcategory =
    await prisma.subcategory.findFirst({
      where: {
        id:
          subcategoryId,

        deletedAt:
          null,
      },

      select: {
        id:
          true,
      },
    });

  if (!subcategory) {
    throw new AppError(
      "Subcategory not found",
      404,
      "SUBCATEGORY_NOT_FOUND"
    );
  }

  await prisma.subcategory.update({
    where: {
      id:
        subcategoryId,
    },

    data: {
      isActive:
        false,

      deletedAt:
        new Date(),
    },
  });

  return {
    id:
      subcategoryId,
  };
}