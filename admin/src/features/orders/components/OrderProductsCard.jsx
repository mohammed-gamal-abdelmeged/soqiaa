function getDiscountedPrice(item) {
  const price = Number(item.price || 0);
  const discount = Number(
    item.discountPercentage || 0,
  );

  return price - (price * discount) / 100;
}

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString(
    "ar-EG",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  )} ج.م`;
}

export default function OrderProductsCard({
  order,
}) {
  const items = order.items ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            المنتجات المطلوبة
          </h2>

          <span className="text-xs text-slate-400">
            {items.length} منتج
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const unitPrice =
            getDiscountedPrice(item);

          const total =
            unitPrice *
            Number(item.quantity || 0);

          return (
            <div
              key={item.id}
              className="flex gap-4 p-4 sm:p-5"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 object-cover sm:h-24 sm:w-24"
              />

              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {item.unit}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] text-slate-400">
                      الكمية
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {item.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      سعر الوحدة
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatPrice(unitPrice)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      الإجمالي
                    </p>

                    <p className="mt-1 text-sm font-bold text-violet-700">
                      {formatPrice(total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 bg-slate-50 px-5 py-4">
        {order.subtotal !== undefined && (
          <div className="flex justify-between text-sm text-slate-500">
            <span>المجموع الفرعي</span>
            <span>
              {formatPrice(order.subtotal)}
            </span>
          </div>
        )}

        {order.discountAmount !== undefined &&
          Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>الخصم</span>
              <span>
                -{" "}
                {formatPrice(
                  order.discountAmount,
                )}
              </span>
            </div>
          )}

        {order.deliveryFee !== undefined && (
          <div className="flex justify-between text-sm text-slate-500">
            <span>التوصيل</span>
            <span>
              {formatPrice(
                order.deliveryFee,
              )}
            </span>
          </div>
        )}

        <div className="flex justify-between border-t border-slate-200 pt-3">
          <span className="font-bold text-slate-900">
            الإجمالي
          </span>

          <span className="text-lg font-black text-violet-700">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}