import OrderCard from "../components/OrderCard";

import {
  useOrders,
} from "../hooks/useOrders";

import OrdersPageSkeleton from "../../../components/loaders/OrdersPageSkeleton";

function OrdersPage() {
  const {
    data: orders = [],
    isPending,
    isError,
    error,
  } = useOrders();

  if (isError) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[60vh]
          w-full
          max-w-md
          items-center
          justify-center
          px-5

          md:max-w-3xl

          lg:max-w-[1180px]
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
        mx-auto
        w-full
        max-w-md
        px-5
        pb-6
        pt-5

        md:max-w-5xl
        md:px-6
        md:pb-10
        md:pt-8

        lg:max-w-[1180px]
        lg:pt-10
      "
    >
      <section
        className="
          mb-6

          md:mb-8
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            text-primary

            md:text-4xl
          "
        >
          طلباتي
        </h1>

        <p
          className="
            mt-2
            text-text-muted

            md:text-base
          "
        >
          تابع طلباتك واطلب تاني بسهولة.
        </p>
      </section>

      {isPending ? (
        <OrdersPageSkeleton />
      ) : orders.length > 0 ? (
        <section
          className="
            space-y-4

            md:grid
            md:grid-cols-2
            md:gap-5
            md:space-y-0

            lg:gap-6
          "
        >
          {orders.map(
            (order) => (
              <OrderCard
                key={
                  order.id
                }
                order={
                  order
                }
              />
            ),
          )}
        </section>
      ) : (
        <div
          className="
            py-20
            text-center

            md:py-28
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-primary

              md:text-2xl
            "
          >
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