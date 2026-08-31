import { useMemo } from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Home,
  MapPin,
  Package,
  Truck,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { ordersMock } from '../data/orders.mock'

const ORDER_STEPS = [
  {
    key: 'received',
    label: 'تم استلام الطلب',
    description: 'تم استلام طلبك بنجاح',
    icon: Clock3,
  },
  {
    key: 'preparing',
    label: 'جاري تجهيز الطلب',
    description: 'يتم الآن تحضير منتجاتك بعناية',
    icon: Package,
  },
  {
    key: 'out_for_delivery',
    label: 'خرج للتوصيل',
    description: 'طلبك في الطريق إليك',
    icon: Truck,
  },
  {
    key: 'delivered',
    label: 'تم التوصيل',
    description: 'تم توصيل الطلب بنجاح',
    icon: Home,
  },
]

const STATUS_LABELS = {
  received: 'تم استلام الطلب',
  preparing: 'جاري التجهيز',
  out_for_delivery: 'خرج للتوصيل',
  delivered: 'تم التوصيل',
}

function OrderDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const order = useMemo(() => {
    return ordersMock.find(
      (item) => String(item.id) === String(id),
    )
  }, [id])

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <p className="text-text-muted">
          الطلب غير موجود
        </p>
      </div>
    )
  }

  /*
    حماية إضافية:
    الطلب اللي تم توصيله المفروض أصلًا
    المستخدم ميدخلش تفاصيله من OrderCard.

    ولو دخل الرابط يدويًا، نرجعه لطلباتي.
  */
  if (order.status === 'delivered') {
    navigate('/orders', { replace: true })

    return null
  }

  const currentStepIndex = ORDER_STEPS.findIndex(
    (step) => step.key === order.status,
  )

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date))
  }

const subtotal =
  order.subtotal ??
  order.items.reduce((total, item) => {
    const itemPrice = item.discountPercentage
      ? Math.round(
          item.price -
            item.price *
              (item.discountPercentage / 100),
        )
      : item.price

    return total + itemPrice * item.quantity
  }, 0)

const deliveryFee =
  order.deliveryFee ?? 15

const discountAmount =
  order.discountAmount ?? 0

