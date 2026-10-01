import {
  useQuery,
} from '@tanstack/react-query'

import {
  queryKeys,
} from '../../../lib/queryKeys'

import {
  cacheTimes,
} from '../../../lib/cacheTimes'

import {
  getCategories,
  getCategory,
} from '../../../services/categories.service'

export function useCategories() {
  return useQuery({
    queryKey:
      queryKeys.categories,

    queryFn:
      getCategories,

    staleTime:
      cacheTimes.categories,
  })
}

export function useCategory(
  slug,
) {
  return useQuery({
    queryKey:
      queryKeys.category(
        slug,
      ),

    queryFn: () =>
      getCategory(
        slug,
      ),

    staleTime:
      cacheTimes.category,

    enabled:
      Boolean(slug),
  })
}