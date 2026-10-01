import {
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import StatCard from "../../../components/ui/StatCard";

const dashboardStatsConfig = [
  {
    id: "products",
    label: "المنتجات",
    icon: Package,
    getValue: (stats) =>
      stats.products,
  },
  {
    id: "customers",
    label: "العملاء",
    icon: Users,
    getValue: (stats) =>
      stats.customers,
  },
  {
    id: "today-orders",
    label: "طلبات اليوم",
    icon: ShoppingBag,
    getValue: (stats) =>
      stats.todayOrders,
  },
];

const iconStyles = {
  products:
    "bg-emerald-50 text-emerald-700",

  customers:
    "bg-blue-50 text-blue-700",

  "today-orders":
    "bg-amber-50 text-amber-700",
};

export default function DashboardStats({
  stats,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {dashboardStatsConfig.map(
        (stat) => {
          const Icon =
            stat.icon;

          return (
            <StatCard
              key={stat.id}
              title={
                stat.label
              }
              value={
                stat.getValue(
                  stats,
                )
              }
              icon={Icon}
              iconClassName={
                iconStyles[
                  stat.id
                ]
              }
            />
          );
        },
      )}
    </div>
  );
}