import {
  clearSessionCookie,
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
  res
) {
  const user = await registerUser(
    req.validated.body
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
  res
) {
  const {
    user,
    session,
    csrfToken,
  } = await loginUser(
    req.validated.body
  );

  setSessionCookie(
    res,
    session.token,
    session.expiresAt
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
  res
) {
  res.status(200).json({
    success: true,

    data: {
      user: req.user,
    },
  });
}
export async function logout(
  req,
  res
) {
  await logoutUser(
    req.session.id,
    req.user.id
  );

  clearSessionCookie(res);

  res.status(200).json({
    success: true,
    message:
      "Logged out successfully",
  });
}
export async function csrf(
  req,
  res
) {
  const csrfToken =
    await refreshCsrfToken(
      req.session.id,
      req.user.id
    );

  res.status(200).json({
    success: true,

    data: {
      csrfToken,
    },
  });
}