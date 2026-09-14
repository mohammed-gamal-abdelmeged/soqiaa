import {
  CheckCircle2,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

const actions = [
  {
    value: "confirmed",
    label: "تأكيد الطلب",
    icon: CheckCircle2,
    className:
      "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
  },
  {
    value: "preparing",
    label: "جاري التجهيز",
    icon: PackageCheck,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    value: "out_for_delivery",
    label: "خرج للتوصيل",
    icon: Truck,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  {
    value: "delivered",
    label: "تم التوصيل",
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  {
    value: "cancelled",
    label: "إلغاء الطلب",
    icon: XCircle,
    className:
      "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  },
];

export default function OrderActionsCard({
  status,
  onChangeStatus,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-900">
        إجراءات الطلب
      </h2>

      <p className="mt-1 text-xs text-slate-400">
        اختر حالة الطلب الجديدة
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {actions.map((action) => {
          const Icon = action.icon;
          const isCurrent =
            status === action.value;

          return (
            <button
              key={action.value}
              type="button"
              disabled={isCurrent}
              onClick={() =>
                onChangeStatus(action.value)
              }
              className={[
                "flex items-center justify-between",
                "rounded-xl border px-4 py-3",
                "text-sm font-semibold transition",
                action.className,
                isCurrent
                  ? "cursor-default ring-2 ring-slate-200 opacity-60"
                  : "",
              ].join(" ")}
            >
              <span>
                {action.label}
              </span>

              <Icon size={18} />
            </button>
          );
        })}
      </div>
    </div>
  );
}