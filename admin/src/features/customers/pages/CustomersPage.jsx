import {
  useMemo,
  useState,
} from "react";

import {
  UsersRound,
} from "lucide-react";

import CustomersToolbar from "../components/CustomersToolbar";
import CustomersTable from "../components/CustomersTable";
import CustomerMobileCard from "../components/CustomerMobileCard";

import {
  ordersMock,
} from "../../orders/data/orders.mock";

import {
  createCustomersFromOrders,
  filterAndSortCustomers,
} from "../utils/customers";

export default function CustomersPage() {
  const [search, setSearch] =
    useState("");

  const [sort, setSort] =
    useState("newest");

  const customers = useMemo(() => {
    return createCustomersFromOrders(
      ordersMock,
    );
  }, []);

  const visibleCustomers =
    useMemo(() => {
      return filterAndSortCustomers({
        customers,
        search,
        sort,
      });
    }, [
      customers,
      search,
      sort,
    ]);

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UsersRound size={21} />
            </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              إدارة العملاء
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              عرض بيانات عملاء متجر
              سوقيا
            </p>
          </div>
        </div>
      </section>

      <CustomersToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              العملاء
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {search
                ? `نتائج البحث: ${visibleCustomers.length}`
                : `إجمالي العملاء: ${customers.length}`}
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {visibleCustomers.length}
          </span>
        </div>

        {visibleCustomers.length ? (
          <>
            <CustomersTable
              customers={
                visibleCustomers
              }
            />

            <div className="grid gap-3 md:hidden">
              {visibleCustomers.map(
                (customer) => (
                  <CustomerMobileCard
                    key={customer.id}
                    customer={customer}
                  />
                ),
              )}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
     `    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UsersRound size={21} />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-700">
              لا يوجد عملاء
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {search
                ? "لا يوجد عميل مطابق لعملية البحث."
                : "لا توجد بيانات عملاء مسجلة حالياً."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}