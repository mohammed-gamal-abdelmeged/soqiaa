// src/features/products/components/ProductsToolbar.jsx

import { Plus, Search } from "lucide-react";

export default function ProductsToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  onAddProduct,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="ابحث عن منتج..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-52"
        >
          <option value="all">
            جميع الأقسام
          </option>

          {categories.map((item) => (
            <option
              key={item.id}
              value={item.slug}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add */}
      <button
        type="button"
        onClick={onAddProduct}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
      >
        <Plus size={18} />
        إضافة منتج جديد
      </button>
    </div>
  );
}