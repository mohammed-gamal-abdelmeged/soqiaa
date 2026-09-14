// src/features/bestSellers/components/BestSellerMobileCard.jsx

import StatusSwitch from "../../../components/ui/StatusSwitch";

import BestSellerStatusBadge from "./BestSellerStatusBadge";

export default function BestSellerMobileCard({
  product,
  onToggle,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-6 text-slate-900">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {product.unit}
          </p>

          <div className="mt-2">
            <BestSellerStatusBadge
              isBestSeller={
                product.isBestSeller
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            الأكثر مبيعاً
          </p>

          <p
            className={[
              "mt-1 text-xs font-semibold",
              product.isBestSeller
                ? "text-emerald-600"
                : "text-red-500",
            ].join(" ")}
          >
            {product.isBestSeller
              ? "مفعل"
              : "غير مفعل"}
          </p>
        </div>

        <StatusSwitch
          checked={
            product.isBestSeller
          }
          onChange={(value) =>
            onToggle(
              product,
              value,
            )
          }
          activeLabel=""
          inactiveLabel=""
        />
      </div>
    </article>
  );
}