import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";
import { validate } from "../../middlewares/validate.js";

import {
  accessCheck,
  dashboard,
} from "./admin.controller.js";

import {
  getAdminOrderByIdController,
  getAdminOrdersController,
  updateOrderStatusController,
} from "../orders/orders.controller.js";

import {
  orderIdParamsSchema,
  updateOrderStatusSchema,
} from "../orders/orders.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Admin Access Check
|--------------------------------------------------------------------------
*/

router.get(
  "/access-check",
  authenticate,
  authorizeRole("ADMIN"),
  accessCheck
);

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  authenticate,
  authorizeRole("ADMIN"),
  dashboard
);

/*
|--------------------------------------------------------------------------
| Admin - Get Orders
|--------------------------------------------------------------------------
|
| Lightweight orders list.
|--------------------------------------------------------------------------
*/

router.get(
  "/orders",
  authenticate,
  authorizeRole("ADMIN"),
  getAdminOrdersController
);

/*
|--------------------------------------------------------------------------
| Admin - Get Order By ID
|--------------------------------------------------------------------------
|
| Full order details are loaded only
| when the admin opens the order.
|--------------------------------------------------------------------------
*/

router.get(
  "/orders/:id",
  authenticate,
  authorizeRole("ADMIN"),

  validate(
    orderIdParamsSchema,
    "params"
  ),

  getAdminOrderByIdController
);

/*
|--------------------------------------------------------------------------
| Admin - Update Order Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/orders/:id/status",
  authenticate,
  authorizeRole("ADMIN"),
  requireCsrf,

  validate(
    orderIdParamsSchema,
    "params"
  ),

  validate(
    updateOrderStatusSchema,
    "body"
  ),

  updateOrderStatusController
);

export default router;