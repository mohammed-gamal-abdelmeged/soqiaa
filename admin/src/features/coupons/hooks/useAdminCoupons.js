import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminCoupon,
  deleteAdminCoupon,
  getAdminCoupon,
  getAdminCoupons,
  updateAdminCoupon,
} from "../../../services/coupons.service";

import {
  queryKeys,
} from "../../../lib/queryKeys";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

/*
|--------------------------------------------------------------------------
| Coupons List
|--------------------------------------------------------------------------
*/

export function useAdminCoupons() {
  return useQuery({
    queryKey:
      queryKeys.coupons,

    queryFn:
      getAdminCoupons,

    staleTime:
      cacheTimes.coupons,
  });
}

/*
|--------------------------------------------------------------------------
| Coupon Details
|--------------------------------------------------------------------------
*/

export function useAdminCoupon(
  couponId,
) {
  return useQuery({
    queryKey:
      queryKeys.coupon(
        couponId,
      ),

    queryFn: () =>
      getAdminCoupon(
        couponId,
      ),

    enabled:
      Boolean(couponId),

    staleTime:
      cacheTimes.coupons,
  });
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export function useCreateAdminCoupon() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createAdminCoupon,

    onSuccess: (
      createdCoupon,
    ) => {
      queryClient.setQueryData(
        queryKeys.coupons,
        (
          currentCoupons = [],
        ) => [
          createdCoupon,
          ...currentCoupons,
        ],
      );

      queryClient.setQueryData(
        queryKeys.coupon(
          createdCoupon.id,
        ),
        createdCoupon,
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export function useUpdateAdminCoupon() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateAdminCoupon,

    onSuccess: (
      updatedCoupon,
    ) => {
      queryClient.setQueryData(
        queryKeys.coupons,
        (
          currentCoupons = [],
        ) =>
          currentCoupons.map(
            (coupon) =>
              coupon.id ===
              updatedCoupon.id
                ? updatedCoupon
                : coupon,
          ),
      );

      queryClient.setQueryData(
        queryKeys.coupon(
          updatedCoupon.id,
        ),
        updatedCoupon,
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export function useDeleteAdminCoupon() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminCoupon,

    onSuccess: (
      deletedCoupon,
    ) => {
      queryClient.setQueryData(
        queryKeys.coupons,
        (
          currentCoupons = [],
        ) =>
          currentCoupons.filter(
            (coupon) =>
              coupon.id !==
              deletedCoupon.id,
          ),
      );

      queryClient.removeQueries({
        queryKey:
          queryKeys.coupon(
            deletedCoupon.id,
          ),
      });
    },
  });
}