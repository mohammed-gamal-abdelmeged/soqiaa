import {
  Pencil,
  Trash2,
} from "lucide-react";

import ProductBestSellerBadge from "./ProductBestSellerBadge";
import ProductDiscountBadge from "./ProductDiscountBadge";
import ProductStatusBadge from "./ProductStatusBadge";

export default function ProductMobileCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      {/* Product Header */}
      <div className="flex items-start gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-sm font-bold leading-6 text-slate-900">
              {product.name}
            </h3>

            <ProductStatusBadge
              isActive={product.isActive}
            />
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {product.unit || "بدون وحدة"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3">
        <div>
          <p className="text-[11px] font-medium text-slate-400">
            السعر
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {Number(product.price).toLocaleString("ar-EG")} ج.م
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-slate-400">
            المخزون
          </p>

          <p
            className={[
              "mt-1 text-sm font-bold",
              Number(product.stock) > 0
                ? "text-slate-900"
                : "text-red-600",
            ].join(" ")}
          >
            {product.stock ?? 0}
          </p>
        </div>
      </div>

      {/* Flags */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ProductDiscountBadge
          discountPercentage={product.discountPercentage}
        />

        <ProductBestSellerBadge
          isBestSeller={product.isBestSeller}
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
          aria-label={`تعديل ${product.name}`}
          title="تعديل"
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(product)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
          aria-label={`حذف ${product.name}`}
          title="حذف"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}