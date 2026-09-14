import {
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import CategoryStatusBadge from "./CategoryStatusBadge";

export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-right">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4">الصورة</th>
              <th className="px-5 py-4">اسم القسم</th>
              <th className="px-5 py-4">الترتيب</th>
              <th className="px-5 py-4">الحالة</th>
              <th className="px-5 py-4 text-center">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr
                key={category.id}
                onClick={() =>
                  navigate(
                    `/categories/${category.slug}`,
                  )
                }
                className="cursor-pointer transition-colors hover:bg-slate-50/70"
              >
                <td className="px-5 py-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                  />
                </td>

                <td className="px-5 py-3 text-sm font-semibold text-slate-900">
                  {category.name}
                </td>

                <td className="px-5 py-3 text-sm text-slate-700">
                  {category.sortOrder}
                </td>

                <td className="px-5 py-3">
                  <CategoryStatusBadge
                    isActive={category.isActive}
                  />
                </td>

                <td className="px-5 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(category);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                      aria-label={`تعديل ${category.name}`}
                      title="تعديل"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(category);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                      aria-label={`حذف ${category.name}`}
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}