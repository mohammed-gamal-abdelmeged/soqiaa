import {
  ArrowLeft,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import StatusBadge from "../../../components/ui/StatusBadge";

function formatOrderDate(
  value,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "ar-EG",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Cairo",
    },
  ).format(date);
}

function OrderMobileCard({
  order,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-500">
          {order.orderNumber}
        </span>

        <StatusBadge
          status={order.status}
        />
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-bold text-slate-900">
          {order.customer}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          طلب متجر سوقيا
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-xs text-slate-400">
            {formatOrderDate(
              order.createdAt,
            )}
          </p>

          <p className="mt-1 text-sm font-bold text-emerald-700">
            {Number(
              order.total,
            ).toLocaleString(
              "ar-EG",
            )}{" "}
            ج.م
          </p>
        </div>

        <Link
          to={`/orders/${order.id}`}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-emerald-700"
        >
          فتح
          <ArrowLeft
            size={14}
          />
        </Link>
      </div>
    </article>
  );
}

export default function LatestOrders({
  orders = [],
}) {
  const latestOrders =
    orders.slice(0, 5);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            آخر الطلبات
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            أحدث 5 طلبات في المتجر
          </p>
        </div>
      </div>

      {latestOrders.length ===
      0 ? (
        <div className="px-5 py-12 text-center text-sm text-slate-500">
          لا توجد طلبات حتى الآن
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="space-y-3 bg-slate-50/50 p-3 sm:hidden">
            {latestOrders.map(
              (order) => (
                <OrderMobileCard
                  key={
                    order.id
                  }
                  order={
                    order
                  }
                />
              ),
            )}
          </div>

          {/* Tablet + Desktop */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[680px] text-right">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold text-slate-500">
                  <th className="px-5 py-3">
                    رقم الطلب
                  </th>

                  <th className="px-5 py-3">
                    العميل
                  </th>

                  <th className="px-5 py-3">
                    المبلغ
                  </th>

                  <th className="px-5 py-3">
                    الحالة
                  </th>

                  <th className="px-5 py-3">
                    التاريخ
                  </th>

                  <th className="px-5 py-3">
                    التفاصيل
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {latestOrders.map(
                  (order) => (
                    <tr
                      key={
                        order.id
                      }
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900">
                        {
                          order.orderNumber
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                        {
                          order.customer
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">
                        {Number(
                          order.total,
                        ).toLocaleString(
                          "ar-EG",
                        )}{" "}
                        ج.م
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <StatusBadge
                          status={
                            order.status
                          }
                        />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {formatOrderDate(
                          order.createdAt,
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                        >
                          فتح
                          <ArrowLeft
                            size={
                              14
                            }
                          />
                        </Link>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}