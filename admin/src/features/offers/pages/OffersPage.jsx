// src/features/offers/pages/OffersPage.jsx

import {
  useMemo,
  useState,
} from "react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Modal from "../../../components/ui/Modal";
import { appToast } from "../../../lib/toast";

import OfferForm from "../components/OfferForm";
import OfferMobileCard from "../components/OfferMobileCard";
import OffersTable from "../components/OffersTable";
import OffersToolbar from "../components/OffersToolbar";

import { categoriesMock } from "../../categories/data/categories.mock";
import { categoryDetailsMock } from "../../categories/data/categoryDetails.mock";
import { productsMock } from "../../products/data/products.mock";

import {
  createOffersFromProducts,
  filterOffersByStatus,
} from "../utils/offers";

export default function OffersPage() {
  /*
    Initial offers come ONLY from
    products that already have discountPercentage.
  */

  const [offers, setOffers] =
    useState(() =>
      createOffersFromProducts(
        productsMock,
      ),
    );

  const [status, setStatus] =
    useState("all");

  const [formModal, setFormModal] =
    useState({
      isOpen: false,
      mode: "add",
      offer: null,
    });

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({
    isOpen: false,
    offer: null,
  });

  const filteredOffers =
    useMemo(
      () =>
        filterOffersByStatus(
          offers,
          status,
        ),
      [offers, status],
    );

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
    ===================================
    ADD
    ===================================
  */

  const handleOpenAdd = () => {
    setFormModal({
      isOpen: true,
      mode: "add",
      offer: null,
    });
  };

  /*
    ===================================
    EDIT
    ===================================
  */

  const handleOpenEdit = (
    offer,
  ) => {
    setFormModal({
      isOpen: true,
      mode: "edit",
      offer,
    });
  };

  const handleCloseForm = () => {
    setFormModal({
      isOpen: false,
      mode: "add",
      offer: null,
    });
  };

  /*
    ===================================
    SUBMIT
    ===================================
  */

  const handleSubmitOffer = ({
    productId,
    discountPercentage,
    isActive,
  }) => {
    /*
      ADD
    */

    if (
      formModal.mode === "add"
    ) {
      const product =
        productsMock.find(
          (item) =>
            item.id === productId,
        );

      if (!product) return;

      /*
        One product = one offer,
        because product model only contains
        one discountPercentage.
      */

      const alreadyExists =
        offers.some(
          (offer) =>
            offer.productId ===
            productId,
        );

      if (alreadyExists) {
        appToast.error(
          `المنتج ${product.name} عليه عرض بالفعل`,
        );

        return;
      }

      const newOffer = {
        id: Date.now(),
        productId,
        discountPercentage,
        isActive,
      };

      setOffers((current) => [
        ...current,
        newOffer,
      ]);

      appToast.success(
        `تم إضافة عرض على منتج ${product.name}`,
      );

      handleCloseForm();

      return;
    }

    /*
      EDIT
    */

    const editedOffer =
      formModal.offer;

    if (!editedOffer) return;

    const product =
      productsMock.find(
        (item) =>
          item.id === productId,
      );

    if (!product) return;

    /*
      If product changed during edit,
      don't allow using product that
      already belongs to another offer.
    */

    const productUsedByAnotherOffer =
      offers.some(
        (offer) =>
          offer.id !==
            editedOffer.id &&
          offer.productId ===
            productId,
      );

    if (
      productUsedByAnotherOffer
    ) {
      appToast.error(
        `المنتج ${product.name} عليه عرض بالفعل`,
      );

      return;
    }

    setOffers((current) =>
      current.map((offer) =>
        offer.id ===
        editedOffer.id
          ? {
              ...offer,
              productId,
              discountPercentage,
              isActive,
            }
          : offer,
      ),
    );

    appToast.success(
      `تم تعديل عرض منتج ${product.name}`,
    );

    handleCloseForm();
  };

  /*
    ===================================
    DELETE
    ===================================
  */

  const handleOpenDelete = (
    offer,
  ) => {
    setDeleteModal({
      isOpen: true,
      offer,
    });
  };

  const handleCloseDelete = () => {
    setDeleteModal({
      isOpen: false,
      offer: null,
    });
  };

  const handleConfirmDelete =
    () => {
      const offer =
        deleteModal.offer;

      if (!offer) return;

      const product =
        productsMock.find(
          (item) =>
            item.id ===
            offer.productId,
        );

      setOffers((current) =>
        current.filter(
          (item) =>
            item.id !== offer.id,
        ),
      );

      appToast.success(
        product
          ? `تم حذف عرض منتج ${product.name}`
          : "تم حذف العرض",
      );

      handleCloseDelete();
    };

  const deleteProduct =
    deleteModal.offer
      ? productsMock.find(
          (product) =>
            product.id ===
            deleteModal.offer
              .productId,
        )
      : null;

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

        {/* Content */}

        {filteredOffers.length >
        0 ? (
          <>
            <OffersTable
              offers={
                filteredOffers
              }
              products={
                productsMock
              }
              onEdit={
                handleOpenEdit
              }
              onDelete={
                handleOpenDelete
              }
            />

            <div className="space-y-3 md:hidden">
              {filteredOffers.map(
                (offer) => (
                  <OfferMobileCard
                    key={
                      offer.id
                    }
                    offer={offer}
                    product={productsMock.find(
                      (product) =>
                        product.id ===
                        offer.productId,
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

      {/* =================================
          ADD / EDIT MODAL
      ================================= */}

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
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="offer-form"
              className="h-11 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {formModal.mode ===
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
            categoriesMock
          }
          categoryDetails={
            categoryDetailsMock
          }
          products={
            productsMock
          }
          usedProductIds={
            usedProductIds
          }
          onSubmit={
            handleSubmitOffer
          }
        />
      </Modal>

      {/* =================================
          DELETE
      ================================= */}

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
        confirmText="نعم، حذف العرض"
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