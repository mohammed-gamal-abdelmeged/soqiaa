import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  CUSTOMER_SORT_OPTIONS,
} from "../utils/customers";

export default function CustomersToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="ابحث بالاسم أو رقم الهاتف أو العنوان..."
            className={[
              "w-full rounded-xl border",
              "border-slate-200 bg-white",
              "py-3 pr-10 pl-4",
              "text-sm text-slate-700",
              "outline-none transition",
              "placeholder:text-slate-400",
              "focus:border-violet-400",
              "focus:ring-2",
              "focus:ring-violet-100",
            ].join(" ")}
          />
        </div>

        <div className="relative w-full sm:w-52">
          <SlidersHorizontal
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={sort}
            onChange={(event) =>
              onSortChange(
                event.target.value,
              )
            }
            className={[
              "w-full appearance-none",
              "rounded-xl border",
              "border-slate-200 bg-white",
              "py-3 pr-10 pl-4",
              "text-sm font-medium",
              "text-slate-700",
              "outline-none transition",
              "focus:border-violet-400",
              "focus:ring-2",
              "focus:ring-violet-100",
            ].join(" ")}
          >
            {CUSTOMER_SORT_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
        </div>
      </div>
    </div>
  );
}