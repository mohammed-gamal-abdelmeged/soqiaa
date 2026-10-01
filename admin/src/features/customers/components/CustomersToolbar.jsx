import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
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
  function handleClearInput() {
    onSearchChange("");
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value,
                )
              }
              placeholder="ابحث بالاسم أو رقم الهاتف أو العنوان..."
              autoComplete="off"
              className={[
                "h-12 w-full bg-transparent",
                "pr-10 pl-10",
                "text-sm text-slate-700",
                "outline-none",
                "placeholder:text-slate-400",
              ].join(" ")}
            />

            {search && (
              <button
                type="button"
                onClick={
                  handleClearInput
                }
                aria-label="مسح البحث"
                title="مسح البحث"
                className={[
                  "absolute left-2 top-1/2",
                  "-translate-y-1/2",
                  "rounded-lg p-1.5",
                  "text-slate-400",
                  "transition",
                  "hover:bg-slate-100",
                  "hover:text-slate-700",
                ].join(" ")}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            type="submit"
            aria-label="تنفيذ البحث"
            title="بحث"
            className={[
              "flex w-12 shrink-0",
              "items-center justify-center",
              "border-r border-violet-600",
              "bg-violet-600",
              "text-white transition",
              "hover:bg-violet-700",
              "focus:outline-none",
              "focus:ring-2",
              "focus:ring-violet-300",
              "focus:ring-inset",
            ].join(" ")}
          >
            <ArrowLeft
              size={19}
            />
          </button>
        </div>

        {/* Sort */}
        <div className="relative w-full sm:w-52 sm:shrink-0">
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
              "h-12 w-full appearance-none",
              "rounded-xl border",
              "border-slate-200 bg-white",
              "pr-10 pl-4",
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
        </div>
      </div>
    </div>
  );
}