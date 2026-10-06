import {
  Plus,
} from "lucide-react";

import {
  COUPON_STATUS_FILTERS,
} from "../utils/coupons";

export default function CouponsToolbar({
  status,
  onStatusChange,
  onAddCoupon,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <select
        value={
          status
        }
        onChange={(
          event,
        ) =>
          onStatusChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-44"
      >
        {COUPON_STATUS_FILTERS.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          ),
        )}
      </select>

      <button
        type="button"
        onClick={
          onAddCoupon
        }
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
      >
        <Plus
          size={18}
        />

        إضافة كوبون
      </button>
    </div>
  );
}