import {
  useQuery,
} from "@tanstack/react-query";

import {
  getDashboard,
} from "../../../services/dashboard.service";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

export function useDashboard() {
  return useQuery({
    queryKey:
      queryKeys.dashboard,

    queryFn:
      getDashboard,

    staleTime:
      cacheTimes.dashboard,
  });
}