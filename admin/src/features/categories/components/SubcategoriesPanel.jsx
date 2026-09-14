import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

export default function SubcategoriesPanel({
  subcategories,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            الأقسام الفرعية
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {subcategories.length} قسم فرعي
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="hidden items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:flex"
        >
          <Plus size={17} />
          إضافة قسم فرعي
        </button>
      </div>

      {subcategories.length > 0 ? (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[1fr_130px_180px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500">
              <span>اسم القسم الفرعي</span>
              <span className="text-center">
                الترتيب
              </span>
              <span className="text-center">
                الإجراءات
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {subcategories.map(
                (subcategory, index) => (
                  <div
                    key={subcategory.id}
                    className="grid grid-cols-[1fr_130px_180px] items-center px-5 py-4 transition hover:bg-slate-50/70"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {subcategory.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        رقم القسم:{" "}
                        {subcategory.id}
                      </p>
                    </div>

                    <span className="text-center text-sm text-slate-500">
                      {index + 1}
                    </span>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(subcategory)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                        aria-label={`تعديل ${subcategory.name}`}
                        title="تعديل"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(subcategory)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                        aria-label={`حذف ${subcategory.name}`}
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {subcategories.map(
              (subcategory, index) => (
                <article
                  key={subcategory.id}
                  className="px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-slate-900">
                        {subcategory.name}
                      </h4>

                      <p className="mt-1 text-xs text-slate-400">
                        رقم القسم:{" "}
                        {subcategory.id}
                        {" • "}
                        الترتيب الظاهر:{" "}
                        {index + 1}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(subcategory)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600 transition active:bg-blue-50"
                        aria-label={`تعديل ${subcategory.name}`}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(subcategory)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition active:bg-red-50"
                        aria-label={`حذف ${subcategory.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </>
      ) : (
        <div className="px-5 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">
            لا توجد أقسام فرعية
          </p>

          <p className="mt-1 text-xs text-slate-500">
            يمكنك إضافة أول قسم فرعي لهذا
            القسم
          </p>
        </div>
      )}

      <div className="border-t border-slate-100 p-4 sm:hidden">
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition active:bg-emerald-800"
        >
          <Plus size={18} />
          إضافة قسم فرعي
        </button>
      </div>
    </div>
  );
}