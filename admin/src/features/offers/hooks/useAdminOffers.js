import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminOffer,
  deleteAdminOffer,
  getAdminOffer,
  getAdminOffers,
  updateAdminOffer,
} from "../../../services/offers.service";

/*
|--------------------------------------------------------------------------
| Query Keys
|--------------------------------------------------------------------------
|
| مفيش Filters في الـBackend بتاع Offers حاليًا،
| لذلك List Key واحدة كفاية.
|--------------------------------------------------------------------------
*/

const offerQueryKeys = {
  all: [
    "admin",
    "offers",
  ],

  list: () => [
    "admin",
    "offers",
  ],

  detail: (
    offerId,
  ) => [
    "admin",
    "offer",
    offerId,
  ],
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

/*
 * Update Offers List Cache
 *
 * الـOffers عندنا List واحدة حاليًا،
 * لكن بنستخدم getQueriesData عشان
 * نفضل مرنين لو أضفنا filters بعدين.
 */

function updateOffersListCaches(
  queryClient,
  updater,
) {
  const cachedQueries =
    queryClient.getQueriesData({
      queryKey:
        offerQueryKeys.all,
    });

  cachedQueries.forEach(
    ([
      queryKey,
      currentOffers,
    ]) => {
      /*
       * نتأكد إن الـquery
       * عبارة عن List مش Detail.
       */

      if (
        !Array.isArray(
          currentOffers,
        )
      ) {
        return;
      }

      if (
        queryKey.length !==
        2
      ) {
        return;
      }

      queryClient.setQueryData(
        queryKey,
        updater(
          currentOffers,
        ),
      );
    },
  );
}

/*
|--------------------------------------------------------------------------
| Update Product Caches
|--------------------------------------------------------------------------
|
| الـProduct نفسه بيرجع:
|
| discountPercentage
|
| والـBackend بيحسبه من الـOffer.
|
| لذلك بعد أي Offer mutation
| بنعمل invalidate للـProducts.
|--------------------------------------------------------------------------
*/

function invalidateProductCaches(
  queryClient,
) {
  /*
   * Admin Product Lists
   */

  queryClient.invalidateQueries({
    queryKey: [
      "admin",
      "products",
    ],
  });

  /*
   * Admin Product Details
   */

  queryClient.invalidateQueries({
    queryKey: [
      "admin",
      "product",
    ],
  });
}

/*
|--------------------------------------------------------------------------
| Offers List
|--------------------------------------------------------------------------
*/

export function useAdminOffers() {
  return useQuery({
    queryKey:
      offerQueryKeys.list(),

    queryFn:
      getAdminOffers,

    /*
     * مفيش اعتماد على
     * cacheTimes.offers هنا
     * عشان الملف يشتغل مباشرة
     * من غير ما نضيف dependency
     * لملف تاني.
     */

    staleTime: 0,
  });
}

/*
|--------------------------------------------------------------------------
| Offer Details
|--------------------------------------------------------------------------
*/

export function useAdminOffer(
  offerId,
) {
  return useQuery({
    queryKey:
      offerQueryKeys.detail(
        offerId,
      ),

    queryFn: () =>
      getAdminOffer(
        offerId,
      ),

    enabled:
      Boolean(offerId),

    staleTime: 0,
  });
}

/*
|--------------------------------------------------------------------------
| Create Offer
|--------------------------------------------------------------------------
*/

export function useCreateAdminOffer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createAdminOffer,

    onSuccess: (
      createdOffer,
    ) => {
      /*
       * Add the new offer
       * to the existing list cache.
       *
       * بدون GET إضافي للـOffers.
       */

      updateOffersListCaches(
        queryClient,
        (
          currentOffers,
        ) => {
          const alreadyExists =
            currentOffers.some(
              (
                offer,
              ) =>
                offer.id ===
                createdOffer.id,
            );

          if (
            alreadyExists
          ) {
            return currentOffers;
          }

          return [
            createdOffer,
            ...currentOffers,
          ];
        },
      );

      /*
       * Store detail cache
       * from POST response.
       */

      queryClient.setQueryData(
        offerQueryKeys.detail(
          createdOffer.id,
        ),
        createdOffer,
      );

      /*
       * مهم:
       *
       * إنشاء Offer بيغير
       * discountPercentage
       * بتاع المنتج.
       *
       * لذلك نعمل invalidate
       * للـProduct caches.
       */

      invalidateProductCaches(
        queryClient,
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Offer
|--------------------------------------------------------------------------
*/

export function useUpdateAdminOffer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateAdminOffer,

    onSuccess: (
      updatedOffer,
    ) => {
      /*
       * Update Offer List Cache
       */

      updateOffersListCaches(
        queryClient,
        (
          currentOffers,
        ) =>
          currentOffers.map(
            (
              offer,
            ) =>
              offer.id ===
              updatedOffer.id
                ? updatedOffer
                : offer,
          ),
      );

      /*
       * Update Offer Detail Cache
       */

      queryClient.setQueryData(
        offerQueryKeys.detail(
          updatedOffer.id,
        ),
        updatedOffer,
      );

      /*
       * الـOffer ممكن:
       *
       * - يتغير الخصم
       * - يتقفل / يتفتح
       * - يتنقل لمنتج تاني
       *
       * لذلك لازم Product
       * caches تتحدث.
       */

      invalidateProductCaches(
        queryClient,
      );
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete Offer
|--------------------------------------------------------------------------
*/

export function useDeleteAdminOffer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminOffer,

    onSuccess: (
      deletedOffer,
    ) => {
      /*
       * Remove Offer from List Cache
       */

      updateOffersListCaches(
        queryClient,
        (
          currentOffers,
        ) =>
          currentOffers.filter(
            (
              offer,
            ) =>
              offer.id !==
              deletedOffer.id,
          ),
      );

      /*
       * Remove Offer Detail Cache
       */

      queryClient.removeQueries({
        queryKey:
          offerQueryKeys.detail(
            deletedOffer.id,
          ),
      });

      /*
       * أهم جزء:
       *
       * حذف الـOffer من DB
       * يخلي Product بدون Offer.
       *
       * Product serializer
       * بالتالي يرجع:
       *
       * discountPercentage: 0
       *
       * فنحدث Product caches.
       */

      invalidateProductCaches(
        queryClient,
      );
    },
  });
}