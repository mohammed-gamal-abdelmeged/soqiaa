import { prisma } from "../../database/prisma.js";
import { env } from "../../config/env.js";

/*
|--------------------------------------------------------------------------
| Dashboard Selects
|--------------------------------------------------------------------------
*/

const LATEST_ORDER_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  customerName: true,
  total: true,
  createdAt: true,
};

/*
|--------------------------------------------------------------------------
| Time Zone Helpers
|--------------------------------------------------------------------------
|
| We calculate the beginning and end of the current STORE day
| and convert them to UTC before querying PostgreSQL.
|
| This keeps the createdAt index usable instead of applying
| a time-zone function to every database row.
|--------------------------------------------------------------------------
*/

const storeDateFormatter =
  new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        env.storeTimeZone,

      year: "numeric",
      month: "2-digit",
      day: "2-digit",

      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",

      hourCycle: "h23",
    }
  );

function getDateTimeParts(
  date
) {
  const parts =
    storeDateFormatter.formatToParts(
      date
    );

  const values =
    Object.fromEntries(
      parts
        .filter(
          (part) =>
            part.type !==
            "literal"
        )
        .map(
          (part) => [
            part.type,
            Number(
              part.value
            ),
          ]
        )
    );

  return {
    year:
      values.year,

    month:
      values.month,

    day:
      values.day,

    hour:
      values.hour,

    minute:
      values.minute,

    second:
      values.second,
  };
}

function getTimeZoneOffsetMs(
  date
) {
  const parts =
    getDateTimeParts(
      date
    );

  const asUtc =
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );

  return (
    asUtc -
    date.getTime()
  );
}

function zonedDateTimeToUtc({
  year,
  month,
  day,
  hour = 0,
  minute = 0,
  second = 0,
}) {
  const desiredUtc =
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      second
    );

  let guess =
    desiredUtc;

  /*
   * A couple of passes are enough
   * to account for DST transitions.
   */
  for (
    let attempt = 0;
    attempt < 3;
    attempt += 1
  ) {
    const date =
      new Date(
        guess
      );

    const offset =
      getTimeZoneOffsetMs(
        date
      );

    const corrected =
      desiredUtc -
      offset;

    if (
      corrected ===
      guess
    ) {
      break;
    }

    guess =
      corrected;
  }

  return new Date(
    guess
  );
}

function getStoreTodayRange(
  now = new Date()
) {
  const current =
    getDateTimeParts(
      now
    );

  const start =
    zonedDateTimeToUtc({
      year:
        current.year,

      month:
        current.month,

      day:
        current.day,
    });

  /*
   * Use UTC only as a safe calendar
   * increment helper.
   *
   * Then convert the next local
   * midnight back to UTC.
   */
  const nextCalendarDay =
    new Date(
      Date.UTC(
        current.year,
        current.month - 1,
        current.day + 1
      )
    );

  const end =
    zonedDateTimeToUtc({
      year:
        nextCalendarDay
          .getUTCFullYear(),

      month:
        nextCalendarDay
          .getUTCMonth() +
        1,

      day:
        nextCalendarDay
          .getUTCDate(),
    });

  return {
    start,
    end,
  };
}

/*
|--------------------------------------------------------------------------
| Serialization
|--------------------------------------------------------------------------
*/

function serializeLatestOrder(
  order
) {
  return {
    id:
      order.id,

    orderNumber:
      order.orderNumber,

    customer:
      order.customerName,

    total:
      Number(
        order.total
      ),

    status:
      order.status.toLowerCase(),

    createdAt:
      order.createdAt,
  };
}

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

export async function getAdminDashboard() {
  const {
    start,
    end,
  } =
    getStoreTodayRange();

  /*
   * These queries are independent,
   * so run them concurrently.
   */
  const [
    productsCount,
    customersCount,
    todayOrdersCount,
    latestOrders,
  ] =
    await Promise.all([
      /*
       * Count products visible
       * to the admin inventory.
       *
       * Inactive products still count.
       * Deleted products do not.
       */
      prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),

      /*
       * Customers only.
       *
       * ADMIN accounts are not
       * customer accounts.
       */
      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      /*
       * Orders created during the
       * current store day in Cairo.
       */
      prisma.order.count({
        where: {
          createdAt: {
            gte:
              start,

            lt:
              end,
          },
        },
      }),

      /*
       * Dashboard only needs
       * the newest five orders.
       */
      prisma.order.findMany({
        orderBy: {
          createdAt:
            "desc",
        },

        take: 5,

        select:
          LATEST_ORDER_SELECT,
      }),
    ]);

  return {
    stats: {
      products:
        productsCount,

      customers:
        customersCount,

      todayOrders:
        todayOrdersCount,
    },

    latestOrders:
      latestOrders.map(
        serializeLatestOrder
      ),
  };
}