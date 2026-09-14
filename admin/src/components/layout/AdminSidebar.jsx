import {
  BadgePercent,
  Boxes,
  House,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "لوحة التحكم",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "الأقسام",
    to: "/categories",
    icon: Boxes,
  },
  {
    label: "المنتجات",
    to: "/products",
    icon: Package,
  },
  {
    label: "العروض",
    to: "/offers",
    icon: BadgePercent,
  },
  {
    label: "الأكثر مبيعاً",
    to: "/best-sellers",
    icon: TrendingUp,
  },
  {
    label: "الطلبات",
    to: "/orders",
    icon: ShoppingBag,
  },
  {
    label: "العملاء",
    to: "/customers",
    icon: Users,
  },
];

export default function AdminSidebar({
  isOpen = false,
  onClose,
  onLogout,
}) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed bottom-0 right-0 top-16 z-50
          flex w-[270px] flex-col
          border-l border-slate-800
          bg-[#071d36]
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <span className="text-sm font-semibold text-white">
              القائمة
            </span>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-slate-300 hover:bg-white/8 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={19} strokeWidth={1.8} />

              <span>الخروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}