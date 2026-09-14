import {
  ArrowRight,
} from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString("ar-EG")} ج.م`;
}

export default function OrderDetailsHeader({
  order,
  onBack,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-600"
      >
        <ArrowRight size={17} />
        رجوع للطلبات
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              طلب رقم #{order.orderNumber}
            </h1>

            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            الإجمالي
          </p>

          <p className="mt-1 text-2xl font-black text-violet-700">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>
    </div>
  );
}