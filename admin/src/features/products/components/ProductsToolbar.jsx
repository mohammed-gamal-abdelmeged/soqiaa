import {
  ArrowLeft,
  Plus,
  Search,
  X,
} from "lucide-react";

export default function ProductsToolbar({
  search,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  category,
  onCategoryChange,
  categories,
  onAddProduct,
}) {
  function handleSubmit(
    event,
  ) {
    event.preventDefault();

    onSearchSubmit();
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        {/* Search */}
        <form
          onSubmit={
            handleSubmit
          }
          className="
            flex
            min-w-0
            flex-1
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            transition
            focus-within:border-violet-400
            focus-within:ring-2
            focus-within:ring-violet-100

            sm:max-w-sm
          "
        >
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={
                search
              }
              onChange={(
                event,
              ) =>
                onSearchChange(
                  event.target
                    .value,
                )
              }
              placeholder="ابحث عن منتج..."
              autoComplete="off"
              className="
                h-11
                w-full
                bg-transparent
                pr-10
                pl-10
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-400
              "
            />

            {search && (
              <button
                type="button"
                onClick={
                  onSearchClear
                }
                aria-label="مسح البحث"
                title="مسح البحث"
                className="
                  absolute
                  left-2
                  top-1/2
                  -translate-y-1/2
                  rounded-lg
                  p-1.5
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <X
                  size={15}
                />
              </button>
            )}
          </div>

          <button
            type="submit"
            aria-label="تنفيذ البحث"
            title="بحث"
            className="
              flex
              w-12
              shrink-0
              items-center
              justify-center
              border-r
              border-violet-600
              bg-violet-600
              text-white
              transition
              hover:bg-violet-700
              focus:outline-none
              focus:ring-2
              focus:ring-violet-300
              focus:ring-inset
            "
          >
            <ArrowLeft
              size={19}
            />
          </button>
        </form>

        {/* Category Filter */}
        <select
          value={
            category
          }
          onChange={(
            event,
          ) =>
            onCategoryChange(
              event.target
                .value,
            )
          }
          className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-100

            sm:w-52
          "
        >
          <option value="all">
            جميع الأقسام
          </option>

          {categories.map(
            (item) => (
              <option
                key={
                  item.id
                }
                value={
                  item.slug
                }
              >
                {
                  item.name
                }
              </option>
            ),
          )}
        </select>
      </div>

      {/* Add Product */}
      <button
        type="button"
        onClick={
          onAddProduct
        }
        className="
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-emerald-700
          px-5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-emerald-800

          sm:w-auto
        "
      >
        <Plus
          size={18}
        />

        إضافة منتج جديد
      </button>
    </div>
  );
}