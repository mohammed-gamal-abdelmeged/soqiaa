import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { env } from "../../config/env.js";

const SESSION_TOKEN_BYTES = 32;
const CSRF_TOKEN_BYTES = 32;

function hashToken(token) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export function generateSessionToken() {
  return randomBytes(
    SESSION_TOKEN_BYTES
  ).toString("hex");
}

export function hashSessionToken(token) {
  return hashToken(token);
}

export function generateCsrfToken() {
  return randomBytes(
    CSRF_TOKEN_BYTES
  ).toString("hex");
}

export function hashCsrfToken(token) {
  return hashToken(token);
}

export function verifyCsrfToken(
  token,
  expectedHash
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
      "hex"
    );

  const expectedBuffer =
    Buffer.from(
      expectedHash,
      "hex"
    );

  if (
    actualBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    actualBuffer,
    expectedBuffer
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
    Date.now() + ttlMilliseconds
  );
}

export function setSessionCookie(
  res,
  token,
  expiresAt
) {
  res.cookie(
    env.sessionCookieName,
    token,
    {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    }
  );
}

export function clearSessionCookie(res) {
  res.clearCookie(
    env.sessionCookieName,
    {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      path: "/",
    }
  );
}