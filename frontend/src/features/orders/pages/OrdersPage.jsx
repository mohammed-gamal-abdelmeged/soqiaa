import OrderCard from "../components/OrderCard";

import {
  useOrders,
} from "../hooks/useOrders";

function OrdersPage() {
  const {
    data: orders = [],
    isPending,
    isError,
    error,
  } = useOrders();

  if (isPending) {
    return (
      <div
        className="
          flex min-h-[60vh]
          items-center justify-center
        "
      >
        <span
          className="
            h-8 w-8 animate-spin
            rounded-full border-2
            border-gray-200
            border-t-secondary
          "
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          mx-auto flex min-h-[60vh]
          w-full max-w-md
          items-center justify-center
          px-5
        "
      >
        <div className="text-center">
          <p className="font-semibold text-primary">
            تعذر تحميل الطلبات
          </p>

          <p className="mt-2 text-sm text-text-muted">
            {error?.message ||
              "حاول مرة أخرى"}
          </p>
        </div>
      </div>
    );
  }

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
          {orders.map(
            (order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ),
          )}
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
  );
}

export default OrdersPage;