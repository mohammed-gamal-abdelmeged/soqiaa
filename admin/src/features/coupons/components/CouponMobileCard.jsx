import {
  Pencil,
  Trash2,
} from "lucide-react";

import StatusSwitch from "../../../components/ui/StatusSwitch";

import {
  formatCouponDate,
  formatCouponValue,
  getCouponTypeLabel,
} from "../utils/coupons";

export default function CouponMobileCard({
  coupon,
  onEdit,
  onDelete,
  onToggleStatus,
  isUpdating,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-lg bg-violet-50 px-3 py-1.5 font-mono text-sm font-bold text-violet-700">
            {
              coupon.code
            }
          </span>

          <p className="mt-2 text-xs text-slate-500">
            {getCouponTypeLabel(
              coupon.discountType,
            )}
          </p>
        </div>

        <span className="text-xl font-bold text-emerald-700">
          {formatCouponValue(
            coupon,
          )}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3">
        <div>
          <p className="text-[10px] text-slate-400">
            الحد الأدنى
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {coupon.minOrderAmount !=
            null
              ? `${coupon.minOrderAmount} ج.م`
              : "بدون"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400">
            الاستخدام
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {
              coupon.usedCount
            }{" "}
            /{" "}
            {coupon.usageLimit ??
              "∞"}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400">
            يبدأ
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {formatCouponDate(
              coupon.startsAt,
            )}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400">
            ينتهي
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {formatCouponDate(
              coupon.expiresAt,
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <StatusSwitch
          checked={
            coupon.isActive
          }
          onChange={(
            value,
          ) =>
            onToggleStatus(
              coupon,
              value,
            )
          }
          activeLabel="نشط"
          inactiveLabel="متوقف"
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() =>
            onEdit(
              coupon,
            )
          }
          disabled={
            isUpdating
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
        >
          <Pencil
            size={15}
          />

          تعديل
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(
              coupon,
            )
          }
          disabled={
            isUpdating
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2
            size={15}
          />

          حذف
        </button>
      </div>
    </article>
  );
}