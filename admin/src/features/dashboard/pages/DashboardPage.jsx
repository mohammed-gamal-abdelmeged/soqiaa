import DashboardStats from "../components/DashboardStats";
import LatestOrders from "../components/LatestOrders";
import QuickActions from "../components/QuickActions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          لوحة التحكم
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          نظرة عامة على متجر سوقيا
        </p>
      </header>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-9">
          <LatestOrders />
        </div>

        <div className="xl:col-span-3">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}