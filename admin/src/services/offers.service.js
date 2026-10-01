import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Admin Offers
|--------------------------------------------------------------------------
*/

export async function getAdminOffers() {
  const response =
    await api.get(
      "/admin/offers",
    );

  return (
    response.data.data
      .offers
  );
}

/*
|--------------------------------------------------------------------------
| Get Admin Offer Details
|--------------------------------------------------------------------------
*/

export async function getAdminOffer(
  offerId,
) {
  const response =
    await api.get(
      `/admin/offers/${encodeURIComponent(
        offerId,
      )}`,
    );

  return (
    response.data.data
      .offer
  );
}

/*
|--------------------------------------------------------------------------
| Create Admin Offer
|--------------------------------------------------------------------------
*/

export async function createAdminOffer({
  productId,
  discountPercentage,
  isActive = true,
}) {
  const payload = {
    productId,
    discountPercentage,
    isActive,
  };

  const response =
    await api.post(
      "/admin/offers",
      payload,
    );

  return (
    response.data.data
      .offer
  );
}

/*
|--------------------------------------------------------------------------
| Update Admin Offer
|--------------------------------------------------------------------------
*/

export async function updateAdminOffer({
  offerId,
  productId,
  discountPercentage,
  isActive,
}) {
  const payload = {};

  /*
   * Partial Update:
   *
   * ما نبعتش field إلا لو
   * الـcaller حدده فعلًا.
   *
   * مهم جدًا مع isActive:
   *
   * false لازم تتبعت.
   */

  if (
    productId !==
    undefined
  ) {
    payload.productId =
      productId;
  }

  if (
    discountPercentage !==
    undefined
  ) {
    payload.discountPercentage =
      discountPercentage;
  }

  if (
    isActive !==
    undefined
  ) {
    payload.isActive =
      isActive;
  }

  const response =
    await api.patch(
      `/admin/offers/${encodeURIComponent(
        offerId,
      )}`,
      payload,
    );

  return (
    response.data.data
      .offer
  );
}

/*
|--------------------------------------------------------------------------
| Delete Admin Offer
|--------------------------------------------------------------------------
*/

export async function deleteAdminOffer(
  offerId,
) {
  const response =
    await api.delete(
      `/admin/offers/${encodeURIComponent(
        offerId,
      )}`,
    );

  return (
    response.data.data
      .offer
  );
}