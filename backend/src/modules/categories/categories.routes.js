import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";
import { validate } from "../../middlewares/validate.js";

import {
  uploadImageFields,
} from "../../shared/uploads/imageUpload.js";

import {
  createCategoryController,
  createSubcategoryController,
  deleteCategoryController,
  deleteSubcategoryController,
  listAdminCategories,
  listPublicCategories,
  showAdminCategory,
  showPublicCategory,
  updateCategoryController,
  updateSubcategoryController,
} from "./categories.controller.js";

import {
  categoryIdParamsSchema,
  categorySlugParamsSchema,
  categorySubcategoryParamsSchema,
  createCategorySchema,
  createSubcategorySchema,
  subcategoryIdParamsSchema,
  updateCategorySchema,
  updateSubcategorySchema,
} from "./categories.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Categories
|--------------------------------------------------------------------------
*/

router.get(
  "/categories",
  listPublicCategories
);

router.get(
  "/categories/:slug",
  validate(
    categorySlugParamsSchema,
    "params"
  ),
  showPublicCategory
);

/*
|--------------------------------------------------------------------------
| Admin Categories
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/categories",
  authenticate,
  authorizeRole("ADMIN"),
  listAdminCategories
);

router.post(
  "/admin/categories",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  uploadImageFields([
    {
      name: "categoryImage",
      maxCount: 1,
    },
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),

  validate(
    createCategorySchema,
    "body"
  ),

  createCategoryController
);

router.patch(
  "/admin/categories/:id",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    categoryIdParamsSchema,
    "params"
  ),

  uploadImageFields([
    {
      name: "categoryImage",
      maxCount: 1,
    },
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),

  validate(
    updateCategorySchema,
    "body"
  ),

  updateCategoryController
);

router.delete(
  "/admin/categories/:id",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    categoryIdParamsSchema,
    "params"
  ),

  deleteCategoryController
);

/*
|--------------------------------------------------------------------------
| Admin Subcategories
|--------------------------------------------------------------------------
*/

router.post(
  "/admin/categories/:categoryId/subcategories",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    categorySubcategoryParamsSchema,
    "params"
  ),

  validate(
    createSubcategorySchema,
    "body"
  ),

  createSubcategoryController
);

router.patch(
  "/admin/subcategories/:id",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    subcategoryIdParamsSchema,
    "params"
  ),

  validate(
    updateSubcategorySchema,
    "body"
  ),

  updateSubcategoryController
);

router.delete(
  "/admin/subcategories/:id",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    subcategoryIdParamsSchema,
    "params"
  ),

  deleteSubcategoryController
);

/*
|--------------------------------------------------------------------------
| Admin Category Details
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/categories/:slug",
  authenticate,
  authorizeRole("ADMIN"),

  validate(
    categorySlugParamsSchema,
    "params"
  ),

  showAdminCategory
);

export default router;