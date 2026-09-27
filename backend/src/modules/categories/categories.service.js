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

async function ensureCategorySortOrderAvailable(
  sortOrder,
  excludeCategoryId = null
) {
  const existingCategory =
    await prisma.category.findFirst({
      where: {
        sortOrder,
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
      },
    });

  if (existingCategory) {
    throw new AppError(
      `Sort order ${sortOrder} is already in use`,
      409,
      "CATEGORY_SORT_ORDER_CONFLICT"
    );
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

      return Boolean(category);
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
          (publicPath) =>
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

      orderBy: {
        sortOrder: "asc",
      },

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
            sortOrder: "asc",
          },

          select: {
            id: true,
            name: true,
            slug: true,
            sortOrder: true,
            isActive: true,
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

      orderBy: {
        sortOrder: "asc",
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
      },
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
          },

          orderBy: {
            sortOrder: "asc",
          },

          select: {
            id: true,
            name: true,
            slug: true,
            sortOrder: true,
            isActive: true,
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

  await ensureCategorySortOrderAvailable(
    data.sortOrder
  );

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
      Admin uploads are infrequent, so
      avoiding two simultaneous Sharp jobs
      helps protect storefront responsiveness.
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

    const category =
      await prisma.category.create({
        data: {
          name: data.name,
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
        },
      });

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

export async function updateCategory(
  categoryId,
  data,
  files
) {
  const existingCategory =
    await prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
      },

      select: {
        id: true,
        imageUrl: true,
        bannerImageUrl: true,
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

  const hasBodyChanges =
    Object.keys(data).length >
    0;

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

  if (
    data.sortOrder !==
    undefined
  ) {
    await ensureCategorySortOrderAvailable(
      data.sortOrder,
      categoryId
    );
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
      ...data,
    };

    if (newCategoryImage) {
      updateData.imageUrl =
        newCategoryImage.publicPath;
    }

    if (newBannerImage) {
      updateData.bannerImageUrl =
        newBannerImage.publicPath;
    }

    /*
      Slug intentionally does NOT change
      when the category name is edited.

      This matches the current Admin repo
      and prevents breaking existing URLs.
    */

    const category =
      await prisma.category.update({
        where: {
          id: categoryId,
        },

        data: updateData,

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
        },
      });

    const oldImages = [];

    if (
      newCategoryImage &&
      existingCategory.imageUrl
    ) {
      oldImages.push(
        existingCategory.imageUrl
      );
    }

    if (
      newBannerImage &&
      existingCategory.bannerImageUrl
    ) {
      oldImages.push(
        existingCategory.bannerImageUrl
      );
    }

    await cleanupImages(
      oldImages
    );

    return serializeCategory(
      category
    );
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

export async function deleteCategory(
  categoryId
) {
  await ensureCategoryExists(
    categoryId
  );

  await prisma.category.update({
    where: {
      id: categoryId,
    },

    data: {
      isActive: false,
      deletedAt:
        new Date(),
    },
  });

  /*
    Do not delete image files here.

    This is a soft delete, so keeping
    the images preserves the possibility
    of restore/audit later.
  */

  return {
    id: categoryId,
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

  const MAX_ATTEMPTS = 5;

  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS;
    attempt += 1
  ) {
    const lastSubcategory =
      await prisma.subcategory.findFirst({
        where: {
          categoryId,
          deletedAt: null,
        },

        orderBy: {
          sortOrder: "desc",
        },

        select: {
          sortOrder: true,
        },
      });

    const sortOrder =
      (
        lastSubcategory
          ?.sortOrder ?? 0
      ) + 1;

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

            isActive: true,
          },

          select: {
            id: true,
            name: true,
            slug: true,
            sortOrder: true,
            isActive: true,
          },
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
        id: subcategoryId,
        deletedAt: null,
      },

      select: {
        id: true,
      },
    });

  if (!existingSubcategory) {
    throw new AppError(
      "Subcategory not found",
      404,
      "SUBCATEGORY_NOT_FOUND"
    );
  }

  const subcategory =
    await prisma.subcategory.update({
      where: {
        id: subcategoryId,
      },

      data,

      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        isActive: true,
      },
    });

  /*
    Same rule as Category:
    editing the name does not change slug.
  */

  return serializeSubcategory(
    subcategory
  );
}

export async function deleteSubcategory(
  subcategoryId
) {
  const subcategory =
    await prisma.subcategory.findFirst({
      where: {
        id: subcategoryId,
        deletedAt: null,
      },

      select: {
        id: true,
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
      id: subcategoryId,
    },

    data: {
      isActive: false,
      deletedAt:
        new Date(),
    },
  });

  return {
    id: subcategoryId,
  };
}