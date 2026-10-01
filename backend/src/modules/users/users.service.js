import { prisma } from "../../database/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";

/*
|--------------------------------------------------------------------------
| Profile Select
|--------------------------------------------------------------------------
*/

const MY_PROFILE_SELECT = {
  id: true,
  fullName: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,

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
      id: true,
      label: true,
      fullAddress: true,
      isDefault: true,
    },
  },

  _count: {
    select: {
      orders: {
        where: {
          status:
            "DELIVERED",
        },
      },
    },
  },
};

/*
|--------------------------------------------------------------------------
| Serialization
|--------------------------------------------------------------------------
*/

function serializeMyProfile(
  user
) {
  const address =
    user.addresses[0] ??
    null;

  return {
    id:
      user.id,

    fullName:
      user.fullName,

    phone:
      user.phone,

    role:
      user.role,

    isActive:
      user.isActive,

    address:
      address
        ? {
            id:
              address.id,

            label:
              address.label,

            fullAddress:
              address.fullAddress,

            isDefault:
              address.isDefault,
          }
        : null,

    deliveredOrdersCount:
      user._count.orders,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| Get My Profile
|--------------------------------------------------------------------------
*/

export async function getMyProfile(
  userId
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id:
          userId,
      },

      select:
        MY_PROFILE_SELECT,
    });

  if (!user) {
    throw new AppError(
      "User not found",
      404,
      "USER_NOT_FOUND"
    );
  }

  return serializeMyProfile(
    user
  );
}

/*
|--------------------------------------------------------------------------
| Update My Profile
|--------------------------------------------------------------------------
*/

export async function updateMyProfile(
  userId,
  data
) {
  try {
    return await prisma.$transaction(
      async (tx) => {
        const {
          fullName,
          phone,
          address,
        } = data;

        /*
         * Update user fields only
         * when they were provided.
         */
        const userData = {};

        if (
          fullName !==
          undefined
        ) {
          userData.fullName =
            fullName;
        }

        if (
          phone !==
          undefined
        ) {
          userData.phone =
            phone;
        }

        if (
          Object.keys(
            userData
          ).length > 0
        ) {
          await tx.user.update({
            where: {
              id:
                userId,
            },

            data:
              userData,

            select: {
              id: true,
            },
          });
        }

        /*
         * Address is stored separately
         * from the User table.
         *
         * Update the current default
         * address when it exists.
         *
         * If an old/imported account
         * has no address, create one.
         */
        if (
          address !==
          undefined
        ) {
          const defaultAddress =
            await tx.address.findFirst({
              where: {
                userId,
                isDefault:
                  true,
              },

              select: {
                id: true,
              },
            });

          if (
            defaultAddress
          ) {
            await tx.address.update({
              where: {
                id:
                  defaultAddress.id,
              },

              data: {
                fullAddress:
                  address,
              },
            });
          } else {
            await tx.address.create({
              data: {
                userId,

                label:
                  "Home",

                fullAddress:
                  address,

                isDefault:
                  true,
              },
            });
          }
        }

        /*
         * Return the complete fresh
         * profile so the frontend does
         * not need another GET request
         * after saving.
         */
        const updatedUser =
          await tx.user.findUnique({
            where: {
              id:
                userId,
            },

            select:
              MY_PROFILE_SELECT,
          });

        if (!updatedUser) {
          throw new AppError(
            "User not found",
            404,
            "USER_NOT_FOUND"
          );
        }

        return serializeMyProfile(
          updatedUser
        );
      }
    );
  } catch (error) {
    /*
     * Phone is unique in the database.
     */
    if (
      error?.code ===
      "P2002"
    ) {
      throw new AppError(
        "Phone number is already registered",
        409,
        "PHONE_ALREADY_REGISTERED"
      );
    }

    throw error;
  }
}