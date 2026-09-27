import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function emptyStringToUndefined(
  value
) {
  if (
    typeof value === "string" &&
    value.trim() === ""
  ) {
    return undefined;
  }

  return value;
}

/*
|--------------------------------------------------------------------------
| Admin Customers Query
|--------------------------------------------------------------------------
*/

export const adminCustomersQuerySchema =
  z
    .object({
      search: z
        .preprocess(
          emptyStringToUndefined,
          z
            .string()
            .trim()
            .max(
              120,
              "Search must not exceed 120 characters"
            )
            .optional()
        ),

      sort: z
        .enum([
          "newest",
          "oldest",
          "name-asc",
          "name-desc",
        ])
        .default(
          "newest"
        ),

      page: z
        .coerce
        .number()
        .int()
        .min(1)
        .default(1),

      limit: z
        .coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20),
    })
    .strict();