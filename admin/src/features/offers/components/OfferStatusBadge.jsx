// src/features/offers/components/OfferStatusBadge.jsx

export default function OfferStatusBadge({
  isActive,
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600",
      ].join(" ")}
    >
      {isActive ? "نشط" : "غير نشط"}
    </span>
  );
}