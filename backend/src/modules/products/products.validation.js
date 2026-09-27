import { z } from "zod";

const MAX_PRICE = 9_999_999_999.99;
const MAX_INT = 2_147_483_647;

/*
|--------------------------------------------------------------------------
| Shared Helpers
|--------------------------------------------------------------------------
*/

/*
 * Multipart/form-data sends numeric values as strings.
 *
 * We intentionally convert non-empty numeric strings:
 *
 * "42.50" → 42.5
 *
 * But we DO NOT convert an empty string:
 *
 * "" → 0   ❌
 *
 * Leaving an empty string untouched makes z.number()
 * reject it instead.
 */
function numberInputSchema(schema) {
  return z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();

      if (trimmed === "") {
        return value;
      }

      return Number(trimmed);
    },
    schema
  );
}

const multipartBooleanSchema =
  z.union([
    z.boolean(),
    z.literal("true"),
    z.literal("false"),
  ]).transform(
    (value) =>
      value === true ||
      value === "true"
  );

function optionalTextSchema(
  maxLength,
  fieldName
) {
  return z.preprocess(
    (value) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return null;
      }

      return value;
    },

    z.string()
      .trim()
      .min(
        1,
        `${fieldName} cannot be empty`
      )
      .max(
        maxLength,
        `${fieldName} is too long`
      )
      .nullable()
  );
}

/*
|--------------------------------------------------------------------------
| Product Fields
|--------------------------------------------------------------------------
*/

const nameSchema =
  z.string()
    .trim()
    .min(
      2,
      "Product name must be at least 2 characters"
    )
    .max(
      160,
      "Product name must not exceed 160 characters"
    );

const unitSchema =
  z.string()
    .trim()
    .min(
      1,
      "Unit is required"
    )
    .max(
      80,
      "Unit must not exceed 80 characters"
    );

const priceSchema =
  numberInputSchema(
    z.number()
      .finite(
        "Price must be a valid number"
      )
      .positive(
        "Price must be greater than zero"
      )
      .max(
        MAX_PRICE,
        "Price is too large"
      )
      .multipleOf(
        0.01,
        "Price can have at most 2 decimal places"
      )
  );

const stockSchema =
  numberInputSchema(
    z.number()
      .int(
        "Stock must be an integer"
      )
      .min(
        0,
        "Stock cannot be negative"
      )
      .max(
        MAX_INT,
        "Stock is too large"
      )
  );

const discountPercentageSchema =
  numberInputSchema(
    z.number()
      .finite(
        "Discount percentage must be a valid number"
      )
      .min(
        0,
        "Discount percentage cannot be negative"
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

const ratingSchema =
  numberInputSchema(
    z.number()
      .finite(
        "Rating must be a valid number"
      )
      .min(
        0,
        "Rating cannot be negative"
      )
      .max(
        5,
        "Rating cannot exceed 5"
      )
      .multipleOf(
        0.1,
        "Rating can have at most 1 decimal place"
      )
  );

const reviewsCountSchema =
  numberInputSchema(
    z.number()
      .int(
        "Reviews count must be an integer"
      )
      .min(
        0,
        "Reviews count cannot be negative"
      )
      .max(
        MAX_INT,
        "Reviews count is too large"
      )
  );

const categorySlugSchema =
  z.string()
    .trim()
    .min(
      1,
      "Category is required"
    )
    .max(
      140,
      "Category slug is too long"
    );

const subcategoryIdSchema =
  z.uuid(
    "Invalid subcategory ID"
  );

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export const createProductSchema =
  z.object({
    name: nameSchema,

    unit: unitSchema,

    price: priceSchema,

    stock: stockSchema,

    categorySlug:
      categorySlugSchema,

    subcategoryId:
      subcategoryIdSchema,

    discountPercentage:
      discountPercentageSchema
        .default(0),

    description:
      optionalTextSchema(
        5000,
        "Description"
      ).default(null),

    badge:
      optionalTextSchema(
        80,
        "Badge"
      ).default(null),

    deliveryText:
      optionalTextSchema(
        160,
        "Delivery text"
      ).default(null),

    isBestSeller:
      multipartBooleanSchema
        .default(false),

    isActive:
      multipartBooleanSchema
        .default(true),

    rating:
      ratingSchema
        .default(0),

    reviewsCount:
      reviewsCountSchema
        .default(0),
  })
    .strict();

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export const updateProductSchema =
  z.object({
    name:
      nameSchema.optional(),

    unit:
      unitSchema.optional(),

    price:
      priceSchema.optional(),

    stock:
      stockSchema.optional(),

    categorySlug:
      categorySlugSchema.optional(),

    subcategoryId:
      subcategoryIdSchema.optional(),

    discountPercentage:
      discountPercentageSchema
        .optional(),

    description:
      optionalTextSchema(
        5000,
        "Description"
      ).optional(),

    badge:
      optionalTextSchema(
        80,
        "Badge"
      ).optional(),

    deliveryText:
      optionalTextSchema(
        160,
        "Delivery text"
      ).optional(),

    isBestSeller:
      multipartBooleanSchema
        .optional(),

    isActive:
      multipartBooleanSchema
        .optional(),

    rating:
      ratingSchema.optional(),

    reviewsCount:
      reviewsCountSchema
        .optional(),
  })
    .strict();



  /*
|--------------------------------------------------------------------------
| Admin Products Query
|--------------------------------------------------------------------------
*/

export const adminProductsQuerySchema =
  z.object({
    isBestSeller:
      z.union([
        z.boolean(),
        z.literal("true"),
        z.literal("false"),
      ])
        .transform(
          (value) =>
            value === true ||
            value === "true"
        )
        .optional(),
  })
    .strict();
/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const productIdParamsSchema =
  z.object({
    id: z.uuid(
      "Invalid product ID"
    ),
  })
    .strict();

export const productSlugParamsSchema =
  z.object({
    slug:
      z.string()
        .trim()
        .min(1)
        .max(180),
  })
    .strict();