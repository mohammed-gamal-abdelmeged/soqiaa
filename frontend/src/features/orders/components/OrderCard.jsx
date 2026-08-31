import {
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import { useCart } from '../../cart/context/useCart'
import { showSuccess } from '../../../lib/toast'

const ORDER_STATUS = {
  received: {
    label: 'تم استلام الطلب',
    icon: Clock3,
    className: 'bg-gray-100 text-gray-600',
  },

  preparing: {
    label: 'جاري التجهيز',
    icon: Package,
    className: 'bg-blue-50 text-blue-700',
  },

  out_for_delivery: {
    label: 'خرج للتوصيل',
    icon: Truck,
    className: 'bg-amber-50 text-amber-600',
  },

  delivered: {
    label: 'تم التوصيل',
    icon: CheckCircle2,
    className: 'bg-green-50 text-secondary',
  },
}

function OrderCard({ order }) {
  const navigate = useNavigate()

  const {
    addToCart,
    clearCart,
  } = useCart()

  const status =
    ORDER_STATUS[order.status] ||
    ORDER_STATUS.received

  const StatusIcon = status.icon

  const firstProducts = order.items.slice(0, 3)
  const remainingProducts =
    Math.max(0, order.items.length - 3)

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  const handleReorder = () => {
    /*
      إحنا هنا عايزين cart جديدة من نفس الطلب.
      فبنفضي السلة الحالية الأول.
    */
    clearCart()

    order.items.forEach((item) => {
      addToCart(item, item.quantity)
    })

    

    navigate('/cart')
  }

  const handleDetails = () => {
    navigate(`/orders/${order.id}`)
  }

  return (
    <article
      className="
        rounded-2xl border border-gray-100
        bg-white p-4
        shadow-[0_4px_20px_rgba(0,27,61,0.05)]
      "
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-primary">
            طلب رقم #{order.orderNumber}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div
          className={`
            flex shrink-0 items-center gap-1
            rounded-full px-3 py-1
            text-xs font-semibold
            ${status.className}
          `}
        >
          <StatusIcon size={15} />

          {status.label}
        </div>
      </div>

      {/* First 3 Products */}
      <div className="mt-5 flex gap-3 overflow-hidden rounded-xl bg-gray-50 p-3">
        {firstProducts.map((item) => (
          <div
            key={item.id}
            className="
              flex min-w-16 flex-col
              items-center gap-1
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                overflow-hidden rounded-xl bg-white
              "
            >
              <img
                src={item.image}
                alt={item.name}
                className="
                  h-full w-full
                  object-contain p-1
                "
              />
            </div>

            <span
              className="
                max-w-16 truncate
                text-xs text-gray-600
              "
            >
              {item.name}
            </span>
          </div>
        ))}

        {remainingProducts > 0 && (
          <div
            className="
              flex h-14 min-w-14
              items-center justify-center
              self-start rounded-xl
              bg-gray-200
              font-semibold text-gray-600
            "
          >
            +{remainingProducts}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div
        className="
          mt-5 flex items-end justify-between
          border-t border-gray-100 pt-4
        "
      >
        <div>
          <p className="text-xs text-gray-500">
            الإجمالي 
          </p>

          <p className="mt-1 text-xl font-bold text-primary">
            {order.total} جنيه
          </p>
        </div>

        {order.status === 'delivered' ? (
          <button
            type="button"
            onClick={handleReorder}
            className="
              flex items-center gap-2
              rounded-xl bg-secondary
              px-4 py-3
              font-semibold text-white
              transition
              active:scale-[0.98]
            "
          >
            <ShoppingBag size={18} />

            اطلبه تاني
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDetails}
            className="
              rounded-xl border border-primary
              px-4 py-3
              font-semibold text-primary
              transition
              active:scale-[0.98]
            "
          >
            تفاصيل الطلب
          </button>
        )}
      </div>
    </article>
  )
}

export default OrderCard