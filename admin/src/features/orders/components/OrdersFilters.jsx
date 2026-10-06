import {
  ORDER_STATUS_OPTIONS,
} from "../utils/orderStatus";

export default function OrdersFilters({
  value,
  onChange,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div
        className={[
          "flex items-center gap-2 overflow-x-auto",
          "px-3 pt-3 pb-2 sm:px-4",

          /*
           * Scroll hint
           * رول صغير تحت الفلاتر يوضح
           * إن الشريط قابل للسحب أفقيًا.
           */
          "[scrollbar-width:thin]",
          "[scrollbar-color:#cbd5e1_transparent]",

          "[&::-webkit-scrollbar]:h-1.5",

          "[&::-webkit-scrollbar-track]:bg-transparent",

          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-slate-300",

          "[&::-webkit-scrollbar-thumb:hover]:bg-slate-400",
        ].join(" ")}
      >
        {ORDER_STATUS_OPTIONS.map(
          (status) => {
            const isActive =
              value ===
              status.value;

            return (
              <button
                key={
                  status.value
                }
                type="button"
                onClick={() =>
                  onChange(
                    status.value,
                  )
                }
                className={[
                  "shrink-0 rounded-full px-4 py-2",
                  "text-xs font-semibold transition",

                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                ].join(" ")}
              >
                {
                  status.label
                }
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}