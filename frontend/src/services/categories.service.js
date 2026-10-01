import api from './api'

export async function getCategories() {
  const response =
    await api.get('/categories')

  return response.data.data.categories
}

export async function getCategory(
  slug,
) {
  const response =
    await api.get(
      `/categories/${encodeURIComponent(slug)}`,
    )

  return response.data.data.category
}