export const ORDER_STATUS_OPTIONS = [
  {
    value: "all",
    label: "الكل",
  },
  {
    value: "received",
    label: "جديد",
  },
  {
    value: "confirmed",
    label: "مؤكد",
  },
  {
    value: "preparing",
    label: "قيد التجهيز",
  },
  {
    value: "out_for_delivery",
    label: "خرج للتوصيل",
  },
  {
    value: "delivered",
    label: "تم التسليم",
  },
  {
    value: "cancelled",
    label: "ملغي",
  },
];

export const ORDER_STATUS_META = {
  received: {
    label: "جديد",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
  },

  confirmed: {
    label: "مؤكد",
    className:
      "bg-violet-50 text-violet-700 border-violet-100",
  },

  preparing: {
    label: "قيد التجهيز",
    className:
      "bg-amber-50 text-amber-700 border-amber-100",
  },

  out_for_delivery: {
    label: "خرج للتوصيل",
    className:
      "bg-blue-50 text-blue-700 border-blue-100",
  },

  delivered: {
    label: "تم التسليم",
    className:
      "bg-green-50 text-green-700 border-green-100",
  },

  cancelled: {
    label: "ملغي",
    className:
      "bg-red-50 text-red-600 border-red-100",
  },
};

export function getOrderStatusMeta(status) {
  const normalizedStatus = String(
    status || "",
  )
    .trim()
    .toLowerCase();

  return (
    ORDER_STATUS_META[normalizedStatus] ?? {
      label: "غير معروف",
      className:
        "bg-slate-50 text-slate-600 border-slate-100",
    }
  );
}