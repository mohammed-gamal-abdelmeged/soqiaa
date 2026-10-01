import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminOrder,
  getAdminOrders,
  updateAdminOrderStatus,
} from "../../../services/orders.service";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

/*
|--------------------------------------------------------------------------
| Admin Orders List
|--------------------------------------------------------------------------
*/

export function useAdminOrders({
  page = 1,
  limit = 20,
  status = "all",
  search = "",
} = {}) {
  const normalizedSearch =
    search.trim();

  const query =
    useQuery({
      queryKey:
        queryKeys.orders({
          page,
          limit,
          status,
          search:
            normalizedSearch,
        }),

      queryFn: () =>
        getAdminOrders({
          page,
          limit,
          status,
          search:
            normalizedSearch,
        }),

      staleTime:
        cacheTimes.orders,

      placeholderData:
        keepPreviousData,
    });

  return {
    ...query,

    data:
      query.data?.orders ??
      [],

    pagination:
      query.data
        ?.pagination ?? {
        page,
        limit,
        total: 0,
        totalPages: 1,
        hasNextPage:
          false,
        hasPreviousPage:
          false,
      },
  };
}

/*
|--------------------------------------------------------------------------
| Single Admin Order
|--------------------------------------------------------------------------
*/

export function useAdminOrder(
  orderId,
) {
  return useQuery({
    queryKey:
      queryKeys.order(
        orderId,
      ),

    queryFn: () =>
      getAdminOrder(
        orderId,
      ),

    enabled:
      Boolean(orderId),

    staleTime:
      cacheTimes.order,
  });
}

/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
*/

export function useUpdateAdminOrderStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateAdminOrderStatus,

    onSuccess: (
      updatedOrder,
    ) => {
      /*
       * Update full order details cache.
       */
      queryClient.setQueryData(
        queryKeys.order(
          updatedOrder.id,
        ),
        updatedOrder,
      );

      /*
       * Update all cached order-list queries:
       *
       * page 1
       * page 2
       * filters
       * searches
       *
       * without making another request.
       */
      queryClient.setQueriesData(
        {
          queryKey: [
            "admin",
            "orders",
          ],
        },
        (
          currentData,
        ) => {
          if (!currentData) {
            return currentData;
          }

          if (
            !Array.isArray(
              currentData.orders,
            )
          ) {
            return currentData;
          }

          return {
            ...currentData,

            orders:
              currentData.orders.map(
                (order) =>
                  order.id ===
                  updatedOrder.id
                    ? {
                        ...order,

                        status:
                          updatedOrder.status,
                      }
                    : order,
              ),
          };
        },
      );

      /*
       * Dashboard contains recent
       * orders, so refresh it next
       * time it is needed.
       */
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.dashboard,
      });
    },
  });
}