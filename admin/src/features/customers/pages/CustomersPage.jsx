import {
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  UsersRound,
} from "lucide-react";

import CustomersToolbar from "../components/CustomersToolbar";
import CustomersTable from "../components/CustomersTable";
import CustomerMobileCard from "../components/CustomerMobileCard";

import {
  useAdminCustomers,
} from "../hooks/useAdminCustomers";

const CUSTOMERS_PER_PAGE = 20;

function getPaginationItems(
  currentPage,
  totalPages,
) {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) =>
        index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "...",
      totalPages,
    ];
  }

  if (
    currentPage >=
    totalPages - 3
  ) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default function CustomersPage() {
  const [
    page,
    setPage,
  ] = useState(1);

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    submittedSearch,
    setSubmittedSearch,
  ] = useState("");

  const [
    sort,
    setSort,
  ] = useState("newest");

  const {
    data: customers = [],
    pagination,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useAdminCustomers({
    page,
    limit:
      CUSTOMERS_PER_PAGE,
    search:
      submittedSearch,
    sort,
  });

  const paginationItems =
    useMemo(
      () =>
        getPaginationItems(
          pagination.page,
          pagination.totalPages,
        ),
      [
        pagination.page,
        pagination.totalPages,
      ],
    );

  function handleSearchChange(
    value,
  ) {
    setSearchInput(
      value,
    );
  }

  function handleSearchSubmit(
    event,
  ) {
    event.preventDefault();

    const normalizedSearch =
      searchInput.trim();

    setPage(1);

    setSubmittedSearch(
      normalizedSearch,
    );
  }

  function handleSortChange(
    nextSort,
  ) {
    setSort(
      nextSort,
    );

    setPage(1);
  }

  function handlePageChange(
    nextPage,
  ) {
    if (
      nextPage < 1 ||
      nextPage >
        pagination.totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(
      nextPage,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          تعذر تحميل العملاء
        </p>

        <button
          type="button"
          onClick={() =>
            refetch()
          }
          className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UsersRound
              size={21}
            />
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

      {/* Search + Sort */}
      <form
        onSubmit={
          handleSearchSubmit
        }
      >
        <CustomersToolbar
          search={
            searchInput
          }
          onSearchChange={
            handleSearchChange
          }
          sort={
            sort
          }
          onSortChange={
            handleSortChange
          }
        />
      </form>

      {/* Customers */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                العملاء
              </h2>

              {isFetching && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
              )}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {submittedSearch
                ? `نتائج البحث عن "${submittedSearch}"`
                : `إجمالي العملاء: ${pagination.total}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {pagination.totalPages >
              0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                صفحة{" "}
                {
                  pagination.page
                }{" "}
                من{" "}
                {
                  pagination.totalPages
                }
              </span>
            )}

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {
                pagination.total
              }{" "}
              عميل
            </span>
          </div>
        </div>

        {customers.length ? (
          <div
            className={[
              isFetching
                ? "opacity-70"
                : "",
              "transition-opacity",
            ].join(" ")}
          >
            <CustomersTable
              customers={
                customers
              }
            />

            <div className="grid gap-3 md:hidden">
              {customers.map(
                (customer) => (
                  <CustomerMobileCard
                    key={
                      customer.id
                    }
                    customer={
                      customer
                    }
                  />
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UsersRound
                size={21}
              />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-700">
              لا يوجد عملاء
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {submittedSearch
                ? "لا يوجد عميل مطابق لعملية البحث."
                : "لا توجد بيانات عملاء مسجلة حالياً."}
            </p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination.totalPages >
        1 && (
        <nav
          aria-label="صفحات العملاء"
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
        >
          <p className="text-center text-xs text-slate-500 sm:text-right">
            عرض{" "}
            {
              customers.length
            }{" "}
            من{" "}
            {
              pagination.total
            }{" "}
            عميل
          </p>

          <div className="flex items-center justify-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  page - 1,
                )
              }
              disabled={
                !pagination.hasPreviousPage ||
                isFetching
              }
              aria-label="الصفحة السابقة"
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition",
                pagination.hasPreviousPage
                  ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300",
              ].join(" ")}
            >
              <ChevronRight
                size={17}
              />
            </button>

            {paginationItems.map(
              (
                item,
                index,
              ) => {
                if (
                  item ===
                  "..."
                ) {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-9 min-w-7 items-center justify-center px-1 text-sm text-slate-400"
                    >
                      …
                    </span>
                  );
                }

                const isActive =
                  item ===
                  pagination.page;

                return (
                  <button
                    key={
                      item
                    }
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        item,
                      )
                    }
                    disabled={
                      isFetching &&
                      !isActive
                    }
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    className={[
                      "h-9 min-w-9 shrink-0 rounded-lg px-2 text-sm font-semibold transition",
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {
                      item
                    }
                  </button>
                );
              },
            )}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  page + 1,
                )
              }
              disabled={
                !pagination.hasNextPage ||
                isFetching
              }
              aria-label="الصفحة التالية"
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition",
                pagination.hasNextPage
                  ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300",
              ].join(" ")}
            >
              <ChevronLeft
                size={17}
              />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}