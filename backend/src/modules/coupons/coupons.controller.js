import {
  createCoupon,
  deleteCoupon,
  getAdminCouponById,
  getAdminCoupons,
  updateCoupon,
} from "./coupons.service.js";

/*
|--------------------------------------------------------------------------
| Admin Coupons List
|--------------------------------------------------------------------------
*/

export async function listAdminCoupons(
  req,
  res,
) {
  const coupons =
    await getAdminCoupons();

  res.status(200).json({
    success: true,

    data: {
      coupons,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Admin Coupon Detail
|--------------------------------------------------------------------------
*/

export async function showAdminCoupon(
  req,
  res,
) {
  const {
    id,
  } =
    req.validated.params;

  const coupon =
    await getAdminCouponById(
      id,
    );

  res.status(200).json({
    success: true,

    data: {
      coupon,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

export async function createCouponController(
  req,
  res,
) {
  const coupon =
    await createCoupon(
      req.validated.body,
    );

  res.status(201).json({
    success: true,

    message:
      "Coupon created successfully",

    data: {
      coupon,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

export async function updateCouponController(
  req,
  res,
) {
  const {
    id,
  } =
    req.validated.params;

  const coupon =
    await updateCoupon(
      id,
      req.validated.body,
    );

  res.status(200).json({
    success: true,

    message:
      "Coupon updated successfully",

    data: {
      coupon,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete Coupon
|--------------------------------------------------------------------------
*/

export async function deleteCouponController(
  req,
  res,
) {
  const {
    id,
  } =
    req.validated.params;

  const coupon =
    await deleteCoupon(
      id,
    );

  res.status(200).json({
    success: true,

    message:
      "Coupon deleted successfully",

    data: {
      coupon,
    },
  });
}