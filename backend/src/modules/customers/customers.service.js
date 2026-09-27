import { prisma } from "../../database/prisma.js";

/*
|--------------------------------------------------------------------------
| Sort
|--------------------------------------------------------------------------
*/

function getCustomersOrderBy(
  sort
) {
  if (
    sort ===
    "oldest"
  ) {
    return [
      {
        createdAt:
          "asc",
      },
      {
        id:
          "asc",
      },
    ];
  }

  if (
    sort ===
    "name-asc"
  ) {
    return [
      {
        fullName:
          "asc",
      },
      {
        id:
          "asc",
      },
    ];
  }

  if (
    sort ===
    "name-desc"
  ) {
    return [
      {
        fullName:
          "desc",
      },
      {
        id:
          "desc",
      },
    ];
  }

  return [
    {
      createdAt:
        "desc",
    },
    {
      id:
        "desc",
    },
  ];
}

/*
|--------------------------------------------------------------------------
| Where
|--------------------------------------------------------------------------
*/

function getCustomersWhere(
  search
) {
  const where = {
    role: "USER",
  };

  if (!search) {
    return where;
  }

  return {
    ...where,

    OR: [
      {
        fullName: {
          contains:
            search,

          mode:
            "insensitive",
        },
      },

      {
        phone: {
          contains:
            search,
        },
      },

      {
        addresses: {
          some: {
            fullAddress: {
              contains:
                search,

              mode:
                "insensitive",
            },
          },
        },
      },
    ],
  };
}

/*
|--------------------------------------------------------------------------
| Serialization
|--------------------------------------------------------------------------
*/

function serializeCustomer(
  customer
) {
  const address =
    customer.addresses[0] ??
    null;

  const latestOrder =
    customer.orders[0] ??
    null;

  return {
    id:
      customer.id,

    name:
      customer.fullName,

    phone:
      customer.phone,

    address:
      address?.fullAddress ??
      null,

    createdAt:
      customer.createdAt,

    latestOrderAt:
      latestOrder?.createdAt ??
      null,
  };
}

/*
|--------------------------------------------------------------------------
| Admin Customers
|--------------------------------------------------------------------------
*/

export async function getAdminCustomers({
  search,
  sort,
  page,
  limit,
}) {
  const where =
    getCustomersWhere(
      search
    );

  const skip =
    (page - 1) *
    limit;

  /*
   * Count and page query are independent,
   * so execute them concurrently.
   */
  const [
    total,
    customers,
  ] =
    await Promise.all([
      prisma.user.count({
        where,
      }),

      prisma.user.findMany({
        where,

        orderBy:
          getCustomersOrderBy(
            sort
          ),

        skip,

        take:
          limit,

        select: {
          id: true,
          fullName: true,
          phone: true,
          createdAt: true,

          /*
           * We only need one address.
           *
           * Prefer the default address,
           * then the newest one.
           */
          addresses: {
            orderBy: [
              {
                isDefault:
                  "desc",
              },
              {
                createdAt:
                  "desc",
              },
            ],

            take: 1,

            select: {
              fullAddress:
                true,
            },
          },

          /*
           * Only latest order date.
           *
           * We do NOT load order items,
           * totals, customer snapshots,
           * etc.
           */
          orders: {
            orderBy: {
              createdAt:
                "desc",
            },

            take: 1,

            select: {
              createdAt:
                true,
            },
          },
        },
      }),
    ]);

  const totalPages =
    total === 0
      ? 0
      : Math.ceil(
          total /
            limit
        );

  return {
    customers:
      customers.map(
        serializeCustomer
      ),

    pagination: {
      page,
      limit,
      total,
      totalPages,

      hasNextPage:
        page <
        totalPages,

      hasPreviousPage:
        page > 1,
    },
  };
}