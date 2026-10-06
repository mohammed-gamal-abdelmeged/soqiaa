import argon2 from "argon2";

import {
  prisma,
} from "../../database/prisma.js";

import {
  AppError,
} from "../../shared/errors/AppError.js";

const PASSWORD_HASH_OPTIONS = {
  type:
    argon2.argon2id,

  memoryCost:
    19456,

  timeCost:
    2,

  parallelism:
    1,
};

export async function createAdminAccount(
  data,
) {
  const {
    fullName,
    phone,
    password,
  } = data;

  const existingUser =
    await prisma.user.findUnique({
      where: {
        phone,
      },

      select: {
        id: true,
      },
    });

  if (
    existingUser
  ) {
    throw new AppError(
      "Phone number is already registered",
      409,
      "PHONE_ALREADY_REGISTERED",
    );
  }

  const passwordHash =
    await argon2.hash(
      password,
      PASSWORD_HASH_OPTIONS,
    );

  try {
    const admin =
      await prisma.user.create({
        data: {
          fullName,
          phone,
          passwordHash,

          role:
            "ADMIN",

          isActive:
            true,

          /*
           * بنعمل Cart كمان عشان
           * الـUser model يفضل كامل
           * ومتوافق مع باقي السيستم.
           */
          cart: {
            create: {},
          },
        },

        select: {
          id: true,
          fullName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

    return admin;
  } catch (error) {
    if (
      error?.code ===
      "P2002"
    ) {
      throw new AppError(
        "Phone number is already registered",
        409,
        "PHONE_ALREADY_REGISTERED",
      );
    }

    throw error;
  }
}