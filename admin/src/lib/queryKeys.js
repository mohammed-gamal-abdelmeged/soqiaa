export const queryKeys = {
  dashboard: [
    "admin",
    "dashboard",
  ],

  categories: [
    "admin",
    "categories",
  ],

  products: (
    filters = {},
  ) => [
    "admin",
    "products",
    filters,
  ],

  product: (
    id,
  ) => [
    "admin",
    "products",
    "detail",
    id,
  ],

  offers: [
    "admin",
    "offers",
  ],

  coupons: [
    "admin",
    "coupons",
  ],

  coupon: (
    id,
  ) => [
    "admin",
    "coupons",
    "detail",
    id,
  ],

  orders: (
    filters = {},
  ) => [
    "admin",
    "orders",
    filters,
  ],

  order: (
    id,
  ) => [
    "admin",
    "orders",
    "detail",
    id,
  ],

  customers: (
    filters = {},
  ) => [
    "admin",
    "customers",
    filters,
  ],
};