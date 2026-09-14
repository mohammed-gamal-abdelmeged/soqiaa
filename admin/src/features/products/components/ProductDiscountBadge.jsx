// src/features/products/components/ProductDiscountBadge.jsx

import { BadgePercent } from "lucide-react";

export default function ProductDiscountBadge({
  discountPercentage,
}) {
  if (!discountPercentage || discountPercentage <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
        بدون خصم
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
      <BadgePercent size={14} />
      خصم {discountPercentage}%
    </span>
  );
}