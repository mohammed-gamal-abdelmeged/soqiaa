import {
  Eye,
  EyeOff,
  LoaderCircle,
  Pencil,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import CategoryStatusBadge from "./CategoryStatusBadge";

export default function CategoriesTable({
  categories,
  onEdit,
  onToggleStatus,
  togglingCategoryId,
}) {
  const navigate =
    useNavigate();

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-right">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4">
                الصورة
              </th>

              <th className="px-5 py-4">
                اسم القسم
              </th>

              <th className="px-5 py-4">
                الترتيب
              </th>

              <th className="px-5 py-4">
                الحالة
              </th>

              <th className="px-5 py-4 text-center">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {categories.map(
              (category) => {
                const isToggling =
                  togglingCategoryId ===
                  category.id;

                const toggleTitle =
                  category.isActive
                    ? "تعطيل القسم"
                    : "تفعيل القسم";

                return (
                  <tr
                    key={
                      category.id
                    }
                    onClick={() =>
                      navigate(
                        `/categories/${category.slug}`,
                      )
                    }
                    className="cursor-pointer transition-colors hover:bg-slate-50/70"
                  >
                    {/* Image */}
                    <td className="px-5 py-3">
                      <img
                        src={
                          category.image
                        }
                        alt={
                          category.name
                        }
                        className={[
                          "h-12 w-12 rounded-xl border",
                          "border-slate-200 object-cover",
                          !category.isActive
                            ? "opacity-50 grayscale"
                            : "",
                        ].join(" ")}
                      />
                    </td>

                    {/* Name */}
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {
                            category.name
                          }
                        </p>

                        {!category.isActive && (
                          <p className="mt-1 text-[11px] font-medium text-slate-400">
                            غير ظاهر في المتجر
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Sort Order */}
                    <td className="px-5 py-3 text-sm text-slate-700">
                      {
                        category.sortOrder
                      }
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <CategoryStatusBadge
                        isActive={
                          category.isActive
                        }
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        {/* Edit */}
                        <button
                          type="button"
                          disabled={
                            isToggling
                          }
                          onClick={(
                            event,
                          ) => {
                            event.stopPropagation();

                            onEdit(
                              category,
                            );
                          }}
                          className={[
                            "flex h-9 w-9 items-center justify-center",
                            "rounded-lg border transition",
                            "border-blue-200 text-blue-600",
                            "hover:bg-blue-50",
                            isToggling
                              ? "cursor-not-allowed opacity-40"
                              : "",
                          ].join(" ")}
                          aria-label={`تعديل ${category.name}`}
                          title="تعديل"
                        >
                          <Pencil
                            size={16}
                          />
                        </button>

                        {/* Toggle Active Status */}
                        <button
                          type="button"
                          disabled={
                            isToggling
                          }
                          onClick={(
                            event,
                          ) => {
                            event.stopPropagation();

                            onToggleStatus(
                              category,
                            );
                          }}
                          className={[
                            "flex h-9 w-9 items-center justify-center",
                            "rounded-lg border transition",

                            category.isActive
                              ? [
                                  "border-amber-200",
                                  "bg-amber-50",
                                  "text-amber-600",
                                  "hover:bg-amber-100",
                                ].join(" ")
                              : [
                                  "border-emerald-200",
                                  "bg-emerald-50",
                                  "text-emerald-600",
                                  "hover:bg-emerald-100",
                                ].join(" "),

                            isToggling
                              ? "cursor-not-allowed opacity-60"
                              : "",
                          ].join(" ")}
                          aria-label={`${toggleTitle} ${category.name}`}
                          title={
                            toggleTitle
                          }
                        >
                          {isToggling ? (
                            <LoaderCircle
                              size={16}
                              className="animate-spin"
                            />
                          ) : category.isActive ? (
                            <EyeOff
                              size={16}
                            />
                          ) : (
                            <Eye
                              size={16}
                            />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}