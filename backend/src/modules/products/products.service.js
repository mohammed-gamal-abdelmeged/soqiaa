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
| Select
|--------------------------------------------------------------------------
*/

const PRODUCT_SELECT = {
  id: true,

  name: true,
  slug: true,

  description: true,
  imageUrl: true,
  unit: true,

  price: true,
  stock: true,

  badge: true,
  deliveryText: true,

  isBestSeller: true,
  isActive: true,

  ratingAverage: true,
  reviewsCount: true,

  createdAt: true,
  updatedAt: true,

  offer: {
    select: {
      discountPercentage: true,
      isActive: true,
      startsAt: true,
      endsAt: true,
    },
  },

  subcategory: {
    select: {
      id: true,
      name: true,
      slug: true,

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function hasOwn(
  object,
  key
) {
  return Object.prototype
    .hasOwnProperty
    .call(
      object,
      key
    );
}

function isOfferActive(
  offer
) {
  if (
    !offer ||
    !offer.isActive
  ) {
    return false;
  }

  const now =
    Date.now();

  if (
    offer.startsAt &&
    offer.startsAt.getTime() >
      now
  ) {
    return false;
  }

  if (
    offer.endsAt &&
    offer.endsAt.getTime() <=
      now
  ) {
    return false;
  }

  return true;
}

function serializeProduct(
  product
) {
  const discountPercentage =
    isOfferActive(
      product.offer
    )
      ? Number(
          product
            .offer
            .discountPercentage
        )
      : 0;

  return {
    id:
      product.id,

    name:
      product.name,

    slug:
      product.slug,

    image:
      toPublicAssetUrl(
        product.imageUrl
      ),

    unit:
      product.unit,

    price:
      Number(
        product.price
      ),

    discountPercentage,

    description:
      product.description,

    badge:
      product.badge,

    isBestSeller:
      product.isBestSeller,

    rating:
      Number(
        product.ratingAverage
      ),

    reviewsCount:
      product.reviewsCount,

    deliveryText:
      product.deliveryText,

    categorySlug:
      product
        .subcategory
        .category
        .slug,

    subcategoryId:
      product
        .subcategory
        .id,

    stock:
      product.stock,

    isActive:
      product.isActive,
  };
}

async function safeDeleteImage(
  publicPath
) {
  if (!publicPath) {
    return;
  }

  try {
    await deleteStoredImage(
      publicPath
    );
  } catch (error) {
    console.error(
      "Failed to delete product image:",
      error
    );
  }
}

async function ensureProductCategory(
  client,
  categorySlug,
  subcategoryId
) {
  const subcategory =
    await client
      .subcategory
      .findFirst({
        where: {
          id:
            subcategoryId,

          deletedAt:
            null,
        },

        select: {
          id: true,

          category: {
            select: {
              slug: true,
              deletedAt: true,
            },
          },
        },
      });

  if (
    !subcategory ||
    subcategory
      .category
      .deletedAt !== null
  ) {
    throw new AppError(
      "Subcategory not found",
      404,
      "SUBCATEGORY_NOT_FOUND"
    );
  }

  if (
    subcategory
      .category
      .slug !==
    categorySlug
  ) {
    throw new AppError(
      "Subcategory does not belong to the selected category",
      400,
      "INVALID_PRODUCT_CATEGORY"
    );
  }

  return subcategory;
}

async function generateProductSlug(
  value
) {
  return generateUniqueSlug({
    value,

    maxLength: 180,

    exists:
      async (
        slug
      ) => {
        const existing =
          await prisma
            .product
            .findUnique({
              where: {
                slug,
              },

              select: {
                id: true,
              },
            });

        return Boolean(
          existing
        );
      },
  });
}

/*
|--------------------------------------------------------------------------
| Public Products
|--------------------------------------------------------------------------
*/

export async function getPublicProducts() {
  const products =
    await prisma
      .product
      .findMany({
        where: {
          deletedAt: null,
          isActive: true,

          subcategory: {
            is: {
              deletedAt:
                null,

              isActive:
                true,

              category: {
                is: {
                  deletedAt:
                    null,

                  isActive:
                    true,
                },
              },
            },
          },
        },

        select:
          PRODUCT_SELECT,

        orderBy: {
          createdAt:
            "desc",
        },
      });

  return products.map(
    serializeProduct
  );
}

export async function getPublicProductById(
  id
) {
  const product =
    await prisma
      .product
      .findFirst({
        where: {
          id,

          deletedAt:
            null,

          isActive:
            true,

          subcategory: {
            is: {
              deletedAt:
                null,

              isActive:
                true,

              category: {
                is: {
                  deletedAt:
                    null,

                  isActive:
                    true,
                },
              },
            },
          },
        },

        select:
          PRODUCT_SELECT,
      });

  if (!product) {
    throw new AppError(
      "Product not found",
      404,
      "PRODUCT_NOT_FOUND"
    );
  }

  return serializeProduct(
    product
  );
}

/*
|--------------------------------------------------------------------------
| Admin Products
|--------------------------------------------------------------------------
*/

export async function getAdminProducts(
  filters = {}
) {
  const where = {
    deletedAt: null,
  };

  /*
   * Server-side search.
   */
  if (filters.search) {
    where.name = {
      contains:
        filters.search,

      mode:
        "insensitive",
    };
  }

  /*
   * Main Category filter.
   *
   * Product -> Subcategory -> Category
   */
  if (filters.categorySlug) {
    where.subcategory = {
      is: {
        category: {
          is: {
            slug:
              filters.categorySlug,

            deletedAt:
              null,
          },
        },
      },
    };
  }

  if (
    typeof filters.isBestSeller ===
    "boolean"
  ) {
    where.isBestSeller =
      filters.isBestSeller;
  }

  if (
    typeof filters.isActive ===
    "boolean"
  ) {
    where.isActive =
      filters.isActive;
  }

  const products =
    await prisma
      .product
      .findMany({
        where,

        select:
          PRODUCT_SELECT,

        orderBy: {
          createdAt:
            "desc",
        },
      });

  return products.map(
    serializeProduct
  );
}

export async function getAdminProductById(
  id
) {
  const product =
    await prisma
      .product
      .findFirst({
        where: {
          id,

          deletedAt:
            null,
        },

        select:
          PRODUCT_SELECT,
      });

  if (!product) {
    throw new AppError(
      "Product not found",
      404,
      "PRODUCT_NOT_FOUND"
    );
  }

  return serializeProduct(
    product
  );
}

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export async function createProduct(
  data,
  imageFile
) {
  if (
    !imageFile ||
    !imageFile.buffer
  ) {
    throw new AppError(
      "Product image is required",
      400,
      "PRODUCT_IMAGE_REQUIRED"
    );
  }

  await ensureProductCategory(
    prisma,
    data.categorySlug,
    data.subcategoryId
  );

  const processedImage =
    await processImage(
      imageFile.buffer,
      "product"
    );

  const storedImage =
    await saveProcessedImage(
      processedImage.buffer,
      "product"
    );

  const MAX_ATTEMPTS = 5;

  try {
    for (
      let attempt = 1;
      attempt <=
        MAX_ATTEMPTS;
      attempt += 1
    ) {
      const slug =
        await generateProductSlug(
          data.name
        );

      try {
        const product =
          await prisma.$transaction(
            async (
              tx
            ) => {
              const createdProduct =
                await tx.product.create({
                  data: {
                    subcategoryId:
                      data.subcategoryId,

                    name:
                      data.name,

                    slug,

                    description:
                      data.description,

                    imageUrl:
                      storedImage
                        .publicPath,

                    unit:
                      data.unit,

                    price:
                      data.price,

                    stock:
                      data.stock,

                    badge:
                      data.badge,

                    deliveryText:
                      data.deliveryText,

                    isBestSeller:
                      data.isBestSeller,

                    isActive:
                      data.isActive,

                    ratingAverage:
                      data.rating,

                    reviewsCount:
                      data.reviewsCount,
                  },

                  select: {
                    id: true,
                  },
                });

              if (
                data.discountPercentage >
                0
              ) {
                await tx.offer.create({
                  data: {
                    productId:
                      createdProduct.id,

                    discountPercentage:
                      data.discountPercentage,

                    isActive:
                      true,
                  },
                });
              }

              return tx.product.findUnique({
                where: {
                  id:
                    createdProduct.id,
                },

                select:
                  PRODUCT_SELECT,
              });
            }
          );

        return serializeProduct(
          product
        );
      } catch (error) {
        if (
          error?.code ===
            "P2002" &&
          attempt <
            MAX_ATTEMPTS
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new AppError(
      "Could not generate a unique product slug",
      409,
      "PRODUCT_SLUG_CONFLICT"
    );
  } catch (error) {
    await safeDeleteImage(
      storedImage.publicPath
    );

    if (
      error?.code ===
      "P2002"
    ) {
      throw new AppError(
        "Product already exists",
        409,
        "PRODUCT_CONFLICT"
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export async function updateProduct(
  id,
  data,
  imageFile = null
) {
  const currentProduct =
    await prisma
      .product
      .findFirst({
        where: {
          id,
          deletedAt:
            null,
        },

        select: {
          id: true,

          imageUrl:
            true,

          subcategoryId:
            true,

          subcategory: {
            select: {
              category: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
      });

  if (!currentProduct) {
    throw new AppError(
      "Product not found",
      404,
      "PRODUCT_NOT_FOUND"
    );
  }

  const nextCategorySlug =
    data.categorySlug ??
    currentProduct
      .subcategory
      .category
      .slug;

  const nextSubcategoryId =
    data.subcategoryId ??
    currentProduct
      .subcategoryId;

  if (
    hasOwn(
      data,
      "categorySlug"
    ) ||
    hasOwn(
      data,
      "subcategoryId"
    )
  ) {
    await ensureProductCategory(
      prisma,
      nextCategorySlug,
      nextSubcategoryId
    );
  }

  let storedImage =
    null;

  if (
    imageFile?.buffer
  ) {
    const processedImage =
      await processImage(
        imageFile.buffer,
        "product"
      );

    storedImage =
      await saveProcessedImage(
        processedImage.buffer,
        "product"
      );
  }

  try {
    const product =
      await prisma.$transaction(
        async (
          tx
        ) => {
          const updateData =
            {};

          if (
            hasOwn(
              data,
              "name"
            )
          ) {
            updateData.name =
              data.name;
          }

          /*
           * Slug deliberately
           * does not change
           * when product name
           * changes.
           */

          if (
            hasOwn(
              data,
              "subcategoryId"
            )
          ) {
            updateData.subcategoryId =
              data.subcategoryId;
          }

          if (
            hasOwn(
              data,
              "description"
            )
          ) {
            updateData.description =
              data.description;
          }

          if (
            storedImage
          ) {
            updateData.imageUrl =
              storedImage
                .publicPath;
          }

          if (
            hasOwn(
              data,
              "unit"
            )
          ) {
            updateData.unit =
              data.unit;
          }

          if (
            hasOwn(
              data,
              "price"
            )
          ) {
            updateData.price =
              data.price;
          }

          if (
            hasOwn(
              data,
              "stock"
            )
          ) {
            updateData.stock =
              data.stock;
          }

          if (
            hasOwn(
              data,
              "badge"
            )
          ) {
            updateData.badge =
              data.badge;
          }

          if (
            hasOwn(
              data,
              "deliveryText"
            )
          ) {
            updateData.deliveryText =
              data.deliveryText;
          }

          if (
            hasOwn(
              data,
              "isBestSeller"
            )
          ) {
            updateData.isBestSeller =
              data.isBestSeller;
          }

          if (
            hasOwn(
              data,
              "isActive"
            )
          ) {
            updateData.isActive =
              data.isActive;
          }

          if (
            hasOwn(
              data,
              "rating"
            )
          ) {
            updateData.ratingAverage =
              data.rating;
          }

          if (
            hasOwn(
              data,
              "reviewsCount"
            )
          ) {
            updateData.reviewsCount =
              data.reviewsCount;
          }

          if (
            Object.keys(
              updateData
            ).length >
            0
          ) {
            await tx.product.update({
              where: {
                id,
              },

              data:
                updateData,
            });
          }

          if (
            hasOwn(
              data,
              "discountPercentage"
            )
          ) {
            if (
              data.discountPercentage >
              0
            ) {
              await tx.offer.upsert({
                where: {
                  productId:
                    id,
                },

                create: {
                  productId:
                    id,

                  discountPercentage:
                    data.discountPercentage,

                  isActive:
                    true,

                  startsAt:
                    null,

                  endsAt:
                    null,
                },

                update: {
                  discountPercentage:
                    data.discountPercentage,

                  isActive:
                    true,

                  startsAt:
                    null,

                  endsAt:
                    null,
                },
              });
            } else {
              await tx.offer.updateMany({
                where: {
                  productId:
                    id,
                },

                data: {
                  isActive:
                    false,
                },
              });
            }
          }

          return tx.product.findUnique({
            where: {
              id,
            },

            select:
              PRODUCT_SELECT,
          });
        }
      );

    if (
      storedImage
    ) {
      await safeDeleteImage(
        currentProduct
          .imageUrl
      );
    }

    return serializeProduct(
      product
    );
  } catch (error) {
    if (
      storedImage
    ) {
      await safeDeleteImage(
        storedImage
          .publicPath
      );
    }

    if (
      error?.code ===
      "P2002"
    ) {
      throw new AppError(
        "Product conflict",
        409,
        "PRODUCT_CONFLICT"
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
|
| Hard Delete:
|
| المنتج نفسه يتحذف نهائيًا من قاعدة البيانات.
|
| علاقات Product في Prisma متظبطة بحيث:
|
| Offer / Favorite / CartItem
| يتم التعامل معها حسب onDelete الموجود في الـSchema.
|
| OrderItem يحتفظ ببيانات الطلب التاريخية،
| و productId يتحول إلى null.
|--------------------------------------------------------------------------
*/

export async function deleteProduct(
  id
) {
  const currentProduct =
    await prisma
      .product
      .findFirst({
        where: {
          id,

          deletedAt:
            null,
        },

        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      });

  if (!currentProduct) {
    throw new AppError(
      "Product not found",
      404,
      "PRODUCT_NOT_FOUND"
    );
  }

  /*
   * نحذف من DB الأول.
   *
   * لو حذف الصورة حصل فيه مشكلة بعد كده،
   * منخليش ده يرجع المنتج للداتا بيز.
   */
  await prisma
    .product
    .delete({
      where: {
        id:
          currentProduct.id,
      },
    });

  /*
   * بعد نجاح حذف الداتا،
   * نمسح الصورة من التخزين.
   */
  await safeDeleteImage(
    currentProduct.imageUrl
  );

  return {
    id:
      currentProduct.id,

    name:
      currentProduct.name,
  };
}