import { prisma } from "../../database/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { toPublicAssetUrl } from "../../shared/uploads/assetUrl.js";

/*
|--------------------------------------------------------------------------
| Prisma Selects
|--------------------------------------------------------------------------
*/

const FAVORITE_PRODUCT_SELECT = {
  id: true,
  name: true,
  imageUrl: true,
  unit: true,
  price: true,
  stock: true,
  isActive: true,
  deletedAt: true,

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
      isActive: true,
      deletedAt: true,

      category: {
        select: {
          isActive: true,
          deletedAt: true,
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

function isProductVisible(product) {
  if (!product) {
    return false;
  }

  if (
    product.deletedAt ||
    !product.isActive
  ) {
    return false;
  }

  if (
    product.subcategory.deletedAt ||
    !product.subcategory.isActive
  ) {
    return false;
  }

  if (
    product.subcategory.category.deletedAt ||
    !product.subcategory.category.isActive
  ) {
    return false;
  }

  return true;
}

function isCurrentOffer(
  offer,
  now = new Date()
) {
  if (!offer || !offer.isActive) {
    return false;
  }

  if (
    offer.startsAt &&
    offer.startsAt > now
  ) {
    return false;
  }

  if (
    offer.endsAt &&
    offer.endsAt <= now
  ) {
    return false;
  }

  return true;
}

function getDiscountPercentage(
  product,
  now = new Date()
) {
  if (
    !isCurrentOffer(
      product.offer,
      now
    )
  ) {
    return 0;
  }

  return Number(
    product.offer.discountPercentage
  );
}

function serializeFavoriteProduct(
  product,
  now = new Date()
) {
  return {
    id: product.id,

    name: product.name,

    image:
      toPublicAssetUrl(
        product.imageUrl
      ),

    unit: product.unit,

    price:
      Number(product.price),

    discountPercentage:
      getDiscountPercentage(
        product,
        now
      ),

    stock: product.stock,

    isActive: true,
  };
}

async function ensureFavoriteableProduct(
  productId
) {
  const product =
    await prisma.product.findUnique({
      where: {
        id: productId,
      },

      select:
        FAVORITE_PRODUCT_SELECT,
    });

  if (!product) {
    throw new AppError(
      "Product not found",
      404,
      "PRODUCT_NOT_FOUND"
    );
  }

  if (!isProductVisible(product)) {
    throw new AppError(
      "Product is currently unavailable",
      409,
      "PRODUCT_UNAVAILABLE"
    );
  }

  return product;
}

/*
|--------------------------------------------------------------------------
| Get Favorites
|--------------------------------------------------------------------------
*/

export async function getFavorites(
  userId
) {
  const favorites =
    await prisma.favorite.findMany({
      where: {
        userId,
      },

      select: {
        product: {
          select:
            FAVORITE_PRODUCT_SELECT,
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const now = new Date();

  return favorites
    .filter(
      (favorite) =>
        isProductVisible(
          favorite.product
        )
    )
    .map(
      (favorite) =>
        serializeFavoriteProduct(
          favorite.product,
          now
        )
    );
}

/*
|--------------------------------------------------------------------------
| Add Favorite
|--------------------------------------------------------------------------
*/

export async function addFavorite(
  userId,
  productId
) {
  const product =
    await ensureFavoriteableProduct(
      productId
    );

  try {
    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },

      select: {
        id: true,
      },
    });
  } catch (error) {
    /*
     * Prisma P2002:
     * unique constraint violation
     *
     * @@unique([userId, productId])
     */
    if (error?.code === "P2002") {
      throw new AppError(
        "Product is already in favorites",
        409,
        "FAVORITE_ALREADY_EXISTS"
      );
    }

    throw error;
  }

  return serializeFavoriteProduct(
    product
  );
}

/*
|--------------------------------------------------------------------------
| Remove Favorite
|--------------------------------------------------------------------------
*/

export async function removeFavorite(
  userId,
  productId
) {
  const result =
    await prisma.favorite.deleteMany({
      where: {
        userId,
        productId,
      },
    });

  if (result.count === 0) {
    throw new AppError(
      "Favorite not found",
      404,
      "FAVORITE_NOT_FOUND"
    );
  }

  return {
    productId,
  };
}