import api from "./api";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function appendFormValue(
  formData,
  key,
  value,
) {
  if (
    value === undefined ||
    value === null
  ) {
    return;
  }

  formData.append(
    key,
    String(value),
  );
}

function appendNullableText(
  formData,
  key,
  value,
) {
  if (value === undefined) {
    return;
  }

  formData.append(
    key,
    value === null
      ? ""
      : String(value),
  );
}

/*
|--------------------------------------------------------------------------
| Get Products
|--------------------------------------------------------------------------
*/

export async function getAdminProducts(
  filters = {},
) {
  const params = {};

  if (filters.search) {
    params.search =
      filters.search;
  }

  if (
    filters.categorySlug
  ) {
    params.categorySlug =
      filters.categorySlug;
  }

  if (
    typeof filters.isBestSeller ===
    "boolean"
  ) {
    params.isBestSeller =
      filters.isBestSeller;
  }

  if (
    typeof filters.isActive ===
    "boolean"
  ) {
    params.isActive =
      filters.isActive;
  }

  const response =
    await api.get(
      "/admin/products",
      {
        params,
      },
    );

  return (
    response.data.data
      .products
  );
}

/*
|--------------------------------------------------------------------------
| Get Product Details
|--------------------------------------------------------------------------
*/

export async function getAdminProduct(
  productId,
) {
  const response =
    await api.get(
      `/admin/products/${encodeURIComponent(
        productId,
      )}`,
    );

  return (
    response.data.data
      .product
  );
}

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export async function createAdminProduct({
  name,
  unit,
  price,
  stock,

  categorySlug,
  subcategoryId,

  discountPercentage,

  description,
  badge,
  deliveryText,

  isBestSeller,
  isActive,

  rating,
  reviewsCount,

  imageFile,
}) {
  const formData =
    new FormData();

  appendFormValue(
    formData,
    "name",
    name,
  );

  appendFormValue(
    formData,
    "unit",
    unit,
  );

  appendFormValue(
    formData,
    "price",
    price,
  );

  appendFormValue(
    formData,
    "stock",
    stock,
  );

  appendFormValue(
    formData,
    "categorySlug",
    categorySlug,
  );

  appendFormValue(
    formData,
    "subcategoryId",
    subcategoryId,
  );

  appendFormValue(
    formData,
    "discountPercentage",
    discountPercentage,
  );

  appendNullableText(
    formData,
    "description",
    description,
  );

  appendNullableText(
    formData,
    "badge",
    badge,
  );

  appendNullableText(
    formData,
    "deliveryText",
    deliveryText,
  );

  appendFormValue(
    formData,
    "isBestSeller",
    isBestSeller,
  );

  appendFormValue(
    formData,
    "isActive",
    isActive,
  );

  appendFormValue(
    formData,
    "rating",
    rating,
  );

  appendFormValue(
    formData,
    "reviewsCount",
    reviewsCount,
  );

  if (imageFile) {
    formData.append(
      "productImage",
      imageFile,
    );
  }

  const response =
    await api.post(
      "/admin/products",
      formData,
    );

  return (
    response.data.data
      .product
  );
}

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export async function updateAdminProduct({
  productId,

  name,
  unit,
  price,
  stock,

  categorySlug,
  subcategoryId,

  discountPercentage,

  description,
  badge,
  deliveryText,

  isBestSeller,
  isActive,

  rating,
  reviewsCount,

  imageFile,
}) {
  const formData =
    new FormData();

  appendFormValue(
    formData,
    "name",
    name,
  );

  appendFormValue(
    formData,
    "unit",
    unit,
  );

  appendFormValue(
    formData,
    "price",
    price,
  );

  appendFormValue(
    formData,
    "stock",
    stock,
  );

  appendFormValue(
    formData,
    "categorySlug",
    categorySlug,
  );

  appendFormValue(
    formData,
    "subcategoryId",
    subcategoryId,
  );

  appendFormValue(
    formData,
    "discountPercentage",
    discountPercentage,
  );

  appendNullableText(
    formData,
    "description",
    description,
  );

  appendNullableText(
    formData,
    "badge",
    badge,
  );

  appendNullableText(
    formData,
    "deliveryText",
    deliveryText,
  );

  appendFormValue(
    formData,
    "isBestSeller",
    isBestSeller,
  );

  appendFormValue(
    formData,
    "isActive",
    isActive,
  );

  appendFormValue(
    formData,
    "rating",
    rating,
  );

  appendFormValue(
    formData,
    "reviewsCount",
    reviewsCount,
  );

  if (imageFile) {
    formData.append(
      "productImage",
      imageFile,
    );
  }

  const response =
    await api.patch(
      `/admin/products/${encodeURIComponent(
        productId,
      )}`,
      formData,
    );

  return (
    response.data.data
      .product
  );
}

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export async function deleteAdminProduct(
  productId,
) {
  const response =
    await api.delete(
      `/admin/products/${encodeURIComponent(
        productId,
      )}`,
    );

  return (
    response.data.data
      .product
  );
}