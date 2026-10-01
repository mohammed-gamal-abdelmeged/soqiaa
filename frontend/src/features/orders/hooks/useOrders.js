import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

import {
  createOrder,
  getOrder,
  getOrders,
  previewOrder,
} from "../../../services/orders.service";

import {
  useAuth,
} from "../../auth/context/useAuth";

const EMPTY_CART = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const ORDERS_VISIBLE_LIMIT = 5;

export function useOrders() {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  return useQuery({
    queryKey:
      queryKeys.orders,

    queryFn:
      getOrders,

    staleTime:
      cacheTimes.orders,

    enabled:
      isAuthenticated &&
      !isAuthLoading,

    retry: false,

    /*
     * Backend may return more orders,
     * but the customer app displays
     * only the latest 5.
     */
    select: (orders) =>
      orders.slice(
        0,
        ORDERS_VISIBLE_LIMIT,
      ),
  });
}

export function useOrder(id) {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  return useQuery({
    queryKey:
      queryKeys.order(id),

    queryFn: () =>
      getOrder(id),

    staleTime:
      cacheTimes.order,

    enabled:
      Boolean(id) &&
      isAuthenticated &&
      !isAuthLoading,

    retry: false,
  });
}

export function usePreviewOrder() {
  return useMutation({
    mutationFn:
      previewOrder,
  });
}

export function useCreateOrder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createOrder,

    onSuccess(order) {
      /*
       * Cache the complete order
       * immediately for its details page.
       */
      queryClient.setQueryData(
        queryKeys.order(
          order.id,
        ),
        order,
      );

      /*
       * Important:
       *
       * Only update the orders cache
       * when it already exists.
       *
       * If it does not exist, we leave it
       * alone. Then opening /orders will
       * perform GET /orders and receive
       * the real previous orders too.
       *
       * This prevents creating an
       * incomplete cache containing only
       * the newly-created order.
       */
      const currentOrders =
        queryClient.getQueryData(
          queryKeys.orders,
        );

      if (
        Array.isArray(
          currentOrders,
        )
      ) {
        const withoutDuplicate =
          currentOrders.filter(
            (currentOrder) =>
              currentOrder.id !==
              order.id,
          );

        queryClient.setQueryData(
          queryKeys.orders,
          [
            order,
            ...withoutDuplicate,
          ],
        );
      }

      /*
       * Successful checkout clears
       * the cart on the backend.
       */
      queryClient.setQueryData(
        queryKeys.cart,
        EMPTY_CART,
      );

      /*
       * Checkout decreases stock.
       * Mirror that in the products
       * cache without another GET.
       */
      queryClient.setQueryData(
        queryKeys.products,
        (currentProducts) => {
          if (!currentProducts) {
            return currentProducts;
          }

          const purchasedQuantities =
            new Map(
              order.items.map(
                (item) => [
                  item.productId ??
                    item.id,

                  item.quantity,
                ],
              ),
            );

          return currentProducts.map(
            (product) => {
              const quantity =
                purchasedQuantities.get(
                  product.id,
                );

              if (!quantity) {
                return product;
              }

              return {
                ...product,

                stock:
                  Math.max(
                    0,
                    product.stock -
                      quantity,
                  ),
              };
            },
          );
        },
      );
    },
  });
}