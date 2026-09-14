import {
  Pencil,
  Trash2,
} from "lucide-react";

import ProductBestSellerBadge from "./ProductBestSellerBadge";
import ProductDiscountBadge from "./ProductDiscountBadge";
import ProductStatusBadge from "./ProductStatusBadge";

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-right">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-xs font-semibold text-slate-500">
              <th className="px-5 py-4">
                المنتج
              </th>

              <th className="px-5 py-4">
                السعر
              </th>

              <th className="px-5 py-4">
                وحدة القياس
              </th>

              <th className="px-5 py-4">
                المخزون
              </th>

              <th className="px-5 py-4">
                الخصم
              </th>

              <th className="px-5 py-4">
                الأكثر مبيعاً
              </th>

              <th className="px-5 py-4">
                الحالة
              </th>

              <th className="px-5 py-4 text-center">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-slate-50/70"
              >
                {/* Product */}
                <td className="px-5 py-4">
                  <div className="flex min-w-[240px] items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-cover"
                    />

                    <div className="min-w-0">
                      <p className="max-w-[260px] truncate text-sm font-semibold text-slate-900">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-800">
                  {Number(
                    product.price,
                  ).toLocaleString("ar-EG")}{" "}
                  ج.م
                </td>

                {/* Unit */}
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {product.unit || "—"}
                </td>

                {/* Stock */}
                <td className="px-5 py-4">
                  <span
                    className={[
                      "text-sm font-semibold",
                      Number(product.stock) > 0
                        ? "text-slate-700"
                        : "text-red-600",
                    ].join(" ")}
                  >
                    {product.stock ?? 0}
                  </span>
                </td>

                {/* Discount */}
                <td className="px-5 py-4">
                  <ProductDiscountBadge
                    discountPercentage={
                      product.discountPercentage
                    }
                  />
                </td>

                {/* Best Seller */}
                <td className="px-5 py-4">
                  <ProductBestSellerBadge
                    isBestSeller={
                      product.isBestSeller
                    }
                  />
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <ProductStatusBadge
                    isActive={
                      product.isActive
                    }
                  />
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(product)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                      aria-label={`تعديل ${product.name}`}
                      title="تعديل"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(product)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                      aria-label={`حذف ${product.name}`}
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}