export default function CategoryProductsPanel({
  products,
}) {
  if (!products.length) {
    return (
      <div className="px-5 py-14 text-center">
        <p className="text-sm font-semibold text-slate-700">
          لا توجد منتجات في هذا القسم
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="flex min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-emerald-200 hover:shadow-sm"
        >
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
              {product.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {product.unit}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-emerald-700">
                {product.price.toLocaleString("ar-EG")} ج.م
              </span>

              {product.discountPercentage > 0 && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                  خصم {product.discountPercentage}%
                </span>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}