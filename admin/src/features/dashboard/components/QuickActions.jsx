import { Plus, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-bold text-slate-900">
          إجراءات سريعة
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          الوصول السريع لأكثر الإجراءات استخدامًا
        </p>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <Link
          to="/products/new"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          <Plus size={18} />

          إضافة منتج
        </Link>

        <Link
          to="/offers"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Tag size={18} />

          إضافة عرض
        </Link>
      </div>
    </section>
  );
}