import { useState } from 'react'
import {
  Minus,
  Plus,
  Trash2,
} from 'lucide-react'

import { useCart } from '../context/useCart'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'

function CartItem({ item }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getFinalPrice,
  } = useCart()

  const price = getFinalPrice(item)

  const handleDelete = () => {
    removeFromCart(item.id)
    setIsDeleteOpen(false)
  }

  return (
    <>
      <div
        className="
          flex gap-4 rounded-2xl bg-white p-4
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain p-2"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex justify-between gap-3">
            <div>
              <h3 className="line-clamp-2 font-semibold text-primary">
                {item.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {item.unit}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              aria-label="حذف المنتج"
              className="
                text-red-500 transition
                hover:text-red-600
                active:scale-90
              "
            >
              <Trash2 size={19} />
            </button>
          </div>

          <div className="mt-auto flex items-end justify-between pt-3">
            <span className="font-semibold text-secondary">
              {price * item.quantity} ج.م
            </span>

            <div className="flex items-center rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => decreaseQuantity(item.id)}
                disabled={item.quantity === 1}
                aria-label="تقليل الكمية"
                className="
                  flex h-8 w-8 items-center justify-center
                  transition
                  active:scale-90
                  disabled:cursor-not-allowed
                  disabled:opacity-35
                  disabled:active:scale-100
                "
              >
                <Minus size={16} />
              </button>

              <span className="w-8 text-center font-semibold">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => increaseQuantity(item.id)}
                aria-label="زيادة الكمية"
                className="
                  flex h-8 w-8 items-center justify-center
                  transition
                  active:scale-90
                "
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="حذف المنتج"
        message={`هل تريد حذف "${item.name}" من السلة؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default CartItem