const total =
  subtotal - discountAmount + deliveryFee

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-8">
      {/* Header */}
      <header
        className="
          sticky top-0 z-50
          flex h-16 items-center
          bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="رجوع"
          className="
            flex h-10 w-10 items-center justify-center
            transition active:scale-90
          "
        >
          <ArrowRight size={25} />
        </button>

        <h1 className="flex-1 text-center text-xl font-bold text-primary">
          تفاصيل الطلب
        </h1>

        <div className="h-10 w-10" />
      </header>

      <main
        className="
          mx-auto flex w-full max-w-md
          flex-col gap-5 px-5 py-5
        "
      >
        {/* Order Summary */}
        <section
          className="
            rounded-3xl border border-gray-100
            bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-primary">
                رقم الطلب #{order.orderNumber}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div
              className="
                shrink-0 rounded-full
                bg-green-50 px-3 py-1
                text-xs font-semibold
                text-secondary
              "
            >
              {STATUS_LABELS[order.status]}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section
          className="
            rounded-3xl border border-gray-100
            bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <h3 className="mb-6 text-lg font-bold text-primary">
            حالة الطلب
          </h3>

          <div className="relative">
            {/* Background line */}
            <div
              className="
                absolute bottom-4 right-[15px] top-4
                w-[2px] bg-gray-200
              "
            />

            {/* Active line */}
            <div
              className="
                absolute right-[15px] top-4
                w-[2px] bg-secondary
                transition-all duration-500
              "
              style={{
                height:
                  currentStepIndex <= 0
                    ? '0%'
                    : `${
                        (currentStepIndex /
                          (ORDER_STEPS.length - 1)) *
                        100
                      }%`,
              }}
            />

            <div className="space-y-6">
              {ORDER_STEPS.map((step, index) => {
                const StepIcon = step.icon

                const completed =
                  index < currentStepIndex

                const active =
                  index === currentStepIndex

                const pending =
                  index > currentStepIndex

                return (
                  <div
                    key={step.key}
                    className="
                      relative z-10 flex
                      items-start gap-4
                    "
                  >
                    <div
                      className={`
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-full
                        border-4 border-white
                        ${
                          completed
                            ? 'bg-secondary text-white'
                            : active
                              ? 'border-2 border-secondary bg-white text-secondary'
                              : 'bg-gray-200 text-gray-500'
                        }
                      `}
                    >
                      {completed ? (
                        <Check size={15} />
                      ) : active ? (
                        <div className="h-3 w-3 rounded-full bg-secondary" />
                      ) : (
                        <StepIcon size={15} />
                      )}
                    </div>

                    <div
                      className={`
                        pt-1
                        ${pending ? 'opacity-45' : ''}
                      `}
                    >
                      <p
                        className={`
                          text-sm font-semibold
                          ${
                            completed
                              ? 'text-secondary'
                              : 'text-primary'
                          }
                        `}
                      >
                        {step.label}
                      </p>

                      {active && (
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Delivery Info */}
        <section
          className="
            flex items-start gap-3
            rounded-3xl border border-gray-100
            bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full bg-gray-100
              text-primary
            "
          >
            <MapPin size={20} />
          </div>

          <div>
            <h3 className="text-sm text-gray-500">
              عنوان التوصيل
            </h3>

            <p className="mt-1 font-medium text-primary">
              {order.customer?.address ||
                'لم يتم تحديد العنوان'}
            </p>

            {order.customer?.phone && (
              <p
                dir="ltr"
                className="mt-1 text-right text-sm text-gray-500"
              >
                {order.customer.phone}
              </p>
            )}
          </div>
        </section>

        {/* Products */}
        <section
          className="
            rounded-3xl border border-gray-100
            bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <h3 className="mb-4 text-lg font-bold text-primary">
            المنتجات ({order.items.length})
          </h3>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => {
              const price = item.discountPercentage
                ? Math.round(
                    item.price -
                      item.price *
                        (item.discountPercentage /
                          100),
                  )
                : item.price

              return (
                <div
                  key={item.id}
                  className="
                    flex items-center gap-4
                    py-4 first:pt-0 last:pb-0
                  "
                >
                  <div
                    className="
                      flex h-16 w-16 shrink-0
                      items-center justify-center
                      overflow-hidden rounded-xl
                      border border-gray-100
                      bg-gray-50
                    "
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        h-full w-full
                        object-contain p-2
                      "
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 text-sm font-medium text-primary">
                      {item.name}
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.unit}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      الكمية: {item.quantity}
                    </p>
                  </div>

                  <div className="shrink-0 text-sm font-bold text-primary">
                    {price * item.quantity} ج.م
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Price Breakdown */}
        <section
          className="
            rounded-3xl border border-gray-100
            bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-muted">
                سعر المنتجات
              </span>

              <span>
                {subtotal} ج.م
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-muted">
                التوصيل
              </span>

              <span>
                {deliveryFee} ج.م
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-secondary">
                <div>
                  <span>الخصم</span>

                  {order.discountPercentage >
                    0 && (
                    <span>
                      {' '}
                      (
                      {
                        order.discountPercentage
                      }
                      %)
                    </span>
                  )}

                  {order.appliedCoupon && (
                    <p className="mt-1 text-xs text-gray-500">
                      كود: {order.appliedCoupon}
                    </p>
                  )}
                </div>

                <span className="font-semibold">
                  - {discountAmount} ج.م
                </span>
              </div>
            )}

            <div
              className="
                flex justify-between
                border-t border-gray-200
                pt-4 text-lg font-bold
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
        </section>
      </main>
    </div>
  )
}

export default OrderDetailsPage