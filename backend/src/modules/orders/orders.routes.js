import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";
import { validate } from "../../middlewares/validate.js";

import {
  createOrderController,
  getUserOrderByIdController,
  getUserOrdersController,
  previewOrderController,
} from "./orders.controller.js";

import {
  createOrderSchema,
  orderIdParamsSchema,
  previewOrderSchema,
} from "./orders.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Get User Orders
|--------------------------------------------------------------------------
*/

router.get(
  "/orders",
  authenticate,
  getUserOrdersController
);

/*
|--------------------------------------------------------------------------
| Get User Order By ID
|--------------------------------------------------------------------------
*/

router.get(
  "/orders/:id",
  authenticate,

  validate(
    orderIdParamsSchema,
    "params"
  ),

  getUserOrderByIdController
);

/*
|--------------------------------------------------------------------------
| Checkout Preview
|--------------------------------------------------------------------------
*/

router.post(
  "/orders/preview",
  authenticate,
  requireCsrf,

  validate(
    previewOrderSchema,
    "body"
  ),

  previewOrderController
);

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

router.post(
  "/orders",
  authenticate,
  requireCsrf,

  validate(
    createOrderSchema,
    "body"
  ),

  createOrderController
);

export default router;