import {
  Truck,
} from "lucide-react";

function ReviewStep({
  customerData,
  preview,
}) {
  if (!preview) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted">
          تعذر تحميل مراجعة الطلب
        </p>
      </div>
    );
  }

  const {
    items = [],
    subtotal,
    discountAmount,
    total,
    couponCode,
  } = preview;

  return (
    <div className="space-y-5">
      {/* Customer Data */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-primary">
          بيانات العميل
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>
              الاسم:
            </strong>{" "}
            {
              customerData.name
            }
          </p>

          <p>
            <strong>
              الموبايل:
            </strong>{" "}
            {
              customerData.phone
            }
          </p>

          <p>
            <strong>
              العنوان:
            </strong>{" "}
            {
              customerData.address
            }
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-primary">
          المنتجات
        </h2>

        <div className="space-y-4">
          {items.map(
            (item) => (
              <div
                key={
                  item.id
                }
                className="
                  flex
                  justify-between
                  border-b
                  border-gray-100
                  pb-3
                  last:border-none
                  last:pb-0
                "
              >
                <div>
                  <p className="font-medium">
                    {
                      item.name
                    }
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {
                      item.quantity
                    }{" "}
                    ×{" "}
                    {
                      item.finalPrice
                    }{" "}
                    ج.م
                  </p>
                </div>

                <span className="font-semibold">
                  {
                    item.lineTotal
                  }{" "}
                  ج.م
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-muted">
              سعر المنتجات
            </span>

            <span>
              {subtotal} ج.م
            </span>
          </div>

          {discountAmount >
            0 && (
            <div className="flex justify-between text-secondary">
              <div>
                <span>
                  الخصم
                </span>

                {couponCode && (
                  <p className="mt-1 text-xs text-gray-500">
                    كود الخصم:{" "}
                    {
                      couponCode
                    }
                  </p>
                )}
              </div>

              <span className="font-semibold">
                -{" "}
                {
                  discountAmount
                }{" "}
                ج.م
              </span>
            </div>
          )}

          <div
            className="
              flex
              justify-between
              border-t
              border-gray-200
              pt-3
              text-lg
              font-bold
            "
          >
            <span>
              الإجمالي
            </span>

            <span className="text-secondary">
              {total} ج.م
            </span>
          </div>

          {/* Delivery Hint */}
          <div
            className="
              mt-4
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-emerald-100
              bg-emerald-50/70
              px-4
              py-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-secondary
                shadow-sm
              "
            >
              <Truck
                size={18}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-primary">
                رسوم التوصيل
              </p>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                يتم إضافة رسوم التوصيل حسب مكانك
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep;