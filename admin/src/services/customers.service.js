import api from "./api";

export async function getAdminCustomers({
  page = 1,
  limit = 20,
  search = "",
  sort = "newest",
} = {}) {
  const params = {
    page,
    limit,
    sort,
  };

  const normalizedSearch =
    search.trim();

  if (normalizedSearch) {
    params.search =
      normalizedSearch;
  }

  const response =
    await api.get(
      "/admin/customers",
      {
        params,
      },
    );

  return response.data.data;
}