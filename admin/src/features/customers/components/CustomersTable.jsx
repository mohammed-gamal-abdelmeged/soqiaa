import {
  MapPin,
  Phone,
} from "lucide-react";

function getFirstLetter(name) {
  return String(name || "")
    .trim()
    .charAt(0);
}

export default function CustomersTable({
  customers,
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="border-b border-emerald-50 bg-emerald-50/40">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold text-slate-500">
                العميل
              </th>

              <th className="px-5 py-4 text-xs font-semibold text-slate-500">
                رقم الهاتف
              </th>

              <th className="px-5 py-4 text-xs font-semibold text-slate-500">
                العنوان
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-50">
            {customers.map(
              (customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-emerald-50/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          "flex h-10 w-10 shrink-0",
                          "items-center justify-center",
                          "rounded-full bg-emerald-600",
                          "text-sm font-bold text-white",
                        ].join(" ")}
                      >
                        {getFirstLetter(
                          customer.name,
                        )}
                      </div>

                      <span className="text-sm font-bold text-slate-800">
                        {customer.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone
                        size={15}
                        className="text-emerald-600"
                      />

                      <span dir="ltr">
                        {customer.phone}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex max-w-xl items-start gap-2 text-sm leading-6 text-slate-600">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <span>
                        {customer.address}
                      </span>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}