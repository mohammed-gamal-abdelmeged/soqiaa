import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import OrderCard from "../components/OrderCard";
import OrdersFilters from "../components/OrdersFilters";

import {
  useAdminOrders,
} from "../hooks/useAdminOrders";

const ORDERS_PER_PAGE = 20;

function getPaginationItems(
  currentPage,
  totalPages,
) {
  if (totalPages <= 7) {
    return Array.from(
      {
        length:
          totalPages,
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

export default function OrdersPage() {
  const navigate =
    useNavigate();

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("all");

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  |
  | searchInput:
  | النص الذي يكتبه الأدمن.
  |
  | submittedSearch:
  | البحث الذي تم تنفيذه فعليًا.
  |
  | الكتابة وحدها لا تغير Query Key
  | وبالتالي لا تعمل أي Request.
  |--------------------------------------------------------------------------
  */

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    submittedSearch,
    setSubmittedSearch,
  ] = useState("");

  const {
    data: orders = [],
    pagination,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useAdminOrders({
    page,

    limit:
      ORDERS_PER_PAGE,

    status:
      selectedStatus,

    search:
      submittedSearch,
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

  function handleClearSearch() {
    setSearchInput("");
    setSubmittedSearch("");
    setPage(1);
  }

  function handleStatusChange(
    status,
  ) {
    setSelectedStatus(
      status,
    );

    setPage(1);
  }

  function handleOpenOrder(
    order,
  ) {
    navigate(
      `/orders/${order.id}`,
    );
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
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          تعذر تحميل الطلبات
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
      <section className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            إدارة الطلبات
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            متابعة وإدارة جميع طلبات
            متجر سوقيا
          </p>
        </div>

        {/* Mobile + Tablet Search */}
        <form
          onSubmit={
            handleSearchSubmit
          }
          className="w-full xl:hidden"
        >
          <label
            htmlFor="orders-search-mobile"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            البحث في الطلبات
          </label>

          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="orders-search-mobile"
                type="text"
                value={
                  searchInput
                }
                onChange={(
                  event,
                ) =>
                  setSearchInput(
                    event.target
                      .value,
                  )
                }
                placeholder="رقم الطلب، اسم العميل أو رقم الموبايل"
                autoComplete="off"
                className="w-full bg-transparent py-3 pl-10 pr-11 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={
                    handleClearSearch
                  }
                  aria-label="مسح البحث"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X
                    size={15}
                  />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isFetching
              }
              aria-label="تنفيذ البحث"
              title="بحث"
              className={[
                "flex w-12 shrink-0",
                "items-center justify-center",
                "border-r border-slate-200",
                "bg-violet-600 text-white",
                "transition",
                "hover:bg-violet-700",
                "disabled:cursor-not-allowed",
                "disabled:opacity-60",
              ].join(" ")}
            >
              {isFetching ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <ArrowLeft
                  size={19}
                />
              )}
            </button>
          </div>

          {submittedSearch && (
            <p className="mt-2 text-xs text-slate-500">
              البحث الحالي:{" "}

              <span className="font-semibold text-violet-700">
                {
                  submittedSearch
                }
              </span>
            </p>
          )}
        </form>
      </section>

      {/* Filters + Desktop Search */}
      <div
        className={[
          "relative",
          "xl:[&>div]:pl-[370px]",
          "2xl:[&>div]:pl-[420px]",
        ].join(" ")}
      >
        <OrdersFilters
          value={
            selectedStatus
          }
          onChange={
            handleStatusChange
          }
        />

        {/* Desktop / Laptop Search */}
        <form
          onSubmit={
            handleSearchSubmit
          }
          className={[
            "absolute left-3 top-1/2 z-10",
            "hidden -translate-y-1/2",
            "xl:block xl:w-[340px]",
            "2xl:w-[390px]",
          ].join(" ")}
        >
          <div className="flex h-11 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="orders-search-desktop"
                type="text"
                value={
                  searchInput
                }
                onChange={(
                  event,
                ) =>
                  setSearchInput(
                    event.target
                      .value,
                  )
                }
                placeholder="رقم الطلب، الاسم أو الموبايل"
                autoComplete="off"
                aria-label="البحث في الطلبات"
                className="h-full w-full bg-transparent pl-9 pr-9 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={
                    handleClearSearch
                  }
                  aria-label="مسح البحث"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X
                    size={14}
                  />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isFetching
              }
              aria-label="تنفيذ البحث"
              title="بحث"
              className={[
                "flex w-11 shrink-0",
                "items-center justify-center",
                "border-r border-violet-600",
                "bg-violet-600 text-white",
                "transition",
                "hover:bg-violet-700",
                "disabled:cursor-not-allowed",
                "disabled:opacity-60",
              ].join(" ")}
            >
              {isFetching ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <ArrowLeft
                  size={18}
                />
              )}
            </button>
          </div>
        </form>
      </div>

      {submittedSearch && (
        <div className="hidden xl:block">
          <p className="text-xs text-slate-500">
            البحث الحالي:{" "}

            <span className="font-semibold text-violet-700">
              {
                submittedSearch
              }
            </span>
          </p>
        </div>
      )}

      {/* Orders */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {selectedStatus ===
                "all"
                  ? "الطلبات"
                  : "الطلبات المطابقة"}
              </h2>

              {isFetching && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
              )}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {submittedSearch
                ? `نتائج البحث عن "${submittedSearch}"`
                : `إجمالي الطلبات: ${pagination.total}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              {
                pagination.total
              }{" "}
              طلب
            </span>
          </div>
        </div>

        {orders.length ? (
          <div
            className={[
              "grid grid-cols-1 gap-3",
              "lg:grid-cols-2",
              "2xl:grid-cols-3",
              isFetching
                ? "opacity-70"
                : "",
              "transition-opacity",
            ].join(" ")}
          >
            {orders.map(
              (order) => (
                <OrderCard
                  key={
                    order.id
                  }
                  order={
                    order
                  }
                  onOpen={
                    handleOpenOrder
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-14 text-center sm:px-6 sm:py-16">
            <Search
              size={32}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-base font-bold text-slate-700">
              لا توجد طلبات
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              {submittedSearch
                ? "لا توجد طلبات مطابقة لعملية البحث الحالية."
                : "لا توجد طلبات مطابقة للحالة المحددة حالياً."}
            </p>

            {submittedSearch && (
              <button
                type="button"
                onClick={
                  handleClearSearch
                }
                className="mt-4 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
              >
                مسح البحث
              </button>
            )}
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination.totalPages >
        1 && (
        <nav
          aria-label="صفحات الطلبات"
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
        >
          <p className="text-center text-xs text-slate-500 sm:text-right">
            عرض{" "}
            {orders.length}{" "}
            من{" "}
            {
              pagination.total
            }{" "}
            طلب
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
                        ? "bg-violet-600 text-white shadow-sm"
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