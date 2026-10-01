import DashboardStats from "../components/DashboardStats";
import LatestOrders from "../components/LatestOrders";
import QuickActions from "../components/QuickActions";

import {
  useDashboard,
} from "../hooks/useDashboard";

export default function DashboardPage() {
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useDashboard();

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-700" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          تعذر تحميل بيانات لوحة التحكم
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const stats =
    data?.stats ?? {
      products: 0,
      customers: 0,
      todayOrders: 0,
    };

  const latestOrders =
    data?.latestOrders ?? [];

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

      <DashboardStats
        stats={stats}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-9">
          <LatestOrders
            orders={latestOrders}
          />
        </div>

        <div className="xl:col-span-3">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}