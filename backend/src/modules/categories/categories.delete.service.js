import {
  prisma,
} from "../../database/prisma.js";

import {
  AppError,
} from "../../shared/errors/AppError.js";

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
|
| Safe cascading soft delete:
|
| Category
|   -> Subcategories
|       -> Products
|
| Nothing is hard-deleted.
|
| We intentionally keep:
|
| - Product rows
| - Offers
| - Favorites
| - Cart items
| - Order items
| - Uploaded images
|
| This preserves all historical data.
|--------------------------------------------------------------------------
*/

export async function deleteCategory(
  categoryId,
) {
  return prisma.$transaction(
    async (tx) => {
      const category =
        await tx.category.findFirst({
          where: {
            id:
              categoryId,

            deletedAt:
              null,
          },

          select: {
            id: true,
            name: true,
          },
        });

      if (!category) {
        throw new AppError(
          "Category not found",
          404,
          "CATEGORY_NOT_FOUND",
        );
      }

      const deletedAt =
        new Date();

      /*
       * Get all active/non-deleted
       * subcategories belonging to
       * this category.
       */
      const subcategories =
        await tx.subcategory.findMany({
          where: {
            categoryId:
              category.id,

            deletedAt:
              null,
          },

          select: {
            id: true,
          },
        });

      const subcategoryIds =
        subcategories.map(
          (subcategory) =>
            subcategory.id,
        );

      /*
       * Soft-delete products first.
       *
       * Product rows remain in DB,
       * so historical relations stay intact.
       */
      let deletedProductsCount =
        0;

      if (
        subcategoryIds.length >
        0
      ) {
        const productsResult =
          await tx.product.updateMany({
            where: {
              subcategoryId: {
                in:
                  subcategoryIds,
              },

              deletedAt:
                null,
            },

            data: {
              isActive:
                false,

              deletedAt,
            },
          });

        deletedProductsCount =
          productsResult.count;
      }

      /*
       * Soft-delete all subcategories.
       */
      const subcategoriesResult =
        await tx.subcategory.updateMany({
          where: {
            categoryId:
              category.id,

            deletedAt:
              null,
          },

          data: {
            isActive:
              false,

            deletedAt,
          },
        });

      /*
       * Finally soft-delete category.
       */
      await tx.category.update({
        where: {
          id:
            category.id,
        },

        data: {
          isActive:
            false,

          deletedAt,
        },
      });

      return {
        id:
          category.id,

        name:
          category.name,

        deletedSubcategories:
          subcategoriesResult.count,

        deletedProducts:
          deletedProductsCount,
      };
    },
  );
}

/*
|--------------------------------------------------------------------------
| Delete Subcategory
|--------------------------------------------------------------------------
|
| Safe cascading soft delete:
|
| Subcategory
|   -> Products
|
| Parent Category is untouched.
|--------------------------------------------------------------------------
*/

export async function deleteSubcategory(
  subcategoryId,
) {
  return prisma.$transaction(
    async (tx) => {
      const subcategory =
        await tx.subcategory.findFirst({
          where: {
            id:
              subcategoryId,

            deletedAt:
              null,
          },

          select: {
            id: true,
            name: true,
            categoryId:
              true,
          },
        });

      if (!subcategory) {
        throw new AppError(
          "Subcategory not found",
          404,
          "SUBCATEGORY_NOT_FOUND",
        );
      }

      const deletedAt =
        new Date();

      /*
       * Soft-delete products under
       * this subcategory.
       */
      const productsResult =
        await tx.product.updateMany({
          where: {
            subcategoryId:
              subcategory.id,

            deletedAt:
              null,
          },

          data: {
            isActive:
              false,

            deletedAt,
          },
        });

      /*
       * Soft-delete subcategory.
       */
      await tx.subcategory.update({
        where: {
          id:
            subcategory.id,
        },

        data: {
          isActive:
            false,

          deletedAt,
        },
      });

      return {
        id:
          subcategory.id,

        name:
          subcategory.name,

        categoryId:
          subcategory.categoryId,

        deletedProducts:
          productsResult.count,
      };
    },
  );
}