import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getMyProfile,
  updateMyProfile,
} from '../../../services/users.service'

import {
  queryKeys,
} from '../../../lib/queryKeys'

import {
  cacheTimes,
} from '../../../lib/cacheTimes'

export function useMyProfile() {
  return useQuery({
    queryKey:
      queryKeys.profile,

    queryFn:
      getMyProfile,

    staleTime:
      cacheTimes.profile,

    retry: false,
  })
}

export function useUpdateMyProfile() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn:
      updateMyProfile,

    onSuccess(user) {
      /*
       * PATCH already returns
       * the complete fresh profile.
       *
       * Update the cache directly
       * instead of sending another GET.
       */
      queryClient.setQueryData(
        queryKeys.profile,
        user,
      )
    },
  })
}