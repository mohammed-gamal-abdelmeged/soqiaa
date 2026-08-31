import OrderCard from '../components/OrderCard'
import { ordersMock } from '../data/orders.mock'

function OrdersPage() {
  const orders = [...ordersMock].sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt),
  )

  return (
    <div
      className="
        mx-auto w-full max-w-md
        px-5 pb-6 pt-5
      "
    >
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          طلباتي
        </h1>

        <p className="mt-2 text-text-muted">
          تابع طلباتك واطلب تاني بسهولة.
        </p>
      </section>

      {orders.length > 0 ? (
        <section className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </section>
      ) : (
        <div className="py-20 text-center">
          <h2 className="text-xl font-bold text-primary">
            مفيش طلبات لسه
          </h2>

          <p className="mt-2 text-text-muted">
            أول ما تعمل طلب هيظهر هنا.
          </p>
        </div>
      )}
    </div>
  )
}

export default OrdersPage