import {
  useMemo,
  useState,
} from "react";

import {
  BadgePercent,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  appToast,
} from "../../../lib/toast";

import CouponsToolbar from "../components/CouponsToolbar";
import CouponsTable from "../components/CouponsTable";
import CouponMobileCard from "../components/CouponMobileCard";
import CouponForm from "../components/CouponForm";

import {
  useAdminCoupons,
  useCreateAdminCoupon,
  useDeleteAdminCoupon,
  useUpdateAdminCoupon,
} from "../hooks/useAdminCoupons";

import {
  filterCouponsByStatus,
} from "../utils/coupons";

export default function CouponsPage() {
  const [
    status,
    setStatus,
  ] = useState("all");

  const [
    formModal,
    setFormModal,
  ] = useState({
    isOpen: false,
    mode: "add",
    coupon: null,
  });

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({
    isOpen: false,
    coupon: null,
  });

  const {
    data: coupons = [],
    isPending,
    isError,
    error,
    refetch,
  } = useAdminCoupons();

  const createCouponMutation =
    useCreateAdminCoupon();

  const updateCouponMutation =
    useUpdateAdminCoupon();

  const deleteCouponMutation =
    useDeleteAdminCoupon();

  const filteredCoupons =
    useMemo(
      () =>
        filterCouponsByStatus(
          coupons,
          status,
        ),
      [
        coupons,
        status,
      ],
    );

  const isMutating =
    createCouponMutation
      .isPending ||
    updateCouponMutation
      .isPending ||
    deleteCouponMutation
      .isPending;

  function handleOpenAdd() {
    setFormModal({
      isOpen: true,
      mode: "add",
      coupon: null,
    });
  }

  function handleOpenEdit(
    coupon,
  ) {
    setFormModal({
      isOpen: true,
      mode: "edit",
      coupon,
    });
  }

  function handleCloseForm() {
    if (
      isMutating
    ) {
      return;
    }

    setFormModal({
      isOpen: false,
      mode: "add",
      coupon: null,
    });
  }

  async function handleSubmitCoupon(
    formData,
  ) {
    try {
      if (
        formModal.mode ===
        "add"
      ) {
        await createCouponMutation
          .mutateAsync(
            formData,
          );

        appToast.success(
          `تم إضافة كوبون ${formData.code} بنجاح`,
        );
      } else {
        const coupon =
          formModal.coupon;

        if (!coupon) {
          return;
        }

        await updateCouponMutation
          .mutateAsync({
            couponId:
              coupon.id,

            ...formData,
          });

        appToast.success(
          `تم تعديل كوبون ${formData.code} بنجاح`,
        );
      }

      setFormModal({
        isOpen: false,
        mode: "add",
        coupon: null,
      });
    } catch (mutationError) {
      const errorCode =
        mutationError
          ?.response
          ?.data
          ?.error
          ?.code;

      if (
        errorCode ===
        "COUPON_CODE_EXISTS"
      ) {
        appToast.error(
          "كود الخصم موجود بالفعل",
        );

        return;
      }

      appToast.error(
        "تعذر حفظ الكوبون، حاول مرة أخرى",
      );
    }
  }

  async function handleToggleStatus(
    coupon,
    value,
  ) {
    if (
      updateCouponMutation
        .isPending
    ) {
      return;
    }

    try {
      await updateCouponMutation
        .mutateAsync({
          couponId:
            coupon.id,

          isActive:
            value,
        });

      appToast.success(
        value
          ? `تم تشغيل كوبون ${coupon.code}`
          : `تم إيقاف كوبون ${coupon.code}`,
      );
    } catch {
      appToast.error(
        "تعذر تغيير حالة الكوبون",
      );
    }
  }

  function handleOpenDelete(
    coupon,
  ) {
    setDeleteModal({
      isOpen: true,
      coupon,
    });
  }

  function handleCloseDelete() {
    if (
      deleteCouponMutation
        .isPending
    ) {
      return;
    }

    setDeleteModal({
      isOpen: false,
      coupon: null,
    });
  }

  async function handleConfirmDelete() {
    const coupon =
      deleteModal.coupon;

    if (
      !coupon ||
      deleteCouponMutation
        .isPending
    ) {
      return;
    }

    try {
      await deleteCouponMutation
        .mutateAsync(
          coupon.id,
        );

      appToast.success(
        `تم حذف كوبون ${coupon.code}`,
      );

      setDeleteModal({
        isOpen: false,
        coupon: null,
      });
    } catch (deleteError) {
      const errorCode =
        deleteError
          ?.response
          ?.data
          ?.error
          ?.code;

      if (
        errorCode ===
        "COUPON_IN_USE"
      ) {
        appToast.error(
          "الكوبون تم استخدامه بالفعل، أوقفه بدل حذفه",
        );

        setDeleteModal({
          isOpen: false,
          coupon: null,
        });

        return;
      }

      appToast.error(
        "تعذر حذف الكوبون",
      );
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-500">
            جاري تحميل كوبونات الخصم...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          تعذر تحميل كوبونات الخصم
        </p>

        {error?.message && (
          <p className="mt-2 text-xs text-red-500">
            {
              error.message
            }
          </p>
        )}

        <button
          type="button"
          onClick={() =>
            refetch()
          }
          className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <BadgePercent
              size={21}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              كوبونات الخصم
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              إضافة وإدارة أكواد الخصم وتشغيلها أو إيقافها
            </p>
          </div>
        </div>
      </section>

      <CouponsToolbar
        status={
          status
        }
        onStatusChange={
          setStatus
        }
        onAddCoupon={
          handleOpenAdd
        }
      />

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="إجمالي الكوبونات"
          value={
            coupons.length
          }
        />

        <SummaryCard
          label="الكوبونات النشطة"
          value={
            coupons.filter(
              (coupon) =>
                coupon.isActive,
            ).length
          }
        />

        <SummaryCard
          label="إجمالي الاستخدام"
          value={coupons.reduce(
            (
              total,
              coupon,
            ) =>
              total +
              Number(
                coupon.usedCount ||
                  0,
              ),
            0,
          )}
          className="col-span-2 sm:col-span-1"
        />
      </section>

      {/* Coupons */}
      {filteredCoupons.length >
      0 ? (
        <>
          <CouponsTable
            coupons={
              filteredCoupons
            }
            onEdit={
              handleOpenEdit
            }
            onDelete={
              handleOpenDelete
            }
            onToggleStatus={
              handleToggleStatus
            }
            isUpdating={
              isMutating
            }
          />

          <div className="grid gap-4 md:hidden">
            {filteredCoupons.map(
              (coupon) => (
                <CouponMobileCard
                  key={
                    coupon.id
                  }
                  coupon={
                    coupon
                  }
                  onEdit={
                    handleOpenEdit
                  }
                  onDelete={
                    handleOpenDelete
                  }
                  onToggleStatus={
                    handleToggleStatus
                  }
                  isUpdating={
                    isMutating
                  }
                />
              ),
            )}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <BadgePercent
            size={34}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 text-base font-bold text-slate-700">
            لا توجد كوبونات
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {status ===
            "all"
              ? "ابدأ بإضافة أول كوبون خصم."
              : "لا توجد كوبونات مطابقة للحالة المحددة."}
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={
          formModal.isOpen
        }
        onClose={
          handleCloseForm
        }
        title={
          formModal.mode ===
          "add"
            ? "إضافة كوبون خصم"
            : "تعديل كوبون الخصم"
        }
        description="حدد قيمة الخصم وشروط استخدام الكوبون."
        maxWidth="max-w-2xl"
        footer={
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleCloseForm
              }
              disabled={
                isMutating
              }
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="coupon-form"
              disabled={
                isMutating
              }
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isMutating
                ? "جاري الحفظ..."
                : formModal.mode ===
                    "add"
                  ? "إضافة الكوبون"
                  : "حفظ التعديلات"}
            </button>
          </div>
        }
      >
        <CouponForm
          mode={
            formModal.mode
          }
          initialData={
            formModal.coupon
          }
          onSubmit={
            handleSubmitCoupon
          }
        />
      </Modal>

      {/* Delete */}
      <ConfirmDialog
        isOpen={
          deleteModal.isOpen
        }
        onClose={
          handleCloseDelete
        }
        onConfirm={
          handleConfirmDelete
        }
        title="حذف كوبون الخصم"
        description={
          deleteModal.coupon
            ? `هل تريد حذف كوبون "${deleteModal.coupon.code}"؟`
            : ""
        }
        confirmText={
          deleteCouponMutation
            .isPending
            ? "جاري الحذف..."
            : "حذف"
        }
        cancelText="إلغاء"
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  className = "",
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white p-4",
        className,
      ].join(" ")}
    >
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}