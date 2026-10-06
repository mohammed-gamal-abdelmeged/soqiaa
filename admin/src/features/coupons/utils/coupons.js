export const COUPON_STATUS_FILTERS = [
  {
    value: "all",
    label: "كل الكوبونات",
  },
  {
    value: "active",
    label: "نشط",
  },
  {
    value: "inactive",
    label: "متوقف",
  },
];

export function filterCouponsByStatus(
  coupons,
  status,
) {
  if (
    status ===
    "active"
  ) {
    return coupons.filter(
      (coupon) =>
        coupon.isActive,
    );
  }

  if (
    status ===
    "inactive"
  ) {
    return coupons.filter(
      (coupon) =>
        !coupon.isActive,
    );
  }

  return coupons;
}

export function formatCouponValue(
  coupon,
) {
  if (
    coupon.discountType ===
    "PERCENTAGE"
  ) {
    return `${coupon.value}%`;
  }

  return `${Number(
    coupon.value,
  ).toLocaleString(
    "ar-EG",
  )} ج.م`;
}

export function getCouponTypeLabel(
  discountType,
) {
  return discountType ===
    "PERCENTAGE"
    ? "نسبة مئوية"
    : "مبلغ ثابت";
}

export function formatCouponDate(
  value,
) {
  if (!value) {
    return "بدون";
  }

  return new Intl.DateTimeFormat(
    "ar-EG",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(
    new Date(value),
  );
}