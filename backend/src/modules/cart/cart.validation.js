import { z } from "zod";

const MAX_INT = 2_147_483_647;

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function numberInputSchema(schema) {
  return z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();

      /*
       * Prevent:
       *
       * "" → 0
       */
      if (trimmed === "") {
        return value;
      }

      return Number(trimmed);
    },
    schema
  );
}

/*
|--------------------------------------------------------------------------
| Fields
|--------------------------------------------------------------------------
*/

const productIdSchema =
  z.uuid(
    "Invalid product ID"
  );

const quantitySchema =
  numberInputSchema(
    z.number()
      .int(
        "Quantity must be an integer"
      )
      .min(
        1,
        "Quantity must be at least 1"
      )
      .max(
        MAX_INT,
        "Quantity is too large"
      )
  );

/*
|--------------------------------------------------------------------------
| Add Item
|--------------------------------------------------------------------------
*/

export const addCartItemSchema =
  z.object({
    productId:
      productIdSchema,

    quantity:
      quantitySchema
        .default(1),
  })
    .strict();

/*
|--------------------------------------------------------------------------
| Update Quantity
|--------------------------------------------------------------------------
*/

export const updateCartItemSchema =
  z.object({
    quantity:
      quantitySchema,
  })
    .strict();

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const cartProductParamsSchema =
  z.object({
    productId:
      productIdSchema,
  })
    .strict();