import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminCustomers,
} from "../../../services/customers.service";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

export function useAdminCustomers({
  page = 1,
  limit = 20,
  search = "",
  sort = "newest",
} = {}) {
  const normalizedSearch =
    search.trim();

  const query =
    useQuery({
      queryKey:
        queryKeys.customers({
          page,
          limit,
          search:
            normalizedSearch,
          sort,
        }),

      queryFn: () =>
        getAdminCustomers({
          page,
          limit,
          search:
            normalizedSearch,
          sort,
        }),

      staleTime:
        cacheTimes.customers,

      placeholderData:
        keepPreviousData,
    });

  return {
    ...query,

    data:
      query.data
        ?.customers ?? [],

    pagination:
      query.data
        ?.pagination ?? {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNextPage:
          false,
        hasPreviousPage:
          false,
      },
  };
}