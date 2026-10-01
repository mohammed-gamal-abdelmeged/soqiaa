import argon2 from "argon2";

import { prisma } from "../../database/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";

import {
  createSessionExpiry,
  generateCsrfToken,
  generateSessionToken,
  hashCsrfToken,
  hashSessionToken,
} from "./auth.session.js";

const PASSWORD_HASH_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function registerUser(data) {
  const {
    fullName,
    phone,
    address,
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

  if (existingUser) {
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
    const user =
      await prisma.$transaction(
        async (tx) => {
          return tx.user.create({
            data: {
              fullName,
              phone,
              passwordHash,

              addresses: {
                create: {
                  fullAddress:
                    address,

                  label: "Home",

                  isDefault:
                    true,
                },
              },

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

              addresses: {
                where: {
                  isDefault: true,
                },

                select: {
                  id: true,
                  label: true,
                  fullAddress: true,
                  isDefault: true,
                },

                take: 1,
              },
            },
          });
        },
      );

    return {
      id: user.id,

      fullName:
        user.fullName,

      phone:
        user.phone,

      role:
        user.role,

      isActive:
        user.isActive,

      address:
        user.addresses[0] ??
        null,

      createdAt:
        user.createdAt,
    };
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

export async function loginUser(
  data,
  {
    requiredRole = null,
  } = {},
) {
  const {
    phone,
    password,
  } = data;

  const user =
    await prisma.user.findUnique({
      where: {
        phone,
      },

      select: {
        id: true,
        fullName: true,
        phone: true,
        passwordHash: true,
        role: true,
        isActive: true,
        createdAt: true,

        addresses: {
          where: {
            isDefault: true,
          },

          select: {
            id: true,
            label: true,
            fullAddress: true,
            isDefault: true,
          },

          take: 1,
        },
      },
    });

  if (!user) {
    throw new AppError(
      "Invalid phone number or password",
      401,
      "INVALID_CREDENTIALS",
    );
  }

  const passwordIsValid =
    await argon2.verify(
      user.passwordHash,
      password,
    );

  if (!passwordIsValid) {
    throw new AppError(
      "Invalid phone number or password",
      401,
      "INVALID_CREDENTIALS",
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "Account is disabled",
      403,
      "ACCOUNT_DISABLED",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Role Requirement
  |--------------------------------------------------------------------------
  |
  | Customer website:
  |   requiredRole = null
  |
  |   USER  -> allowed
  |   ADMIN -> allowed
  |
  | Admin dashboard:
  |   requiredRole = "ADMIN"
  |
  |   USER  -> rejected BEFORE session creation
  |   ADMIN -> allowed
  |--------------------------------------------------------------------------
  */

  if (
    requiredRole &&
    user.role !== requiredRole
  ) {
    throw new AppError(
      "Admin access required",
      403,
      "ADMIN_ACCESS_REQUIRED",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create Session
  |--------------------------------------------------------------------------
  |
  | We only reach this point after:
  |
  | - credentials are valid
  | - account is active
  | - required role is satisfied
  |--------------------------------------------------------------------------
  */

  const sessionToken =
    generateSessionToken();

  const csrfToken =
    generateCsrfToken();

  const tokenHash =
    hashSessionToken(
      sessionToken,
    );

  const csrfTokenHash =
    hashCsrfToken(
      csrfToken,
    );

  const expiresAt =
    createSessionExpiry();

  await prisma.session.create({
    data: {
      userId:
        user.id,

      tokenHash,

      csrfTokenHash,

      expiresAt,
    },
  });

  return {
    user: {
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
        user.addresses[0] ??
        null,

      createdAt:
        user.createdAt,
    },

    session: {
      token:
        sessionToken,

      expiresAt,
    },

    csrfToken,
  };
}

export async function logoutUser(
  sessionId,
  userId,
) {
  await prisma.session.updateMany({
    where: {
      id:
        sessionId,

      userId,

      revokedAt:
        null,
    },

    data: {
      revokedAt:
        new Date(),
    },
  });
}

export async function refreshCsrfToken(
  sessionId,
  userId,
) {
  const csrfToken =
    generateCsrfToken();

  const csrfTokenHash =
    hashCsrfToken(
      csrfToken,
    );

  const result =
    await prisma.session.updateMany({
      where: {
        id:
          sessionId,

        userId,

        revokedAt:
          null,

        expiresAt: {
          gt:
            new Date(),
        },
      },

      data: {
        csrfTokenHash,
      },
    });

  if (
    result.count !== 1
  ) {
    throw new AppError(
      "Authentication required",
      401,
      "AUTHENTICATION_REQUIRED",
    );
  }

  return csrfToken;
}