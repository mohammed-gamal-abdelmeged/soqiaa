export const queryKeys = {
  profile: ['profile'],

  categories: ['categories'],

  category: (slug) => [
    'categories',
    'detail',
    slug,
  ],

  products: ['products'],

  product: (id) => [
    'products',
    'detail',
    id,
  ],

  cart: ['cart'],

  favorites: ['favorites'],

  orders: ['orders'],

  order: (id) => [
    'orders',
    'detail',
    id,
  ],
}