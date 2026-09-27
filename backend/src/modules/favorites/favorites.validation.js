import { z } from "zod";

const productIdSchema =
  z.uuid(
    "Invalid product ID"
  );

export const addFavoriteSchema =
  z.object({
    productId:
      productIdSchema,
  })
    .strict();

export const favoriteProductParamsSchema =
  z.object({
    productId:
      productIdSchema,
  })
    .strict();