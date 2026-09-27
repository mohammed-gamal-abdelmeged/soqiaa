import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Shared Helpers
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
       * Important:
       *
       * "" must NOT become 0.
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

const discountPercentageSchema =
  numberInputSchema(
    z.number()
      .finite(
        "Discount percentage must be a valid number"
      )
      .positive(
        "Discount percentage must be greater than zero"
      )
      .max(
        100,
        "Discount percentage cannot exceed 100"
      )
      .multipleOf(
        0.01,
        "Discount percentage can have at most 2 decimal places"
      )
  );

/*
|--------------------------------------------------------------------------
| Create Offer
|--------------------------------------------------------------------------
*/

export const createOfferSchema =
  z.object({
    productId:
      productIdSchema,

    discountPercentage:
      discountPercentageSchema,

    isActive:
      z.boolean()
        .default(true),
  })
    .strict();

/*
|--------------------------------------------------------------------------
| Update Offer
|--------------------------------------------------------------------------
*/

export const updateOfferSchema =
  z.object({
    productId:
      productIdSchema
        .optional(),

    discountPercentage:
      discountPercentageSchema
        .optional(),

    isActive:
      z.boolean()
        .optional(),
  })
    .strict()
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field is required",
      }
    );

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const offerIdParamsSchema =
  z.object({
    id: z.uuid(
      "Invalid offer ID"
    ),
  })
    .strict();