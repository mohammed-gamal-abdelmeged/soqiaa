import api from "./api";

export async function getOrders() {
  const response =
    await api.get("/orders");

  return response.data.data.orders;
}

export async function getOrder(
  id,
) {
  const response =
    await api.get(
      `/orders/${encodeURIComponent(id)}`,
    );

  return response.data.data.order;
}

export async function previewOrder(
  data,
) {
  const response =
    await api.post(
      "/orders/preview",
      data,
    );

  return response.data.data.preview;
}

export async function createOrder(
  data,
) {
  const response =
    await api.post(
      "/orders",
      data,
    );

  return response.data.data.order;
}