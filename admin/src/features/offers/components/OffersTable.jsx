// src/features/offers/components/OffersTable.jsx

import {
  Pencil,
  Trash2,
} from "lucide-react";

import OfferStatusBadge from "./OfferStatusBadge";

export default function OffersTable({
  offers,
  products,
  onEdit,
  onDelete,
}) {
  const getProduct = (
    productId,
  ) =>
    products.find(
      (product) =>
        product.id === productId,
    );

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-right">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-xs font-semibold text-slate-500">
              <th className="px-5 py-4">
                المنتج
              </th>

              <th className="px-5 py-4">
                السعر
              </th>

              <th className="px-5 py-4">
                نسبة الخصم
              </th>

              <th className="px-5 py-4">
                السعر بعد الخصم
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
            {offers.map((offer) => {
              const product =
                getProduct(
                  offer.productId,
                );

              if (!product) {
                return null;
              }

              const discountedPrice =
                product.price *
                (1 -
                  offer.discountPercentage /
                    100);

              return (
                <tr
                  key={offer.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-[220px] items-center gap-3">
                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover"
                      />

                      <div className="min-w-0">
                        <p className="max-w-[260px] truncate text-sm font-semibold text-slate-900">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {product.unit}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                    {Number(
                      product.price,
                    ).toLocaleString(
                      "ar-EG",
                    )}{" "}
                    ج.م
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                      {
                        offer.discountPercentage
                      }
                      %
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-emerald-700">
                    {discountedPrice.toLocaleString(
                      "ar-EG",
                      {
                        maximumFractionDigits: 2,
                      },
                    )}{" "}
                    ج.م
                  </td>

                  <td className="px-5 py-4">
                    <OfferStatusBadge
                      isActive={
                        offer.isActive
                      }
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(
                            offer,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                        title="تعديل"
                      >
                        <Pencil
                          size={16}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(
                            offer,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                        title="حذف"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}