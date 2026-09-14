export default function CategoryInfoPanel({
  category,
  details,
}) {
  const infoItems = [
    {
      label: "اسم القسم",
      value: category.name,
    },
    {
      label: "الترتيب",
      value: category.sortOrder,
    },
    {
      label: "الحالة",
      value: category.isActive ? "نشط" : "غير نشط",
    },
    {
      label: "عنوان البانر",
      value: details?.banner?.title ?? "—",
    },
    {
      label: "وصف البانر",
      value: details?.banner?.subtitle ?? "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
      {infoItems.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
        >
          <p className="text-xs font-medium text-slate-500">
            {item.label}
          </p>

          <p className="mt-2 break-words text-sm font-semibold text-slate-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}