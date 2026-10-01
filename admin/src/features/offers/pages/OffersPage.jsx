import {
  useMemo,
  useState,
} from "react";

import {
  useQueries,
} from "@tanstack/react-query";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Modal from "../../../components/ui/Modal";
import { appToast } from "../../../lib/toast";

import {
  getAdminCategory,
} from "../../../services/categories.service";

import {
  cacheTimes,
} from "../../../lib/cacheTimes";

import OfferForm from "../components/OfferForm";
import OfferMobileCard from "../components/OfferMobileCard";
import OffersTable from "../components/OffersTable";
import OffersToolbar from "../components/OffersToolbar";

import {
  useAdminCategories,
} from "../../categories/hooks/useAdminCategories";

import {
  useAdminProducts,
} from "../../products/hooks/useAdminProducts";

import {
  useAdminOffers,
  useCreateAdminOffer,
  useUpdateAdminOffer,
  useDeleteAdminOffer,
} from "../hooks/useAdminOffers";

import {
  filterOffersByStatus,
} from "../utils/offers";

export default function OffersPage() {
  /*
  |--------------------------------------------------------------------------
  | Queries
  |--------------------------------------------------------------------------
  */

  const {
    data: offers = [],
    isLoading:
      isOffersLoading,
    isError:
      isOffersError,
    error:
      offersError,
  } = useAdminOffers();

  const {
    data: categories = [],
    isLoading:
      isCategoriesLoading,
    isError:
      isCategoriesError,
    error:
      categoriesError,
  } = useAdminCategories();

  const {
    data: products = [],
    isLoading:
      isProductsLoading,
    isError:
      isProductsError,
    error:
      productsError,
  } = useAdminProducts();

  /*
  |--------------------------------------------------------------------------
  | Category Details
  |--------------------------------------------------------------------------
  |
  | الـOfferForm محتاج subcategories حسب القسم.
  |
  | بدل categoryDetailsMock:
  | نجيب تفاصيل كل Category من الـBackend.
  |--------------------------------------------------------------------------
  */

  const categoryDetailQueries =
    useQueries({
      queries:
        categories.map(
          (category) => ({
            queryKey: [
              "admin",
              "categories",
              "detail",
              category.slug,
            ],

            queryFn: () =>
              getAdminCategory(
                category.slug,
              ),

            enabled:
              Boolean(
                category.slug,
              ),

            staleTime:
              cacheTimes.categories,
          }),
        ),
    });

  const categoryDetails =
    useMemo(() => {
      const details = {};

      categoryDetailQueries.forEach(
        (
          query,
          index,
        ) => {
          const category =
            categories[index];

          if (
            !category?.slug ||
            !query.data
          ) {
            return;
          }

          details[
            category.slug
          ] = query.data;
        },
      );

      return details;
    }, [
      categories,
      categoryDetailQueries,
    ]);

  const isCategoryDetailsLoading =
    categoryDetailQueries.some(
      (query) =>
        query.isLoading,
    );

  const categoryDetailsError =
    categoryDetailQueries.find(
      (query) =>
        query.isError,
    )?.error;

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [
    status,
    setStatus,
  ] = useState("all");

  /*
  |--------------------------------------------------------------------------
  | Add / Edit Modal
  |--------------------------------------------------------------------------
  */

  const [
    formModal,
    setFormModal,
  ] = useState({
    isOpen: false,
    mode: "add",
    offer: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Delete Modal
  |--------------------------------------------------------------------------
  */

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({
    isOpen: false,
    offer: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Mutations
  |--------------------------------------------------------------------------
  */

  const createOfferMutation =
    useCreateAdminOffer();

  const updateOfferMutation =
    useUpdateAdminOffer();

  const deleteOfferMutation =
    useDeleteAdminOffer();

  /*
  |--------------------------------------------------------------------------
  | Derived Data
  |--------------------------------------------------------------------------
  */

  const filteredOffers =
    useMemo(
      () =>
        filterOffersByStatus(
          offers,
          status,
        ),
      [
        offers,
        status,
      ],
    );

  /*
   * المنتجات التي عليها Offer بالفعل.
   *
   * المنتج الواحد لا يمكن أن يكون
   * عليه أكثر من Offer.
   */

  const usedProductIds =
    useMemo(
      () =>
        offers.map(
          (offer) =>
            offer.productId,
        ),
      [offers],
    );

  /*
  |--------------------------------------------------------------------------
  | Add
  |--------------------------------------------------------------------------
  */

  const handleOpenAdd =
    () => {
      setFormModal({
        isOpen: true,
        mode: "add",
        offer: null,
      });
    };

  /*
  |--------------------------------------------------------------------------
  | Edit
  |--------------------------------------------------------------------------
  */

  const handleOpenEdit =
    (offer) => {
      setFormModal({
        isOpen: true,
        mode: "edit",
        offer,
      });
    };

  /*
  |--------------------------------------------------------------------------
  | Close Form
  |--------------------------------------------------------------------------
  */

  const handleCloseForm =
    () => {
      if (
        createOfferMutation.isPending ||
        updateOfferMutation.isPending
      ) {
        return;
      }

      setFormModal({
        isOpen: false,
        mode: "add",
        offer: null,
      });
    };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmitOffer =
    async ({
      productId,
      discountPercentage,
      isActive,
    }) => {
      try {
        /*
        |----------------------------------------------------------------------
        | Add
        |----------------------------------------------------------------------
        */

        if (
          formModal.mode ===
          "add"
        ) {
          const product =
            products.find(
              (item) =>
                String(
                  item.id,
                ) ===
                String(
                  productId,
                ),
            );

          if (!product) {
            appToast.error(
              "المنتج غير موجود",
            );

            return;
          }

          await createOfferMutation.mutateAsync(
            {
              productId,
              discountPercentage,
              isActive,
            },
          );

          appToast.success(
            `تم إضافة عرض على منتج ${product.name}`,
          );
        }

        /*
        |----------------------------------------------------------------------
        | Edit
        |----------------------------------------------------------------------
        */

        else {
          const offer =
            formModal.offer;

          if (!offer) {
            return;
          }

          const product =
            products.find(
              (item) =>
                String(
                  item.id,
                ) ===
                String(
                  productId,
                ),
            );

          if (!product) {
            appToast.error(
              "المنتج غير موجود",
            );

            return;
          }

          await updateOfferMutation.mutateAsync(
            {
              offerId:
                offer.id,

              productId,

              discountPercentage,

              isActive,
            },
          );

          appToast.success(
            `تم تعديل عرض منتج ${product.name}`,
          );
        }

        setFormModal({
          isOpen: false,
          mode: "add",
          offer: null,
        });
      } catch (error) {
        const errorCode =
          error?.response
            ?.data
            ?.error
            ?.code;

        /*
        |----------------------------------------------------------------------
        | Offer Already Exists
        |----------------------------------------------------------------------
        */

        if (
          errorCode ===
          "OFFER_ALREADY_EXISTS"
        ) {
          appToast.error(
            "المنتج عليه عرض بالفعل",
          );

          return;
        }

        /*
        |----------------------------------------------------------------------
        | Product Not Found
        |----------------------------------------------------------------------
        */

        if (
          errorCode ===
          "PRODUCT_NOT_FOUND"
        ) {
          appToast.error(
            "المنتج غير موجود",
          );

          return;
        }

        /*
        |----------------------------------------------------------------------
        | Offer Not Found
        |----------------------------------------------------------------------
        */

        if (
          errorCode ===
          "OFFER_NOT_FOUND"
        ) {
          appToast.error(
            "العرض غير موجود أو تم حذفه بالفعل",
          );

          setFormModal({
            isOpen: false,
            mode: "add",
            offer: null,
          });

          return;
        }

        appToast.error(
          "تعذر حفظ العرض، حاول مرة أخرى",
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleOpenDelete =
    (offer) => {
      setDeleteModal({
        isOpen: true,
        offer,
      });
    };

  const handleCloseDelete =
    () => {
      if (
        deleteOfferMutation.isPending
      ) {
        return;
      }

      setDeleteModal({
        isOpen: false,
        offer: null,
      });
    };

  const handleConfirmDelete =
    async () => {
      const offer =
        deleteModal.offer;

      if (
        !offer ||
        deleteOfferMutation.isPending
      ) {
        return;
      }

      try {
        await deleteOfferMutation.mutateAsync(
          offer.id,
        );

        const product =
          products.find(
            (item) =>
              String(
                item.id,
              ) ===
              String(
                offer.productId,
              ),
          );

        appToast.success(
          product
            ? `تم حذف عرض منتج ${product.name}`
            : "تم حذف العرض",
        );

        setDeleteModal({
          isOpen: false,
          offer: null,
        });
      } catch (error) {
        const errorCode =
          error?.response
            ?.data
            ?.error
            ?.code;

        if (
          errorCode ===
          "OFFER_NOT_FOUND"
        ) {
          appToast.error(
            "العرض غير موجود أو تم حذفه بالفعل",
          );

          setDeleteModal({
            isOpen: false,
            offer: null,
          });

          return;
        }

        appToast.error(
          "تعذر حذف العرض، حاول مرة أخرى",
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Current Delete Product
  |--------------------------------------------------------------------------
  */

  const deleteProduct =
    deleteModal.offer
      ? products.find(
          (product) =>
            String(
              product.id,
            ) ===
            String(
              deleteModal
                .offer
                .productId,
            ),
        )
      : null;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  const isLoading =
    isOffersLoading ||
    isProductsLoading ||
    isCategoriesLoading ||
    isCategoryDetailsLoading;

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  const isError =
    isOffersError ||
    isProductsError ||
    isCategoriesError ||
    categoryDetailQueries.some(
      (query) =>
        query.isError,
    );

  const errorMessage =
    offersError
      ?.response
      ?.data
      ?.error
      ?.message ||
    productsError
      ?.response
      ?.data
      ?.error
      ?.message ||
    categoriesError
      ?.response
      ?.data
      ?.error
      ?.message ||
    categoryDetailsError
      ?.response
      ?.data
      ?.error
      ?.message;

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <div className="space-y-6">
        {/* Header */}

        <header>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            إدارة العروض
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            إدارة الخصومات المطبقة
            على منتجات متجر سوقيا
          </p>
        </header>

        {/* Toolbar */}

        <OffersToolbar
          status={status}
          onStatusChange={
            setStatus
          }
          onAddOffer={
            handleOpenAdd
          }
        />

        {/* Loading */}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-500">
              جاري تحميل العروض...
            </p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
            <p className="text-sm font-semibold text-red-700">
              تعذر تحميل العروض
            </p>

            {errorMessage ? (
              <p className="mt-2 text-xs text-red-500">
                {errorMessage}
              </p>
            ) : null}
          </div>
        ) : filteredOffers.length >
          0 ? (
          <>
            {/* Desktop */}

            <OffersTable
              offers={
                filteredOffers
              }
              products={
                products
              }
              onEdit={
                handleOpenEdit
              }
              onDelete={
                handleOpenDelete
              }
            />

            {/* Mobile */}

            <div className="space-y-3 md:hidden">
              {filteredOffers.map(
                (offer) => (
                  <OfferMobileCard
                    key={
                      offer.id
                    }
                    offer={offer}
                    product={products.find(
                      (
                        product,
                      ) =>
                        String(
                          product.id,
                        ) ===
                        String(
                          offer.productId,
                        ),
                    )}
                    onEdit={
                      handleOpenEdit
                    }
                    onDelete={
                      handleOpenDelete
                    }
                  />
                ),
              )}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">
              لا توجد عروض
            </p>

            <p className="mt-1 text-xs text-slate-500">
              لا توجد عروض مطابقة
              للفلتر المحدد
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}

      <Modal
        isOpen={
          formModal.isOpen
        }
        title={
          formModal.mode ===
          "edit"
            ? "تعديل العرض"
            : "إضافة عرض جديد"
        }
        description={
          formModal.mode ===
          "edit"
            ? "قم بتعديل بيانات الخصم ثم احفظ التغييرات"
            : "اختر المنتج وحدد نسبة الخصم وحالة العرض"
        }
        onClose={
          handleCloseForm
        }
        maxWidth="max-w-lg lg:max-w-xl"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleCloseForm
              }
              disabled={
                createOfferMutation.isPending ||
                updateOfferMutation.isPending
              }
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="offer-form"
              disabled={
                createOfferMutation.isPending ||
                updateOfferMutation.isPending
              }
              className="h-11 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createOfferMutation.isPending ||
              updateOfferMutation.isPending
                ? "جاري الحفظ..."
                : formModal.mode ===
                    "edit"
                  ? "حفظ التعديلات"
                  : "إضافة العرض"}
            </button>
          </div>
        }
      >
        <OfferForm
          mode={
            formModal.mode
          }
          initialData={
            formModal.offer
          }
          categories={
            categories
          }
          categoryDetails={
            categoryDetails
          }
          products={
            products
          }
          usedProductIds={
            usedProductIds
          }
          onSubmit={
            handleSubmitOffer
          }
        />
      </Modal>

      {/* Delete */}

      <ConfirmDialog
        isOpen={
          deleteModal.isOpen
        }
        title="حذف العرض"
        description={
          deleteProduct
            ? `هل تريد حذف العرض الموجود على المنتج "${deleteProduct.name}"؟`
            : "هل تريد حذف هذا العرض؟"
        }
        confirmText={
          deleteOfferMutation.isPending
            ? "جاري الحذف..."
            : "نعم، حذف العرض"
        }
        cancelText="إلغاء"
        variant="danger"
        onClose={
          handleCloseDelete
        }
        onConfirm={
          handleConfirmDelete
        }
      />
    </>
  );
}