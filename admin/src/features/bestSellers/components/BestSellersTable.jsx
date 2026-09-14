// src/features/bestSellers/components/BestSellersTable.jsx

import StatusSwitch from "../../../components/ui/StatusSwitch";

import BestSellerStatusBadge from "./BestSellerStatusBadge";

export default function BestSellersTable({
  products,
  onToggle,
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
      <table className="w-full text-right">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr className="text-xs font-semibold text-slate-500">
            <th className="px-5 py-4">
              المنتج
            </th>

            <th className="px-5 py-4">
              وحدة القياس
            </th>

            <th className="px-5 py-4">
              الحالة
            </th>

            <th className="px-5 py-4 text-center">
              الأكثر مبيعاً
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map(
            (product) => (
              <tr
                key={product.id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover"
                    />

                    <p className="text-sm font-semibold text-slate-900">
                      {product.name}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {product.unit ||
                    "—"}
                </td>

                <td className="px-5 py-4">
                  <BestSellerStatusBadge
                    isBestSeller={
                      product.isBestSeller
                    }
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center">
                    <StatusSwitch
                      checked={
                        product.isBestSeller
                      }
                      onChange={(
                        value,
                      ) =>
                        onToggle(
                          product,
                          value,
                        )
                      }
                      activeLabel=""
                      inactiveLabel=""
                    />
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}