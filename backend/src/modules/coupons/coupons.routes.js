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
  createCouponController,
  deleteCouponController,
  listAdminCoupons,
  showAdminCoupon,
  updateCouponController,
} from "./coupons.controller.js";

import {
  couponIdParamsSchema,
  createCouponSchema,
  updateCouponSchema,
} from "./coupons.validation.js";

const router =
  Router();

/*
|--------------------------------------------------------------------------
| Admin Coupons List
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/coupons",

  authenticate,

  authorizeRole(
    "ADMIN",
  ),

  listAdminCoupons,
);

/*
|--------------------------------------------------------------------------
| Admin Coupon Detail
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/coupons/:id",

  authenticate,

  authorizeRole(
    "ADMIN",
  ),

  validate(
    couponIdParamsSchema,
    "params",
  ),

  showAdminCoupon,
);

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

router.post(
  "/admin/coupons",

  authenticate,

  requireCsrf,

  authorizeRole(
    "ADMIN",
  ),

  validate(
    createCouponSchema,
    "body",
  ),

  createCouponController,
);

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/coupons/:id",

  authenticate,

  requireCsrf,

  authorizeRole(
    "ADMIN",
  ),

  validate(
    couponIdParamsSchema,
    "params",
  ),

  validate(
    updateCouponSchema,
    "body",
  ),

  updateCouponController,
);

/*
|--------------------------------------------------------------------------
| Delete Coupon
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/coupons/:id",

  authenticate,

  requireCsrf,

  authorizeRole(
    "ADMIN",
  ),

  validate(
    couponIdParamsSchema,
    "params",
  ),

  deleteCouponController,
);

export default router;