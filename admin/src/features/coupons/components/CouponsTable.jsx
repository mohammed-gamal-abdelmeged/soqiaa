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

export default function CouponsTable({
  coupons,
  onEdit,
  onDelete,
  onToggleStatus,
  isUpdating,
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-right">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-xs font-semibold text-slate-500">
              <th className="px-5 py-4">
                الكود
              </th>

              <th className="px-5 py-4">
                نوع الخصم
              </th>

              <th className="px-5 py-4">
                القيمة
              </th>

              <th className="px-5 py-4">
                الحد الأدنى
              </th>

              <th className="px-5 py-4">
                الاستخدام
              </th>

              <th className="px-5 py-4">
                الصلاحية
              </th>

              <th className="px-5 py-4">
                الحالة
              </th>

              <th className="px-5 py-4 text-center">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {coupons.map(
              (coupon) => (
                <tr
                  key={
                    coupon.id
                  }
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-lg bg-violet-50 px-3 py-1.5 font-mono text-sm font-bold text-violet-700">
                      {
                        coupon.code
                      }
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {getCouponTypeLabel(
                      coupon.discountType,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-bold text-emerald-700">
                      {formatCouponValue(
                        coupon,
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {coupon.minOrderAmount !=
                    null
                      ? `${Number(
                          coupon.minOrderAmount,
                        ).toLocaleString(
                          "ar-EG",
                        )} ج.م`
                      : "بدون"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-sm">
                      <span className="font-bold text-slate-800">
                        {
                          coupon.usedCount
                        }
                      </span>

                      <span className="text-slate-400">
                        {" "}
                        /{" "}
                        {coupon.usageLimit ??
                          "∞"}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">
                    <div>
                      من:{" "}
                      {formatCouponDate(
                        coupon.startsAt,
                      )}
                    </div>

                    <div className="mt-1">
                      إلى:{" "}
                      {formatCouponDate(
                        coupon.expiresAt,
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
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
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
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
                        title="تعديل"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                      >
                        <Pencil
                          size={16}
                        />
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
                        title="حذف"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}