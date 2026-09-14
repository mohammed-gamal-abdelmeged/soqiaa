// src/features/bestSellers/components/BestSellerStatusBadge.jsx

export default function BestSellerStatusBadge({
  isBestSeller,
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        isBestSeller
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600",
      ].join(" ")}
    >
      {isBestSeller
        ? "الأكثر مبيعاً"
        : "غير الأكثر مبيعاً"}
    </span>
  );
}