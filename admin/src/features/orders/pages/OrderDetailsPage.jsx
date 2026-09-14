import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { appToast } from "../../../lib/toast";

import OrderDetailsHeader from "../components/OrderDetailsHeader";
import OrderCustomerCard from "../components/OrderCustomerCard";
import OrderProductsCard from "../components/OrderProductsCard";
import OrderActionsCard from "../components/OrderActionsCard";

import { ordersMock } from "../data/orders.mock";

export default function OrderDetailsPage() {
  const navigate = useNavigate();

  const { orderId } = useParams();

  const [order, setOrder] =
    useState(null);

  useEffect(() => {
    const foundOrder =
      ordersMock.find(
        (item) =>
          String(item.id) ===
          String(orderId),
      );

    setOrder(
      foundOrder
        ? { ...foundOrder }
        : null,
    );
  }, [orderId]);

  function handleChangeStatus(
    status,
  ) {
    setOrder((current) => ({
      ...current,
      status,
    }));

    appToast.success(
      "تم تحديث حالة الطلب بنجاح",
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <h1 className="text-lg font-bold text-slate-800">
          الطلب غير موجود
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate("/orders")
          }
          className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          الرجوع للطلبات
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderDetailsHeader
        order={order}
        onBack={() =>
          navigate("/orders")
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <OrderCustomerCard
            customer={order.customer}
          />
        </div>

        <div className="xl:col-span-5">
          <OrderProductsCard
            order={order}
          />
        </div>

        <div className="xl:col-span-3">
          <OrderActionsCard
            status={order.status}
            onChangeStatus={
              handleChangeStatus
            }
          />
        </div>
      </div>
    </div>
  );
}