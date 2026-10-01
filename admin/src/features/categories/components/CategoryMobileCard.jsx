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

export default function CategoryMobileCard({
  category,
  onEdit,
  onToggleStatus,
  togglingCategoryId,
}) {
  const navigate =
    useNavigate();

  const isToggling =
    togglingCategoryId ===
    category.id;

  const toggleTitle =
    category.isActive
      ? "تعطيل القسم"
      : "تفعيل القسم";

  return (
    <article
      onClick={() =>
        navigate(
          `/categories/${category.slug}`,
        )
      }
      className={[
        "cursor-pointer rounded-2xl border bg-white p-4",
        "transition hover:border-emerald-200 hover:shadow-sm",

        category.isActive
          ? "border-slate-200"
          : "border-slate-200 bg-slate-50/50",
      ].join(" ")}
    >
      <div className="flex gap-3">
        <img
          src={
            category.image
          }
          alt={
            category.name
          }
          className={[
            "h-16 w-16 shrink-0 rounded-xl",
            "border border-slate-200 object-cover",

            !category.isActive
              ? "opacity-50 grayscale"
              : "",
          ].join(" ")}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900">
                {
                  category.name
                }
              </h3>

              {!category.isActive && (
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  غير ظاهر في المتجر
                </p>
              )}
            </div>

            <CategoryStatusBadge
              isActive={
                category.isActive
              }
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">
              الترتيب:
              <span className="mr-1 font-semibold text-slate-800">
                {
                  category.sortOrder
                }
              </span>
            </p>

            <div className="flex items-center gap-2">
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
                  "rounded-lg border border-blue-200",
                  "text-blue-600 transition",
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
          </div>
        </div>
      </div>
    </article>
  );
}