import logo from '../../../assets/images/logo.png'

function Invoice({
  orderNumber,
  items,
  customer,
  subtotal,
  deliveryFee,
  discountPercentage = 0,
  discountAmount = 0,
  appliedCoupon = null,
  getFinalPrice,
}) {
  const total =
    subtotal - discountAmount + deliveryFee

  return (
    <div
      id="invoice"
      className="
        mx-auto w-full max-w-lg
        rounded-3xl bg-white p-6
        shadow-[0_10px_40px_rgba(0,27,61,0.08)]
      "
    >
      {/* Invoice Header */}
      <div
        className="
          border-b border-dashed
          border-gray-300 pb-5 text-center
        "
      >
        <img
          src={logo}
          alt="Souqia"
          className="
            mx-auto h-20 w-20
            object-contain
          "
        />

        <h2 className="mt-2 text-2xl font-bold text-primary">
          فاتورة سوقيا
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          رقم الطلب: {orderNumber}
        </p>
      </div>

      {/* Customer Data */}
      <div
        className="
          border-b border-dashed
          border-gray-300 py-5 text-sm
        "
      >
        <h3 className="mb-3 font-bold text-primary">
          بيانات العميل
        </h3>

        <div className="space-y-2 text-text-muted">
          <p>
            الاسم: {customer.name}
          </p>

          <p>
            الموبايل: {customer.phone}
          </p>

          {customer.email && (
            <p>
              الإيميل: {customer.email}
            </p>
          )}

          <p>
            العنوان: {customer.address}
          </p>
        </div>
      </div>

      {/* Products */}
      <div
        className="
          border-b border-dashed
          border-gray-300 py-5
        "
      >
        <h3 className="mb-4 font-bold text-primary">
          تفاصيل الطلب
        </h3>

        <div className="space-y-4">
          {items.map((item) => {
            const itemPrice =
              getFinalPrice(item)

            const itemTotal =
              itemPrice * item.quantity

            return (
              <div
                key={item.id}
                className="
                  flex justify-between
                  gap-4 text-sm
                "
              >
                <div>
                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="mt-1 text-gray-500">
                    {item.quantity} ×{' '}
                    {itemPrice} ج.م
                  </p>
                </div>

                <span className="font-semibold">
                  {itemTotal} ج.م
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="space-y-3 py-5">
        <div className="flex justify-between">
          <span className="text-text-muted">
            سعر المنتجات
          </span>

          <span>
            {subtotal} ج.م
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-secondary">
            <div>
              <span>
                الخصم
              </span>

              {discountPercentage > 0 && (
                <span>
                  {' '}
                  ({discountPercentage}%)
                </span>
              )}

              {appliedCoupon && (
                <div className="mt-1 text-xs text-gray-500">
                  كود الخصم: {appliedCoupon}
                </div>
              )}
            </div>

            <span className="font-semibold">
              - {discountAmount} ج.م
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-text-muted">
            التوصيل
          </span>

          <span>
            {deliveryFee} ج.م
          </span>
        </div>

        <div
          className="
            flex justify-between
            border-t border-gray-200
            pt-4 text-xl font-bold
          "
        >
          <span>
            الإجمالي
          </span>

          <span className="text-secondary">
            {total} ج.م
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          border-t border-dashed
          border-gray-300 pt-5
          text-center
        "
      >
        <p className="font-semibold text-primary">
          شكرًا لاختياركم سوقيا 💚
        </p>

        <p className="mt-1 text-sm text-gray-500">
          سعداء بخدمتكم ونتمنى لكم تجربة تسوق ممتعة
        </p>
      </div>
    </div>
  )
}

export default Invoice