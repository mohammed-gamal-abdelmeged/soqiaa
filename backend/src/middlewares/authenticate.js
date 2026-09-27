import { env } from "../config/env.js";
import { prisma } from "../database/prisma.js";
import { AppError } from "../shared/errors/AppError.js";

import {
  clearSessionCookie,
  hashSessionToken,
} from "../modules/auth/auth.session.js";

export async function authenticate(
  req,
  res,
  next
) {
  const sessionToken =
    req.cookies?.[
      env.sessionCookieName
    ];

  if (!sessionToken) {
    return next(
      new AppError(
        "Authentication required",
        401,
        "AUTHENTICATION_REQUIRED"
      )
    );
  }

  const tokenHash =
    hashSessionToken(
      sessionToken
    );

  const session =
    await prisma.session.findUnique({
      where: {
        tokenHash,
      },

      select: {
  id: true,
  csrfTokenHash: true,
  expiresAt: true,
  revokedAt: true,

  user: {
    select: {
      id: true,
      fullName: true,
      phone: true,
      role: true,
      isActive: true,
    },
  },
},
    });

  const sessionIsInvalid =
    !session ||
    session.revokedAt ||
    session.expiresAt <= new Date();

  if (sessionIsInvalid) {
    clearSessionCookie(res);

    return next(
      new AppError(
        "Authentication required",
        401,
        "AUTHENTICATION_REQUIRED"
      )
    );
  }

  if (!session.user.isActive) {
    clearSessionCookie(res);

    return next(
      new AppError(
        "Account is disabled",
        403,
        "ACCOUNT_DISABLED"
      )
    );
  }

  req.user = session.user;

 req.session = {
  id: session.id,
  csrfTokenHash:
    session.csrfTokenHash,
  expiresAt: session.expiresAt,
};

  next();
}