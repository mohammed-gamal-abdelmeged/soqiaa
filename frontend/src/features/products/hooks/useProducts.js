import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  queryKeys,
} from '../../../lib/queryKeys'

import {
  cacheTimes,
} from '../../../lib/cacheTimes'

import {
  getProduct,
  getProducts,
} from '../../../services/products.service'

export function useProducts() {
  return useQuery({
    queryKey:
      queryKeys.products,

    queryFn:
      getProducts,

    staleTime:
      cacheTimes.products,
  })
}

export function useProduct(
  id,
) {
  const queryClient =
    useQueryClient()

  return useQuery({
    queryKey:
      queryKeys.product(
        id,
      ),

    queryFn: () =>
      getProduct(
        id,
      ),

    staleTime:
      cacheTimes.product,

    enabled:
      Boolean(id),

    /*
     * If /products has already
     * been fetched, reuse the
     * same product immediately.
     *
     * This avoids another HTTP
     * request when opening the
     * product details page.
     */
    initialData: () => {
      const products =
        queryClient.getQueryData(
          queryKeys.products,
        )

      return products?.find(
        (product) =>
          String(product.id) ===
          String(id),
      )
    },

    initialDataUpdatedAt: () =>
      queryClient.getQueryState(
        queryKeys.products,
      )?.dataUpdatedAt,
  })
}