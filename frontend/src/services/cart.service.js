import api from './api'

export async function getCart() {
  const response =
    await api.get('/cart')

  return response.data.data.cart
}

export async function addCartItem({
  productId,
  quantity = 1,
}) {
  const response =
    await api.post(
      '/cart/items',
      {
        productId,
        quantity,
      },
    )

  return response.data.data.cartItem
}

export async function updateCartItem({
  productId,
  quantity,
}) {
  const response =
    await api.patch(
      `/cart/items/${encodeURIComponent(productId)}`,
      {
        quantity,
      },
    )

  return response.data.data.cartItem
}

export async function removeCartItem(
  productId,
) {
  const response =
    await api.delete(
      `/cart/items/${encodeURIComponent(productId)}`,
    )

  return response.data.data
}

export async function clearCart() {
  const response =
    await api.delete('/cart')

  return response.data.data
}