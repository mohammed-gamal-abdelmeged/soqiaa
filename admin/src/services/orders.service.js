import api from "./api";

export async function getAdminOrders({
  page = 1,
  limit = 20,
  status = "all",
  search = "",
} = {}) {
  const params = {
    page,
    limit,
  };

  if (
    status &&
    status !== "all"
  ) {
    params.status =
      status;
  }

  const normalizedSearch =
    search.trim();

  if (normalizedSearch) {
    params.search =
      normalizedSearch;
  }

  const response =
    await api.get(
      "/admin/orders",
      {
        params,
      },
    );

  return {
    orders:
      response.data.data.orders,

    pagination:
      response.data.data.pagination,
  };
}

export async function getAdminOrder(
  orderId,
) {
  const response =
    await api.get(
      `/admin/orders/${orderId}`,
    );

  return response.data.data.order;
}

export async function updateAdminOrderStatus({
  orderId,
  status,
  note,
}) {
  const response =
    await api.patch(
      `/admin/orders/${orderId}/status`,
      {
        status,
        note,
      },
    );

  return response.data.data.order;
}