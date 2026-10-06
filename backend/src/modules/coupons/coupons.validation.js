import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function numberInputSchema(
  schema,
) {
  return z.preprocess(
    (value) => {
      if (
        typeof value !==
        "string"
      ) {
        return value;
      }

      const trimmed =
        value.trim();

      if (
        trimmed === ""
      ) {
        return value;
      }

      return Number(
        trimmed,
      );
    },

    schema,
  );
}

function nullableNumberInputSchema(
  schema,
) {
  return z.preprocess(
    (value) => {
      if (
        value ===
        undefined
      ) {
        return undefined;
      }

      if (
        value === null
      ) {
        return null;
      }

      if (
        typeof value ===
        "string"
      ) {
        const trimmed =
          value.trim();

        if (
          trimmed === ""
        ) {
          return null;
        }

        return Number(
          trimmed,
        );
      }

      return value;
    },

    schema
      .nullable()
      .optional(),
  );
}

function nullableDateInputSchema() {
  return z.preprocess(
    (value) => {
      if (
        value ===
        undefined
      ) {
        return undefined;
      }

      if (
        value === null ||
        value === ""
      ) {
        return null;
      }

      if (
        value instanceof
        Date
      ) {
        return value;
      }

      return new Date(
        value,
      );
    },

    z.date({
      error:
        "Invalid date",
    })
      .nullable()
      .optional(),
  );
}

/*
|--------------------------------------------------------------------------
| Fields
|--------------------------------------------------------------------------
*/

const couponCodeSchema =
  z.string()
    .trim()
    .min(
      2,
      "Coupon code must be at least 2 characters",
    )
    .max(
      50,
      "Coupon code cannot exceed 50 characters",
    )
    .transform(
      (value) =>
        value.toUpperCase(),
    );

const discountTypeSchema =
  z.enum([
    "PERCENTAGE",
    "FIXED",
  ]);

const couponValueSchema =
  numberInputSchema(
    z.number()
      .finite(
        "Coupon value must be a valid number",
      )
      .positive(
        "Coupon value must be greater than zero",
      )
      .multipleOf(
        0.01,
        "Coupon value can have at most 2 decimal places",
      ),
  );

const minOrderAmountSchema =
  nullableNumberInputSchema(
    z.number()
      .finite(
        "Minimum order amount must be a valid number",
      )
      .nonnegative(
        "Minimum order amount cannot be negative",
      )
      .multipleOf(
        0.01,
        "Minimum order amount can have at most 2 decimal places",
      ),
  );

const maxDiscountAmountSchema =
  nullableNumberInputSchema(
    z.number()
      .finite(
        "Maximum discount amount must be a valid number",
      )
      .positive(
        "Maximum discount amount must be greater than zero",
      )
      .multipleOf(
        0.01,
        "Maximum discount amount can have at most 2 decimal places",
      ),
  );

const usageLimitSchema =
  nullableNumberInputSchema(
    z.number()
      .int(
        "Usage limit must be an integer",
      )
      .positive(
        "Usage limit must be greater than zero",
      ),
  );

const usagePerUserSchema =
  nullableNumberInputSchema(
    z.number()
      .int(
        "Usage per user must be an integer",
      )
      .positive(
        "Usage per user must be greater than zero",
      ),
  );

const startsAtSchema =
  nullableDateInputSchema();

const expiresAtSchema =
  nullableDateInputSchema();

/*
|--------------------------------------------------------------------------
| Shared Business Validation
|--------------------------------------------------------------------------
*/

function validateCouponData(
  data,
  ctx,
) {
  if (
    data.discountType ===
      "PERCENTAGE" &&
    data.value !==
      undefined &&
    data.value > 100
  ) {
    ctx.addIssue({
      code: "custom",
      path: [
        "value",
      ],
      message:
        "Percentage discount cannot exceed 100",
    });
  }

  if (
    data.startsAt &&
    data.expiresAt &&
    data.expiresAt <=
      data.startsAt
  ) {
    ctx.addIssue({
      code: "custom",
      path: [
        "expiresAt",
      ],
      message:
        "Coupon expiry date must be after start date",
    });
  }
}

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

export const createCouponSchema =
  z.object({
    code:
      couponCodeSchema,

    discountType:
      discountTypeSchema,

    value:
      couponValueSchema,

    minOrderAmount:
      minOrderAmountSchema
        .default(null),

    maxDiscountAmount:
      maxDiscountAmountSchema
        .default(null),

    usageLimit:
      usageLimitSchema
        .default(null),

    usagePerUser:
      usagePerUserSchema
        .default(null),

    startsAt:
      startsAtSchema
        .default(null),

    expiresAt:
      expiresAtSchema
        .default(null),

    isActive:
      z.boolean()
        .default(true),
  })
    .strict()
    .superRefine(
      validateCouponData,
    );

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

export const updateCouponSchema =
  z.object({
    code:
      couponCodeSchema
        .optional(),

    discountType:
      discountTypeSchema
        .optional(),

    value:
      couponValueSchema
        .optional(),

    minOrderAmount:
      minOrderAmountSchema,

    maxDiscountAmount:
      maxDiscountAmountSchema,

    usageLimit:
      usageLimitSchema,

    usagePerUser:
      usagePerUserSchema,

    startsAt:
      startsAtSchema,

    expiresAt:
      expiresAtSchema,

    isActive:
      z.boolean()
        .optional(),
  })
    .strict()
    .refine(
      (data) =>
        Object.keys(
          data,
        ).length > 0,
      {
        message:
          "At least one field is required",
      },
    )
    .superRefine(
      validateCouponData,
    );

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const couponIdParamsSchema =
  z.object({
    id:
      z.uuid(
        "Invalid coupon ID",
      ),
  })
    .strict();