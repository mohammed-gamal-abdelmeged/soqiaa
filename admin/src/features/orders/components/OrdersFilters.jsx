import { ORDER_STATUS_OPTIONS } from "../utils/orderStatus";

export default function OrdersFilters({
  value,
  onChange,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div
        className={[
          "flex items-center gap-2 overflow-x-auto",
          "px-3 py-3 sm:px-4",
          "[scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {ORDER_STATUS_OPTIONS.map(
          (status) => {
            const isActive =
              value === status.value;

            return (
              <button
                key={status.value}
                type="button"
                onClick={() =>
                  onChange(status.value)
                }
                className={[
                  "shrink-0 rounded-full px-4 py-2",
                  "text-xs font-semibold transition",
                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                ].join(" ")}
              >
                {status.label}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}