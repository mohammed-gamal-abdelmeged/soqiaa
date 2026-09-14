export const CUSTOMER_SORT_OPTIONS = [
  {
    value: "newest",
    label: "الأحدث",
  },
  {
    value: "oldest",
    label: "الأقدم",
  },
  {
    value: "name-asc",
    label: "الاسم: أ - ي",
  },
  {
    value: "name-desc",
    label: "الاسم: ي - أ",
  },
];

export function createCustomersFromOrders(orders = []) {
  const customersMap = new Map();

  orders.forEach((order) => {
    const customer = order.customer;

    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.address
    ) {
      return;
    }

    const phone = String(customer.phone).trim();

    const currentCustomer =
      customersMap.get(phone);

    const orderDate = order.createdAt
      ? new Date(order.createdAt).getTime()
      : 0;

    if (!currentCustomer) {
      customersMap.set(phone, {
        id: phone,
        name: customer.name,
        phone,
        address: customer.address,
        latestOrderAt:
          order.createdAt ?? null,
      });

      return;
    }

    const currentDate =
      currentCustomer.latestOrderAt
        ? new Date(
            currentCustomer.latestOrderAt,
          ).getTime()
        : 0;

    if (orderDate > currentDate) {
      customersMap.set(phone, {
        ...currentCustomer,
        name: customer.name,
        address: customer.address,
        latestOrderAt:
          order.createdAt ?? null,
      });
    }
  });

  return Array.from(
    customersMap.values(),
  );
}

export function filterAndSortCustomers({
  customers,
  search,
  sort,
}) {
  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredCustomers =
    customers.filter((customer) => {
      if (!normalizedSearch) {
        return true;
      }

      const searchableValues = [
        customer.name,
        customer.phone,
        customer.address,
      ];

      return searchableValues.some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(
              normalizedSearch,
            ),
      );
    });

  return [...filteredCustomers].sort(
    (a, b) => {
      if (sort === "name-asc") {
        return a.name.localeCompare(
          b.name,
          "ar",
        );
      }

      if (sort === "name-desc") {
        return b.name.localeCompare(
          a.name,
          "ar",
        );
      }

      const aDate = a.latestOrderAt
        ? new Date(
            a.latestOrderAt,
          ).getTime()
        : 0;

      const bDate = b.latestOrderAt
        ? new Date(
            b.latestOrderAt,
          ).getTime()
        : 0;

      if (sort === "oldest") {
        return aDate - bDate;
      }

      return bDate - aDate;
    },
  );
}