import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Download,
  Trash2,
} from "lucide-react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import { appToast } from "../../../lib/toast";

import OrderCard from "../components/OrderCard";
import OrdersFilters from "../components/OrdersFilters";

import { ordersMock } from "../data/orders.mock";

import { exportOrdersToExcel } from "../utils/exportOrders";

export default function OrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(
    () => [...ordersMock],
  );

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("all");

  const [
    deleteAllStep,
    setDeleteAllStep,
  ] = useState(0);

  const [
    deleteOrderModal,
    setDeleteOrderModal,
  ] = useState({
    isOpen: false,
    order: null,
  });

  const visibleOrders = useMemo(() => {
    const sortedOrders = [
      ...orders,
    ].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt),
    );

    if (selectedStatus === "all") {
      return sortedOrders.slice(
        0,
        20,
      );
    }

    return sortedOrders.filter(
      (order) =>
        order.status ===
        selectedStatus,
    );
  }, [
    orders,
    selectedStatus,
  ]);

  function handleExport() {
    if (!orders.length) {
      appToast.error(
        "لا توجد طلبات للتصدير",
      );

      return;
    }

    const exported =
      exportOrdersToExcel(orders);

    if (exported) {
      appToast.success(
        "تم تصدير الطلبات بنجاح",
      );
    }
  }

  function handleOpenDeleteAll() {
    if (!orders.length) {
      appToast.error(
        "لا توجد طلبات للحذف",
      );

      return;
    }

    setDeleteAllStep(1);
  }

  function handleFirstDeleteAllConfirm() {
    setDeleteAllStep(0);

    setTimeout(() => {
      setDeleteAllStep(2);
    }, 100);
  }

  function handleDeleteAll() {
    setOrders([]);
    setDeleteAllStep(0);
    setSelectedStatus("all");

    appToast.success(
      "تم حذف جميع الطلبات",
    );
  }

  function handleCloseDeleteAllDialog() {
    setDeleteAllStep(0);
  }

  function handleOpenDeleteOrder(order) {
    setDeleteOrderModal({
      isOpen: true,
      order,
    });
  }

  function handleCloseDeleteOrder() {
    setDeleteOrderModal({
      isOpen: false,
      order: null,
    });
  }

  function handleConfirmDeleteOrder() {
    const order =
      deleteOrderModal.order;

    if (!order) return;

    setOrders((current) =>
      current.filter(
        (item) =>
          String(item.id) !==
          String(order.id),
      ),
    );

    appToast.success(
      `تم حذف الطلب #${order.orderNumber}`,
    );

    handleCloseDeleteOrder();
  }

  function handleOpenOrder(order) {
    navigate(
      `/orders/${order.id}`,
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            إدارة الطلبات
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            متابعة وإدارة جميع طلبات
            متجر سوقيا
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={handleExport}
            disabled={
              orders.length === 0
            }
            className={[
              "inline-flex items-center justify-center",
              "gap-2 rounded-xl border px-4 py-2.5",
              "text-sm font-semibold transition",
              orders.length
                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300",
            ].join(" ")}
          >
            <Download size={17} />

            تصدير
          </button>

          <button
            type="button"
            onClick={
              handleOpenDeleteAll
            }
            disabled={
              orders.length === 0
            }
            className={[
              "inline-flex items-center justify-center",
              "gap-2 rounded-xl border px-4 py-2.5",
              "text-sm font-semibold transition",
              orders.length
                ? "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300",
            ].join(" ")}
          >
            <Trash2 size={17} />

            حذف الكل
          </button>
        </div>
      </section>

      <OrdersFilters
        value={selectedStatus}
        onChange={
          setSelectedStatus
        }
      />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {selectedStatus === "all"
                ? "آخر الطلبات"
                : "الطلبات"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {selectedStatus === "all"
                ? "يتم عرض آخر 20 طلب"
                : `عدد الطلبات: ${visibleOrders.length}`}
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {visibleOrders.length}
          </span>
        </div>

        {visibleOrders.length ? (
          <div
            className={[
              "grid grid-cols-1 gap-3",
              "lg:grid-cols-2",
              "2xl:grid-cols-3",
            ].join(" ")}
          >
            {visibleOrders.map(
              (order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onOpen={
                    handleOpenOrder
                  }
                  onDelete={
                    handleOpenDeleteOrder
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div
            className={[
              "rounded-2xl border",
              "border-dashed border-slate-200",
              "bg-white px-6 py-16",
              "text-center",
            ].join(" ")}
          >
            <h3 className="text-base font-bold text-slate-700">
              لا توجد طلبات
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              لا توجد طلبات مطابقة
              للحالة المحددة حالياً.
            </p>
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={
          deleteOrderModal.isOpen
        }
        onClose={
          handleCloseDeleteOrder
        }
        onConfirm={
          handleConfirmDeleteOrder
        }
        title="حذف الطلب"
        message={
          deleteOrderModal.order
            ? `هل تريد حذف الطلب #${deleteOrderModal.order.orderNumber}؟`
            : ""
        }
        confirmText="حذف الطلب"
        cancelText="إلغاء"
      />

      <ConfirmDialog
        isOpen={
          deleteAllStep === 1
        }
        onClose={
          handleCloseDeleteAllDialog
        }
        onConfirm={
          handleFirstDeleteAllConfirm
        }
        title="حذف جميع الطلبات"
        message="هل تريد حذف جميع الطلبات؟"
        confirmText="متابعة"
        cancelText="إلغاء"
      />

      <ConfirmDialog
        isOpen={
          deleteAllStep === 2
        }
        onClose={
          handleCloseDeleteAllDialog
        }
        onConfirm={
          handleDeleteAll
        }
        title="تأكيد حذف جميع الطلبات"
        message="هل أنت متأكد من حذف جميع الطلبات؟ لا يمكن التراجع عن هذه العملية."
        confirmText="حذف جميع الطلبات"
        cancelText="إلغاء"
      />
    </div>
  );
}