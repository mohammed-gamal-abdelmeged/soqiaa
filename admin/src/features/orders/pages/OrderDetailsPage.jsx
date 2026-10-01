import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  appToast,
} from "../../../lib/toast";

import OrderDetailsHeader from "../components/OrderDetailsHeader";
import OrderCustomerCard from "../components/OrderCustomerCard";
import OrderProductsCard from "../components/OrderProductsCard";
import OrderActionsCard from "../components/OrderActionsCard";

import {
  useAdminOrder,
  useUpdateAdminOrderStatus,
} from "../hooks/useAdminOrders";

export default function OrderDetailsPage() {
  const navigate =
    useNavigate();

  const {
    orderId,
  } = useParams();

  /*
  |--------------------------------------------------------------------------
  | Order Details
  |--------------------------------------------------------------------------
  |
  | GET /admin/orders/:id
  |
  | TanStack يحتفظ بتفاصيل الطلب في الكاش
  | لمدة cacheTimes.order.
  |--------------------------------------------------------------------------
  */

  const {
    data: order,
    isPending,
    isError,
    error,
    refetch,
  } = useAdminOrder(
    orderId,
  );

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  |
  | PATCH /admin/orders/:id/status
  |
  | الـhook نفسه يحدث:
  |
  | - order details cache
  | - orders list caches
  | - dashboard invalidation
  |--------------------------------------------------------------------------
  */

  const {
    mutateAsync:
      updateOrderStatus,

    isPending:
      isUpdatingStatus,
  } =
    useUpdateAdminOrderStatus();

  async function handleChangeStatus(
    status,
  ) {
    if (
      isUpdatingStatus ||
      !order
    ) {
      return;
    }

    try {
      await updateOrderStatus({
        orderId:
          order.id,

        status,
      });

      appToast.success(
        "تم تحديث حالة الطلب بنجاح",
      );
    } catch (
      updateError
    ) {
      appToast.error(
        updateError?.message ||
          "تعذر تحديث حالة الطلب",
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error / Not Found
  |--------------------------------------------------------------------------
  */

  if (
    isError ||
    !order
  ) {
    const isNotFound =
      error?.status ===
        404 ||
      error?.response
        ?.status ===
        404 ||
      error?.code ===
        "ORDER_NOT_FOUND";

    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <h1 className="text-lg font-bold text-slate-800">
          {isNotFound
            ? "الطلب غير موجود"
            : "تعذر تحميل الطلب"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {isNotFound
            ? "قد يكون رقم الطلب غير صحيح."
            : "حدث خطأ أثناء تحميل بيانات الطلب."}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {!isNotFound && (
            <button
              type="button"
              onClick={() =>
                refetch()
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              إعادة المحاولة
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/orders",
              )
            }
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            الرجوع للطلبات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderDetailsHeader
        order={order}
        onBack={() =>
          navigate(
            "/orders",
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Customer */}
        <div className="xl:col-span-4">
          <OrderCustomerCard
            customer={
              order.customer
            }
          />
        </div>

        {/* Products */}
        <div className="xl:col-span-5">
          <OrderProductsCard
            order={order}
          />
        </div>

        {/* Actions */}
        <div className="xl:col-span-3">
          <div
            className={
              isUpdatingStatus
                ? "pointer-events-none opacity-60"
                : ""
            }
          >
            <OrderActionsCard
              status={
                order.status
              }
              onChangeStatus={
                handleChangeStatus
              }
            />
          </div>

          {isUpdatingStatus && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />

              جاري تحديث حالة الطلب...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}