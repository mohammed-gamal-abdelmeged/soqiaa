import { useState } from 'react'

import CartItem from '../../cart/components/CartItem'
import { useCart } from '../../cart/context/useCart'

import {
  showSuccess,
  showError,
} from '../../../lib/toast'

function CartStep({
  discountPercentage,
  setDiscountPercentage,
  appliedCoupon,
  setAppliedCoupon,
}) {
  const { items, subtotal } = useCart()

  const [couponCode, setCouponCode] = useState('')

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-primary">
          السلة فاضية
        </h2>

        <p className="mt-2 text-text-muted">
          ضيف منتجات الأول عشان تكمل الطلب
        </p>
      </div>
    )
  }

  const discountAmount = Math.round(
    subtotal * (discountPercentage / 100),
  )

  const totalAfterDiscount =
    subtotal - discountAmount

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase()

    if (!code) {
      showError('اكتب كود الخصم الأول')
      return
    }

    if (appliedCoupon) {
      showError('تم تطبيق كود خصم بالفعل')
      return
    }

    if (code === 'SOQIA10') {
      setDiscountPercentage(10)
      setAppliedCoupon(code)

      showSuccess('تم تطبيق كود الخصم بنجاح')
      return
    }

    showError('كود الخصم غير صحيح')
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setDiscountPercentage(0)
    setAppliedCoupon(null)

    showSuccess('تم إلغاء كود الخصم')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary">
        منتجات السلة
      </h2>

      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
        />
      ))}

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-primary">
          عندك كود خصم؟
        </h3>

        {!appliedCoupon ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(event) =>
                setCouponCode(event.target.value)
              }
              placeholder="اكتب الكود هنا"
              className="
                min-w-0 flex-1 rounded-xl
                border border-outline bg-white
                px-3 py-3 outline-none
                focus:border-secondary
                focus:ring-1 focus:ring-secondary
              "
            />

            <button
              type="button"
              onClick={handleApplyCoupon}
              className="
                rounded-xl bg-primary px-5
                font-semibold text-white
              "
            >
              تطبيق
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <div>
              <p className="font-semibold text-secondary">
                {appliedCoupon}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                خصم {discountPercentage}% مطبق
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-sm font-semibold text-red-500"
            >
              إلغاء
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-muted">
              إجمالي المنتجات
            </span>

            <span>
              {subtotal} ج.م
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-secondary">
              <span>
                الخصم ({discountPercentage}%)
              </span>

              <span>
                - {discountAmount} ج.م
              </span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="font-semibold">
                الإجمالي بعد الخصم
              </span>

              <span className="font-bold text-secondary">
                {totalAfterDiscount} ج.م
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartStep