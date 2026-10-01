import {
  ArrowLeft,
} from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";

function formatOrderDate(
  dateValue,
) {
  if (!dateValue) {
    return "—";
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "ar-EG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Africa/Cairo",
    },
  ).format(date);
}

function formatPrice(value) {
  const numberValue =
    Number(value);

  if (
    Number.isNaN(
      numberValue,
    )
  ) {
    return "0 ج.م";
  }

  return `${numberValue.toLocaleString(
    "ar-EG",
  )} ج.م`;
}

export default function OrderCard({
  order,
  onOpen,
}) {
  const itemsCount =
    Number(
      order.itemsCount,
    ) || 0;

  return (
    <article
      className={[
        "rounded-2xl border border-slate-200",
        "bg-white px-4 py-4 shadow-sm",
        "transition hover:border-slate-300",
        "hover:shadow-md sm:px-5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-medium text-slate-500">
          #{order.orderNumber}
        </span>

        <OrderStatusBadge
          status={order.status}
        />
      </div>

      <div className="mt-4">
        {order.customer?.name && (
          <p className="text-sm font-bold text-slate-900">
            {order.customer.name}
          </p>
        )}

        <p className="mt-1 text-xs text-slate-500">
          طلب متجر سوقيا
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
        <div>
          <p className="text-[11px] text-slate-400">
            {formatOrderDate(
              order.createdAt,
            )}
          </p>

          <p className="mt-1 text-sm font-bold text-emerald-700">
            {formatPrice(
              order.total,
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {itemsCount} منتج
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onOpen?.(order)
          }
          className={[
            "inline-flex items-center gap-1.5",
            "text-xs font-semibold text-slate-600",
            "transition hover:text-violet-600",
          ].join(" ")}
        >
          فتح

          <ArrowLeft
            size={14}
          />
        </button>
      </div>
    </article>
  );
}