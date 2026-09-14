import {
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import StatCard from "../../../components/ui/StatCard";
import { dashboardStats } from "../data/dashboard.mock";

const iconMap = {
  package: Package,
  users: Users,
  shoppingBag: ShoppingBag,
};

const iconStyles = {
  products: "bg-emerald-50 text-emerald-700",
  customers: "bg-blue-50 text-blue-700",
  "today-orders": "bg-amber-50 text-amber-700",
};

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {dashboardStats.map((stat) => {
        const Icon = iconMap[stat.icon];

        return (
          <StatCard
            key={stat.id}
            title={stat.label}
            value={stat.value}
            icon={Icon}
            iconClassName={iconStyles[stat.id]}
          />
        );
      })}
    </div>
  );
}