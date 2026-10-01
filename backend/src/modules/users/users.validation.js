import { z } from "zod";

const EGYPTIAN_PHONE_REGEX =
  /^01[0125][0-9]{8}$/;

/*
|--------------------------------------------------------------------------
| Shared Fields
|--------------------------------------------------------------------------
*/

const fullNameSchema =
  z.string()
    .trim()
    .min(
      3,
      "Full name must be at least 3 characters"
    )
    .max(
      120,
      "Full name must not exceed 120 characters"
    );

const phoneSchema =
  z.string()
    .trim()
    .transform(
      (value) =>
        value.replace(
          /[\s-]/g,
          ""
        )
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

const addressSchema =
  z.string()
    .trim()
    .min(
      10,
      "Address must be at least 10 characters"
    )
    .max(
      500,
      "Address must not exceed 500 characters"
    );

/*
|--------------------------------------------------------------------------
| Update My Profile
|--------------------------------------------------------------------------
*/

export const updateMyProfileSchema =
  z.object({
    fullName:
      fullNameSchema.optional(),

    phone:
      phoneSchema.optional(),

    address:
      addressSchema.optional(),
  })
    .strict()
    .refine(
      (data) =>
        Object.keys(data).length >
        0,
      {
        message:
          "At least one field must be provided",
      }
    );