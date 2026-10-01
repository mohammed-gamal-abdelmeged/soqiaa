import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";
import { validate } from "../../middlewares/validate.js";

import {
  uploadSingleImage,
} from "../../shared/uploads/imageUpload.js";

import {
  createProductController,
  deleteProductController,
  listAdminProducts,
  listPublicProducts,
  showAdminProduct,
  showPublicProduct,
  updateProductController,
} from "./products.controller.js";

import {
  adminProductsQuerySchema,
  createProductSchema,
  productIdParamsSchema,
  updateProductSchema,
} from "./products.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Products
|--------------------------------------------------------------------------
*/

router.get(
  "/products",
  listPublicProducts
);

router.get(
  "/products/:id",
  validate(
    productIdParamsSchema,
    "params"
  ),
  showPublicProduct
);

/*
|--------------------------------------------------------------------------
| Admin Products
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/products",
  authenticate,
  authorizeRole("ADMIN"),

  validate(
    adminProductsQuerySchema,
    "query"
  ),

  listAdminProducts
);

router.get(
  "/admin/products/:id",
  authenticate,
  authorizeRole("ADMIN"),

  validate(
    productIdParamsSchema,
    "params"
  ),

  showAdminProduct
);

router.post(
  "/admin/products",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  uploadSingleImage(
    "productImage"
  ),

  validate(
    createProductSchema,
    "body"
  ),

  createProductController
);

router.patch(
  "/admin/products/:id",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    productIdParamsSchema,
    "params"
  ),

  uploadSingleImage(
    "productImage"
  ),

  validate(
    updateProductSchema,
    "body"
  ),

  updateProductController
);

router.delete(
  "/admin/products/:id",
  authenticate,
  requireCsrf,
  authorizeRole("ADMIN"),

  validate(
    productIdParamsSchema,
    "params"
  ),

  deleteProductController
);

export default router;