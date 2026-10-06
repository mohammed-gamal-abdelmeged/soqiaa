import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Coupons
|--------------------------------------------------------------------------
*/

export async function getAdminCoupons() {
  const response =
    await api.get(
      "/admin/coupons",
    );

  return (
    response.data.data
      .coupons
  );
}

/*
|--------------------------------------------------------------------------
| Get Coupon
|--------------------------------------------------------------------------
*/

export async function getAdminCoupon(
  couponId,
) {
  const response =
    await api.get(
      `/admin/coupons/${encodeURIComponent(
        couponId,
      )}`,
    );

  return (
    response.data.data
      .coupon
  );
}

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

export async function createAdminCoupon(
  payload,
) {
  const response =
    await api.post(
      "/admin/coupons",
      payload,
    );

  return (
    response.data.data
      .coupon
  );
}

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

export async function updateAdminCoupon({
  couponId,
  ...data
}) {
  const response =
    await api.patch(
      `/admin/coupons/${encodeURIComponent(
        couponId,
      )}`,
      data,
    );

  return (
    response.data.data
      .coupon
  );
}

/*
|--------------------------------------------------------------------------
| Delete Coupon
|--------------------------------------------------------------------------
*/

export async function deleteAdminCoupon(
  couponId,
) {
  const response =
    await api.delete(
      `/admin/coupons/${encodeURIComponent(
        couponId,
      )}`,
    );

  return (
    response.data.data
      .coupon
  );
}