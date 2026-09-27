import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(
    2,
    "Name must be at least 2 characters"
  )
  .max(
    120,
    "Name must not exceed 120 characters"
  );

const bannerTitleSchema = z
  .string()
  .trim()
  .min(
    2,
    "Banner title must be at least 2 characters"
  )
  .max(
    160,
    "Banner title must not exceed 160 characters"
  );

const bannerSubtitleSchema = z
  .string()
  .trim()
  .min(
    2,
    "Banner subtitle must be at least 2 characters"
  )
  .max(
    255,
    "Banner subtitle must not exceed 255 characters"
  );

const sortOrderSchema = z.coerce
  .number()
  .int(
    "Sort order must be an integer"
  )
  .min(
    1,
    "Sort order must start from 1"
  );

const multipartBooleanSchema = z
  .union([
    z.boolean(),
    z.literal("true"),
    z.literal("false"),
  ])
  .transform(
    (value) =>
      value === true ||
      value === "true"
  );

export const createCategorySchema =
  z
    .object({
      name:
        nameSchema,

      sortOrder:
        sortOrderSchema,

      isActive:
        multipartBooleanSchema
          .default(true),

      bannerTitle:
        bannerTitleSchema,

      bannerSubtitle:
        bannerSubtitleSchema,
    })
    .strict();

export const updateCategorySchema =
  z
    .object({
      name:
        nameSchema.optional(),

      sortOrder:
        sortOrderSchema.optional(),

      isActive:
        multipartBooleanSchema
          .optional(),

      bannerTitle:
        bannerTitleSchema
          .optional(),

      bannerSubtitle:
        bannerSubtitleSchema
          .optional(),
    })
    .strict()
    
export const createSubcategorySchema =
  z
    .object({
      name:
        nameSchema,
    })
    .strict();

export const updateSubcategorySchema =
  z
    .object({
      name:
        nameSchema.optional(),

      isActive:
        z
          .boolean()
          .optional(),
    })
    .strict()
    .refine(
      (data) =>
        Object.keys(data)
          .length > 0,
      {
        message:
          "At least one field must be provided",
      }
    );

export const categoryIdParamsSchema =
  z
    .object({
      id:
        z.uuid(),
    })
    .strict();

export const categorySlugParamsSchema =
  z
    .object({
      slug: z
        .string()
        .trim()
        .min(1)
        .max(140),
    })
    .strict();

export const categorySubcategoryParamsSchema =
  z
    .object({
      categoryId:
        z.uuid(),
    })
    .strict();

export const subcategoryIdParamsSchema =
  z
    .object({
      id:
        z.uuid(),
    })
    .strict();