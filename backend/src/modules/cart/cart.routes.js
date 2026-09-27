import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { requireCsrf } from "../../middlewares/requireCsrf.js";
import { validate } from "../../middlewares/validate.js";

import {
  addCartItemController,
  clearCartController,
  removeCartItemController,
  showCart,
  updateCartItemController,
} from "./cart.controller.js";

import {
  addCartItemSchema,
  cartProductParamsSchema,
  updateCartItemSchema,
} from "./cart.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Cart
|--------------------------------------------------------------------------
*/

router.get(
  "/cart",
  authenticate,
  showCart
);

/*
|--------------------------------------------------------------------------
| Add Item
|--------------------------------------------------------------------------
*/

router.post(
  "/cart/items",
  authenticate,
  requireCsrf,

  validate(
    addCartItemSchema,
    "body"
  ),

  addCartItemController
);

/*
|--------------------------------------------------------------------------
| Update Item Quantity
|--------------------------------------------------------------------------
*/

router.patch(
  "/cart/items/:productId",
  authenticate,
  requireCsrf,

  validate(
    cartProductParamsSchema,
    "params"
  ),

  validate(
    updateCartItemSchema,
    "body"
  ),

  updateCartItemController
);

/*
|--------------------------------------------------------------------------
| Remove Item
|--------------------------------------------------------------------------
*/

router.delete(
  "/cart/items/:productId",
  authenticate,
  requireCsrf,

  validate(
    cartProductParamsSchema,
    "params"
  ),

  removeCartItemController
);

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

router.delete(
  "/cart",
  authenticate,
  requireCsrf,
  clearCartController
);

export default router;