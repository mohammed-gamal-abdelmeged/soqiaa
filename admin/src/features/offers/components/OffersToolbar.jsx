// src/features/offers/components/OffersToolbar.jsx

import { Plus } from "lucide-react";

export default function OffersToolbar({
  status,
  onStatusChange,
  onAddOffer,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-44"
      >
        <option value="all">
          كل العروض
        </option>

        <option value="active">
          نشط
        </option>

        <option value="inactive">
          غير نشط
        </option>
      </select>

      <button
        type="button"
        onClick={onAddOffer}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
      >
        <Plus size={18} />

        إضافة عرض
      </button>
    </div>
  );
}