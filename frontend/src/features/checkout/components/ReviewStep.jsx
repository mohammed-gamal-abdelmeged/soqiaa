import { useCart } from '../../cart/context/useCart'

function ReviewStep({
  customerData,
  discountPercentage = 0,
  discountAmount = 0,
  appliedCoupon = null,
}) {
  const {
    items,
    subtotal,
    getFinalPrice,
  } = useCart()

  const deliveryFee = 15

  const total =
    subtotal - discountAmount + deliveryFee

  return (
    <div className="space-y-5">
      {/* Customer Data */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-primary">
          بيانات العميل
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>الاسم:</strong>{' '}
            {customerData.name}
          </p>

          <p>
            <strong>الموبايل:</strong>{' '}
            {customerData.phone}
          </p>

          {customerData.email && (
            <p>
              <strong>الإيميل:</strong>{' '}
              {customerData.email}
            </p>
          )}

          <p>
            <strong>العنوان:</strong>{' '}
            {customerData.address}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-primary">
          المنتجات
        </h2>

        <div className="space-y-4">
          {items.map((item) => {
            const itemPrice = getFinalPrice(item)
            const itemTotal =
              itemPrice * item.quantity

            return (
              <div
                key={item.id}
                className="
                  flex justify-between
                  border-b border-gray-100
                  pb-3 last:border-none last:pb-0
                "
              >
                <div>
                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
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

          {discountAmount > 0 && (
            <div className="flex justify-between text-secondary">
              <div>
                <span>الخصم</span>

                {discountPercentage > 0 && (
                  <span>
                    {' '}
                    ({discountPercentage}%)
                  </span>
                )}

                {appliedCoupon && (
                  <span className="mr-1 text-xs">
                    - {appliedCoupon}
                  </span>
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
              pt-3 text-lg font-bold
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
      </div>
    </div>
  )
}

export default ReviewStep