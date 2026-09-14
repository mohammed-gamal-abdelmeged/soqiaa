import {
  MapPin,
  Phone,
} from "lucide-react";

function getFirstLetter(name) {
  return String(name || "")
    .trim()
    .charAt(0);
}

export default function CustomerMobileCard({
  customer,
}) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-11 w-11 shrink-0",
            "items-center justify-center",
            "rounded-full bg-emerald-600",
            "text-lg font-bold text-white",
          ].join(" ")}
        >
          {getFirstLetter(
            customer.name,
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-slate-900">
            {customer.name}
          </h2>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Phone
              size={13}
              className="text-emerald-600"
            />

            <span dir="ltr">
              {customer.phone}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-emerald-50 pt-4">
        <div className="flex items-start gap-2">
          <MapPin
            size={15}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <div>
            <p className="text-[11px] text-slate-400">
              العنوان
            </p>

            <p className="mt-1 text-xs leading-6 text-slate-600">
              {customer.address}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}