import { prisma } from "../../database/prisma.js";

import { AppError } from "../../shared/errors/AppError.js";

/*
|--------------------------------------------------------------------------
| Selects
|--------------------------------------------------------------------------
*/

const OFFER_SELECT = {
  id: true,
  productId: true,
  discountPercentage: true,
  isActive: true,
};

/*
|--------------------------------------------------------------------------
| Serialization
|--------------------------------------------------------------------------
*/

function serializeOffer(offer) {
  return {
    id: offer.id,

    productId:
      offer.productId,

    discountPercentage:
      Number(
        offer.discountPercentage
      ),

    isActive:
      offer.isActive,
  };
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

async function ensureProductExists(
  client,
  productId
) {
  const product =
    await client.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },

      select: {
        id: true,
      },
    });

  if (!product) {
    throw new AppError(
      "Product not found",
      404,
      "PRODUCT_NOT_FOUND"
    );
  }

  return product;
}

async function ensureProductHasNoOtherOffer(
  client,
  productId,
  excludeOfferId = null
) {
  const existingOffer =
    await client.offer.findFirst({
      where: {
        productId,

        ...(excludeOfferId
          ? {
              id: {
                not: excludeOfferId,
              },
            }
          : {}),
      },

      select: {
        id: true,
      },
    });

  if (existingOffer) {
    throw new AppError(
      "Product already has an offer",
      409,
      "OFFER_ALREADY_EXISTS"
    );
  }
}

/*
|--------------------------------------------------------------------------
| Admin List
|--------------------------------------------------------------------------
*/

export async function getAdminOffers() {
  const offers =
    await prisma.offer.findMany({
      where: {
        product: {
          is: {
            deletedAt: null,
          },
        },
      },

      select: OFFER_SELECT,

      orderBy: {
        updatedAt: "desc",
      },
    });

  return offers.map(
    serializeOffer
  );
}

/*
|--------------------------------------------------------------------------
| Admin Detail
|--------------------------------------------------------------------------
*/

export async function getAdminOfferById(
  id
) {
  const offer =
    await prisma.offer.findFirst({
      where: {
        id,

        product: {
          is: {
            deletedAt: null,
          },
        },
      },

      select: OFFER_SELECT,
    });

  if (!offer) {
    throw new AppError(
      "Offer not found",
      404,
      "OFFER_NOT_FOUND"
    );
  }

  return serializeOffer(
    offer
  );
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function createOffer(
  data
) {
  const {
    productId,
    discountPercentage,
    isActive,
  } = data;

  await ensureProductExists(
    prisma,
    productId
  );

  await ensureProductHasNoOtherOffer(
    prisma,
    productId
  );

  try {
    const offer =
      await prisma.offer.create({
        data: {
          productId,

          discountPercentage,

          isActive,

          /*
           * Current Admin UI does not
           * support scheduled offers.
           *
           * Therefore new offers are
           * immediately governed only
           * by isActive.
           */
          startsAt: null,
          endsAt: null,
        },

        select: OFFER_SELECT,
      });

    return serializeOffer(
      offer
    );
  } catch (error) {
    /*
     * Protect against a race where
     * two requests try to create an
     * offer for the same product.
     */
    if (
      error?.code === "P2002"
    ) {
      throw new AppError(
        "Product already has an offer",
        409,
        "OFFER_ALREADY_EXISTS"
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function updateOffer(
  id,
  data
) {
  const currentOffer =
    await prisma.offer.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        productId: true,
      },
    });

  if (!currentOffer) {
    throw new AppError(
      "Offer not found",
      404,
      "OFFER_NOT_FOUND"
    );
  }

  const nextProductId =
    data.productId ??
    currentOffer.productId;

  /*
   * Product selection is editable
   * in the current GitHub OfferForm.
   *
   * Therefore we support moving an
   * offer to another product.
   */
  await ensureProductExists(
    prisma,
    nextProductId
  );

  await ensureProductHasNoOtherOffer(
    prisma,
    nextProductId,
    id
  );

  const updateData = {};

  if (
    data.productId !==
    undefined
  ) {
    updateData.productId =
      data.productId;
  }

  if (
    data.discountPercentage !==
    undefined
  ) {
    updateData.discountPercentage =
      data.discountPercentage;
  }

  if (
    data.isActive !==
    undefined
  ) {
    updateData.isActive =
      data.isActive;
  }

  try {
    const offer =
      await prisma.offer.update({
        where: {
          id,
        },

        data: updateData,

        select: OFFER_SELECT,
      });

    return serializeOffer(
      offer
    );
  } catch (error) {
    if (
      error?.code === "P2002"
    ) {
      throw new AppError(
        "Product already has an offer",
        409,
        "OFFER_ALREADY_EXISTS"
      );
    }

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function deleteOffer(
  id
) {
  const offer =
    await prisma.offer.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

  if (!offer) {
    throw new AppError(
      "Offer not found",
      404,
      "OFFER_NOT_FOUND"
    );
  }

  await prisma.offer.delete({
    where: {
      id,
    },
  });

  return {
    id: offer.id,
  };
}