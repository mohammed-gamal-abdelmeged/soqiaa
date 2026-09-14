import * as XLSX from "xlsx";

import {
  getOrderStatusMeta,
} from "./orderStatus";

function formatDateForExcel(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "ar-EG",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

export function exportOrdersToExcel(
  orders,
) {
  if (!orders?.length) {
    return false;
  }

  const rows = orders.map((order) => {
    const itemsCount = Array.isArray(
      order.items,
    )
      ? order.items.reduce(
          (total, item) =>
            total +
            Number(
              item.quantity || 0,
            ),
          0,
        )
      : 0;

    const products =
      order.items
        ?.map((item) => item.name)
        .join(" - ") ?? "";

    return {
      "رقم الطلب":
        order.orderNumber ?? "",
      العميل:
        order.customer?.name ??
        "غير مسجل",
      الهاتف:
        order.customer?.phone ?? "",
      العنوان:
        order.customer?.address ?? "",
      الحالة:
        getOrderStatusMeta(
          order.status,
        ).label,
      "عدد المنتجات": itemsCount,
      المنتجات: products,
      "إجمالي الطلب":
        Number(order.total) || 0,
      التاريخ: formatDateForExcel(
        order.createdAt,
      ),
    };
  });

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  const workbook =
    XLSX.utils.book_new();

  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 22 },
    { wch: 18 },
    { wch: 35 },
    { wch: 18 },
    { wch: 15 },
    { wch: 60 },
    { wch: 18 },
    { wch: 25 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "الطلبات",
  );

  const date = new Date();

  const fileDate = [
    date.getFullYear(),
    String(
      date.getMonth() + 1,
    ).padStart(2, "0"),
    String(
      date.getDate(),
    ).padStart(2, "0"),
  ].join("-");

  XLSX.writeFile(
    workbook,
    `soqiaa-orders-${fileDate}.xlsx`,
  );

  return true;
}