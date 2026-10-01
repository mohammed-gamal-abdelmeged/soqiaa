import { env } from "../../config/env.js";

import {
  clearSessionCookie,
  getSessionCookieName,
  setSessionCookie,
} from "./auth.session.js";

import {
  loginUser,
  logoutUser,
  refreshCsrfToken,
  registerUser,
} from "./auth.service.js";

export async function register(
  req,
  res,
) {
  const user =
    await registerUser(
      req.validated.body,
    );

  res.status(201).json({
    success: true,

    message:
      "Account created successfully",

    data: {
      user,
    },
  });
}

export async function login(
  req,
  res,
) {
  /*
  |--------------------------------------------------------------------------
  | Detect Login Application
  |--------------------------------------------------------------------------
  |
  | Customer website:
  |   USER  -> allowed
  |   ADMIN -> allowed
  |
  | Admin dashboard:
  |   USER  -> rejected
  |   ADMIN -> allowed
  |--------------------------------------------------------------------------
  */

  const origin =
    req.get("origin");

  const isAdminLogin =
    origin ===
    env.adminOrigin;

  const {
    user,
    session,
    csrfToken,
  } =
    await loginUser(
      req.validated.body,
      {
        requiredRole:
          isAdminLogin
            ? "ADMIN"
            : null,
      },
    );

  /*
  |--------------------------------------------------------------------------
  | Set Correct Cookie
  |--------------------------------------------------------------------------
  |
  | Customer:
  |   soqiaa_session
  |
  | Admin:
  |   soqiaa_session_admin
  |--------------------------------------------------------------------------
  */

  const cookieName =
    getSessionCookieName(req);

  setSessionCookie(
    res,
    session.token,
    session.expiresAt,
    cookieName,
  );

  res.status(200).json({
    success: true,

    message:
      "Logged in successfully",

    data: {
      user,
      csrfToken,
    },
  });
}

export async function me(
  req,
  res,
) {
  res.status(200).json({
    success: true,

    data: {
      user:
        req.user,
    },
  });
}

export async function logout(
  req,
  res,
) {
  await logoutUser(
    req.session.id,
    req.user.id,
  );

  const cookieName =
    getSessionCookieName(req);

  clearSessionCookie(
    res,
    cookieName,
  );

  res.status(200).json({
    success: true,

    message:
      "Logged out successfully",
  });
}

export async function csrf(
  req,
  res,
) {
  const csrfToken =
    await refreshCsrfToken(
      req.session.id,
      req.user.id,
    );

  res.status(200).json({
    success: true,

    data: {
      csrfToken,
    },
  });
}