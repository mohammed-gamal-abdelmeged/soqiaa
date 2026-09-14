import CategoryStatusBadge from "./CategoryStatusBadge";

export default function CategoryDetailsHeader({
  category,
  details,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <img
          src={category.image}
          alt={category.name}
          className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 object-cover sm:h-20 sm:w-20"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              {category.name}
            </h1>

            <CategoryStatusBadge
              isActive={category.isActive}
            />
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {details?.banner?.subtitle ?? "تفاصيل القسم"}
          </p>

        </div>
      </div>
    </section>
  );
}