// src/features/offers/components/OfferMobileCard.jsx

import {
  Pencil,
  Trash2,
} from "lucide-react";

import OfferStatusBadge from "./OfferStatusBadge";

export default function OfferMobileCard({
  offer,
  product,
  onEdit,
  onDelete,
}) {
  if (!product) return null;

  const discountedPrice =
    product.price *
    (1 -
      offer.discountPercentage /
        100);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-sm font-bold leading-6 text-slate-900">
              {product.name}
            </h3>

            <OfferStatusBadge
              isActive={
                offer.isActive
              }
            />
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
        <div>
          <p className="text-[10px] text-slate-400">
            السعر
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {product.price} ج.م
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400">
            الخصم
          </p>

          <p className="mt-1 text-xs font-bold text-red-600">
            {
              offer.discountPercentage
            }
            %
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400">
            بعد الخصم
          </p>

          <p className="mt-1 text-xs font-bold text-emerald-700">
            {discountedPrice.toLocaleString(
              "ar-EG",
              {
                maximumFractionDigits: 2,
              },
            )}{" "}
            ج.م
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() =>
            onEdit(offer)
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          <Pencil size={15} />

          تعديل
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(offer)
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={15} />

          حذف
        </button>
      </div>
    </article>
  );
}