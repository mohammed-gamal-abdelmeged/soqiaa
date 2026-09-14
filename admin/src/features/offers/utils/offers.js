// src/features/offers/utils/offers.js

export function createOffersFromProducts(products) {
  return products
    .filter(
      (product) =>
        Number(product.discountPercentage) > 0,
    )
    .map((product) => ({
      id: product.id,
      productId: product.id,
      discountPercentage:
        product.discountPercentage,

      /*
        مؤقت للـ mock.
        لاحقًا الـ backend هيكون عنده
        isActive خاص بالعرض نفسه.
      */
      isActive: true,
    }));
}

export function filterOffersByStatus(
  offers,
  status,
) {
  if (status === "active") {
    return offers.filter(
      (offer) => offer.isActive,
    );
  }

  if (status === "inactive") {
    return offers.filter(
      (offer) => !offer.isActive,
    );
  }

  return offers;
}