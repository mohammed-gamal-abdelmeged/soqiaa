import {
  Router,
} from "express";

import {
  authenticate,
} from "../../middlewares/authenticate.js";

import {
  authorizeRole,
} from "../../middlewares/authorizeRole.js";

import {
  requireCsrf,
} from "../../middlewares/requireCsrf.js";

import {
  validate,
} from "../../middlewares/validate.js";

import {
  accessCheck,
  dashboard,
} from "./admin.controller.js";

import {
  createAdminAccountController,
} from "./adminAccounts.controller.js";

import {
  createAdminAccountSchema,
} from "./adminAccounts.validation.js";

import {
  getAdminOrderByIdController,
  getAdminOrdersController,
  updateOrderStatusController,
} from "../orders/orders.controller.js";

import {
  adminOrdersQuerySchema,
  orderIdParamsSchema,
  updateOrderStatusSchema,
} from "../orders/orders.validation.js";

const router =
  Router();

/*
|--------------------------------------------------------------------------
| Admin Access Check
|--------------------------------------------------------------------------
*/

router.get(
  "/access-check",

  authenticate,

  authorizeRole(
    "ADMIN",
  ),

  accessCheck,
);

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  authorizeRole(
    "ADMIN",
  ),

  dashboard,
);

/*
|--------------------------------------------------------------------------
| Create Admin Account
|--------------------------------------------------------------------------
|
| Only an already authenticated ADMIN
| can create another ADMIN account.
|
| Client cannot choose the role.
| Backend always creates role = ADMIN.
|--------------------------------------------------------------------------
*/

router.post(
  "/accounts",

  authenticate,

  authorizeRole(
    "ADMIN",
  ),

  requireCsrf,

  validate(
    createAdminAccountSchema,
    "body",
  ),

  createAdminAccountController,
);

/*
|--------------------------------------------------------------------------
| Admin - Get Orders
|--------------------------------------------------------------------------
|
| Supports:
|
| ?page=1
| ?limit=20
| ?status=received
|--------------------------------------------------------------------------
*/

router.get(
  "/orders",

  authenticate,

  authorizeRole(
    "ADMIN",
  ),

  validate(
    adminOrdersQuerySchema,
    "query",
  ),

  getAdminOrdersController,
);

/*
|--------------------------------------------------------------------------
| Admin - Get Order By ID
|--------------------------------------------------------------------------
*/

router.get(
  "/orders/:id",

  authenticate,

  authorizeRole(
    "ADMIN",
  ),

  validate(
    orderIdParamsSchema,
    "params",
  ),

  getAdminOrderByIdController,
);

/*
|--------------------------------------------------------------------------
| Admin - Update Order Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/orders/:id/status",

  authenticate,

  authorizeRole(
    "ADMIN",
  ),

  requireCsrf,

  validate(
    orderIdParamsSchema,
    "params",
  ),

  validate(
    updateOrderStatusSchema,
    "body",
  ),

  updateOrderStatusController,
);

export default router;