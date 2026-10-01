import api from "./api";

export async function getFavorites() {
  const response =
    await api.get("/favorites");

  return response.data.data.favorites;
}

export async function addFavorite(
  productId,
) {
  const response =
    await api.post(
      "/favorites",
      {
        productId,
      },
    );

  return response.data.data.favorite;
}

export async function removeFavorite(
  productId,
) {
  const response =
    await api.delete(
      `/favorites/${encodeURIComponent(productId)}`,
    );

  return response.data.data;
}