import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { env } from "../../config/env.js";

const SESSION_TOKEN_BYTES = 32;
const CSRF_TOKEN_BYTES = 32;

/*
|--------------------------------------------------------------------------
| Session Cookie Names
|--------------------------------------------------------------------------
|
| Customer and Admin run on different frontend origins,
| but both talk to the same API host.
|
| Browser cookies do NOT care about ports, so using the same cookie name
| would make the admin login overwrite the customer login.
|--------------------------------------------------------------------------
*/

const CUSTOMER_SESSION_COOKIE_NAME =
  env.sessionCookieName;

const ADMIN_SESSION_COOKIE_NAME =
  `${env.sessionCookieName}_admin`;

/*
|--------------------------------------------------------------------------
| Resolve Session Cookie
|--------------------------------------------------------------------------
|
| Auth endpoints such as:
|
| /auth/login
| /auth/me
| /auth/logout
| /auth/csrf
|
| are shared between the customer app and the admin app.
|
| For those requests we use the request Origin to decide which cookie
| belongs to the caller.
|
| Admin API routes are also detected from the URL as an extra safeguard.
|--------------------------------------------------------------------------
*/

export function getSessionCookieName(
  req,
) {
  const origin =
    req.get("origin");

  const isAdminOrigin =
    origin === env.adminOrigin;

  const isAdminRoute =
    req.originalUrl?.startsWith(
      "/api/v1/admin",
    );

  if (
    isAdminOrigin ||
    isAdminRoute
  ) {
    return ADMIN_SESSION_COOKIE_NAME;
  }

  return CUSTOMER_SESSION_COOKIE_NAME;
}

function hashToken(token) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export function generateSessionToken() {
  return randomBytes(
    SESSION_TOKEN_BYTES,
  ).toString("hex");
}

export function hashSessionToken(token) {
  return hashToken(token);
}

export function generateCsrfToken() {
  return randomBytes(
    CSRF_TOKEN_BYTES,
  ).toString("hex");
}

export function hashCsrfToken(token) {
  return hashToken(token);
}

export function verifyCsrfToken(
  token,
  expectedHash,
) {
  if (
    typeof token !== "string" ||
    typeof expectedHash !== "string"
  ) {
    return false;
  }

  const actualHash =
    hashCsrfToken(token);

  const actualBuffer =
    Buffer.from(
      actualHash,
      "hex",
    );

  const expectedBuffer =
    Buffer.from(
      expectedHash,
      "hex",
    );

  if (
    actualBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    actualBuffer,
    expectedBuffer,
  );
}

export function createSessionExpiry() {
  const ttlMilliseconds =
    env.sessionTtlDays *
    24 *
    60 *
    60 *
    1000;

  return new Date(
    Date.now() +
      ttlMilliseconds,
  );
}

export function setSessionCookie(
  res,
  token,
  expiresAt,
  cookieName = CUSTOMER_SESSION_COOKIE_NAME,
) {
  res.cookie(
    cookieName,
    token,
    {
      httpOnly: true,
      secure:
        env.isProduction,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    },
  );
}

export function clearSessionCookie(
  res,
  cookieName = CUSTOMER_SESSION_COOKIE_NAME,
) {
  res.clearCookie(
    cookieName,
    {
      httpOnly: true,
      secure:
        env.isProduction,
      sameSite: "lax",
      path: "/",
    },
  );
}