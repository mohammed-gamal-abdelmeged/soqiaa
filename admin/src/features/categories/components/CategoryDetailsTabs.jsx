const tabs = [
  {
    id: "details",
    label: "تفاصيل القسم",
  },
  {
    id: "subcategories",
    label: "الأقسام الفرعية",
  },
  {
    id: "products",
    label: "المنتجات",
  },
];

export default function CategoryDetailsTabs({
  activeTab,
  onChange,
  subcategoriesCount,
  productsCount,
}) {
  return (
    <div className="overflow-x-auto border-b border-slate-200">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab) => {
          let label = tab.label;

          if (tab.id === "subcategories") {
            label += ` (${subcategoriesCount})`;
          }

          if (tab.id === "products") {
            label += ` (${productsCount})`;
          }

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "relative px-4 py-4 text-sm font-semibold transition-colors",
                isActive
                  ? "text-emerald-700"
                  : "text-slate-500 hover:text-slate-900",
              ].join(" ")}
            >
              {label}

              {isActive && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}