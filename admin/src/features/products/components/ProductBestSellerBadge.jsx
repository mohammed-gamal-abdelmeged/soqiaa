// src/features/products/components/ProductBestSellerBadge.jsx

import { Star } from "lucide-react";

export default function ProductBestSellerBadge({ isBestSeller }) {
  if (!isBestSeller) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
        لا
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Star size={14} fill="currentColor" />
      نعم
    </span>
  );
}