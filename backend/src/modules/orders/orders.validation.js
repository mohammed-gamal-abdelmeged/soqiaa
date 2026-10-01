import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Egyptian Phone
|--------------------------------------------------------------------------
*/

const EGYPTIAN_PHONE_REGEX =
  /^01[0125][0-9]{8}$/;

const phoneSchema = z
  .string()
  .trim()
  .transform((value) =>
    value.replace(/[\s-]/g, "")
  )
  .refine(
    (value) =>
      EGYPTIAN_PHONE_REGEX.test(
        value
      ),
    {
      message:
        "Enter a valid Egyptian phone number",
    }
  );

/*
|--------------------------------------------------------------------------
| Coupon Code
|--------------------------------------------------------------------------
|
| null / "" means:
| no coupon was supplied.
|--------------------------------------------------------------------------
*/

const couponCodeSchema =
  z.preprocess(
    (value) => {
      if (
        value === null ||
        value === undefined
      ) {
        return undefined;
      }

      if (
        typeof value ===
          "string" &&
        value.trim() === ""
      ) {
        return undefined;
      }

      return value;
    },

    z
      .string()
      .trim()
      .min(
        1,
        "Coupon code is required"
      )
      .max(
        50,
        "Coupon code must not exceed 50 characters"
      )
      .transform((value) =>
        value.toUpperCase()
      )
      .optional()
  );

/*
|--------------------------------------------------------------------------
| Create Order / Checkout
|--------------------------------------------------------------------------
*/

export const createOrderSchema =
  z
    .object({
      customerName: z
        .string()
        .trim()
        .min(
          3,
          "Customer name must be at least 3 characters"
        )
        .max(
          120,
          "Customer name must not exceed 120 characters"
        ),

      customerPhone:
        phoneSchema,

      deliveryAddress: z
        .string()
        .trim()
        .min(
          10,
          "Delivery address must be at least 10 characters"
        )
        .max(
          500,
          "Delivery address must not exceed 500 characters"
        ),

      couponCode:
        couponCodeSchema,
    })
    .strict();

/*
|--------------------------------------------------------------------------
| Checkout Preview
|--------------------------------------------------------------------------
*/

export const previewOrderSchema =
  z
    .object({
      couponCode:
        couponCodeSchema,
    })
    .strict();

/*
|--------------------------------------------------------------------------
| Order Params
|--------------------------------------------------------------------------
*/

export const orderIdParamsSchema =
  z
    .object({
      id: z.uuid(
        "Invalid order ID"
      ),
    })
    .strict();

/*
|--------------------------------------------------------------------------
| Admin Orders Query
|--------------------------------------------------------------------------
|
| Examples:
|
| /admin/orders?page=1&limit=20
| /admin/orders?page=2&limit=20
| /admin/orders?status=received
|
| "all" is treated as no status filter.
|--------------------------------------------------------------------------
*/

export const adminOrdersQuerySchema =
  z
    .object({
      page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20),

      status: z.preprocess(
        (value) => {
          if (
            value === undefined ||
            value === null ||
            value === "" ||
            value === "all"
          ) {
            return undefined;
          }

          return value;
        },

        z
          .enum([
            "received",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ])
          .transform((value) =>
            value.toUpperCase()
          )
          .optional()
      ),

      search: z.preprocess(
        (value) => {
          if (
            value === undefined ||
            value === null
          ) {
            return undefined;
          }

          if (
            typeof value ===
            "string"
          ) {
            const trimmed =
              value.trim();

            return trimmed ||
              undefined;
          }

          return value;
        },

        z
          .string()
          .max(
            120,
            "Search term must not exceed 120 characters"
          )
          .optional()
      ),
    })
    .strict();

/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
*/

export const updateOrderStatusSchema =
  z
    .object({
      status: z
        .enum([
          "confirmed",
          "preparing",
          "out_for_delivery",
          "delivered",
          "cancelled",
        ])
        .transform((value) =>
          value.toUpperCase()
        ),

      note: z
        .string()
        .trim()
        .max(
          500,
          "Note must not exceed 500 characters"
        )
        .optional(),
    })
    .strict();