import { prisma } from "../database/prisma.js";

import {
  AppError,
} from "../shared/errors/AppError.js";

import {
  clearSessionCookie,
  getSessionCookieName,
  hashSessionToken,
} from "../modules/auth/auth.session.js";

export async function authenticate(
  req,
  res,
  next,
) {
  /*
  |--------------------------------------------------------------------------
  | Resolve Correct Session Cookie
  |--------------------------------------------------------------------------
  |
  | Customer request:
  |   soqiaa_session
  |
  | Admin request:
  |   soqiaa_session_admin
  |
  | Never allow one application to authenticate
  | using the other application's session.
  |--------------------------------------------------------------------------
  */

  const cookieName =
    getSessionCookieName(req);

  const sessionToken =
    req.cookies?.[
      cookieName
    ];

  if (!sessionToken) {
    return next(
      new AppError(
        "Authentication required",
        401,
        "AUTHENTICATION_REQUIRED",
      ),
    );
  }

  const tokenHash =
    hashSessionToken(
      sessionToken,
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
    session.expiresAt <=
      new Date();

  if (sessionIsInvalid) {
    clearSessionCookie(
      res,
      cookieName,
    );

    return next(
      new AppError(
        "Authentication required",
        401,
        "AUTHENTICATION_REQUIRED",
      ),
    );
  }

  if (
    !session.user.isActive
  ) {
    clearSessionCookie(
      res,
      cookieName,
    );

    return next(
      new AppError(
        "Account is disabled",
        403,
        "ACCOUNT_DISABLED",
      ),
    );
  }

  req.user =
    session.user;

  req.session = {
    id:
      session.id,

    csrfTokenHash:
      session.csrfTokenHash,

    expiresAt:
      session.expiresAt,

    cookieName,
  };

  next();
}