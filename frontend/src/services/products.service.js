import api from './api'

export async function getProducts() {
  const response =
    await api.get('/products')

  return response.data.data.products
}

export async function getProduct(
  id,
) {
  const response =
    await api.get(
      `/products/${encodeURIComponent(id)}`,
    )

  return response.data.data.product
}