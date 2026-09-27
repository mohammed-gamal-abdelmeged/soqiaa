import { z } from "zod";

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
      EGYPTIAN_PHONE_REGEX.test(value),
    {
      message:
        "Enter a valid Egyptian phone number",
    }
  );

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(
        3,
        "Full name must be at least 3 characters"
      )
      .max(
        120,
        "Full name must not exceed 120 characters"
      ),

    phone: phoneSchema,

    address: z
      .string()
      .trim()
      .min(
        10,
        "Address must be at least 10 characters"
      )
      .max(
        500,
        "Address must not exceed 500 characters"
      ),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .max(
        128,
        "Password must not exceed 128 characters"
      ),

    confirmPassword: z.string(),

    termsAccepted: z
      .boolean()
      .refine(
        (value) => value === true,
        {
          message:
            "Terms and conditions must be accepted",
        }
      ),
  })
  .strict()
  .superRefine(
    (
      {
        password,
        confirmPassword,
      },
      ctx
    ) => {
      if (
        password !==
        confirmPassword
      ) {
        ctx.addIssue({
          code: "custom",
          path: [
            "confirmPassword",
          ],
          message:
            "Passwords do not match",
        });
      }
    }
  );

export const loginSchema = z
  .object({
    phone: phoneSchema,

    password: z
      .string()
      .min(
        1,
        "Password is required"
      )
      .max(
        128,
        "Password must not exceed 128 characters"
      ),
  })
  .strict();