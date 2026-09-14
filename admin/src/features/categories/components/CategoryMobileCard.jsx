import {
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import CategoryStatusBadge from "./CategoryStatusBadge";

export default function CategoryMobileCard({
  category,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() =>
        navigate(`/categories/${category.slug}`)
      }
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm"
    >
      <div className="flex gap-3">
        <img
          src={category.image}
          alt={category.name}
          className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900">
                {category.name}
              </h3>
            </div>

            <CategoryStatusBadge
              isActive={category.isActive}
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">
              الترتيب:
              <span className="mr-1 font-semibold text-slate-800">
                {category.sortOrder}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(category);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600"
                aria-label={`تعديل ${category.name}`}
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(category);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600"
                aria-label={`حذف ${category.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}