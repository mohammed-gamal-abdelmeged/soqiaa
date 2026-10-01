import {
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminCategory,
} from "../../../services/categories.service";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";


export function useAdminCategory(
  slug,
) {
  return useQuery({
    queryKey: [
      ...queryKeys.categories,
      "detail",
      slug,
    ],

    queryFn: () =>
      getAdminCategory(
        slug,
      ),

    enabled:
      Boolean(slug),

    staleTime:
      cacheTimes.categories,
  });
}