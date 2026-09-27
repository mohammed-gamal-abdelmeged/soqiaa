import { AppError } from "../shared/errors/AppError.js";

import {
  verifyCsrfToken,
} from "../modules/auth/auth.session.js";

const CSRF_TOKEN_REGEX =
  /^[a-f0-9]{64}$/i;

export function requireCsrf(
  req,
  res,
  next
) {
  const csrfToken =
    req.get("x-csrf-token");

  if (
    !csrfToken ||
    !CSRF_TOKEN_REGEX.test(
      csrfToken
    )
  ) {
    return next(
      new AppError(
        "Invalid CSRF token",
        403,
        "INVALID_CSRF_TOKEN"
      )
    );
  }

  const tokenIsValid =
    verifyCsrfToken(
      csrfToken,
      req.session
        ?.csrfTokenHash
    );

  if (!tokenIsValid) {
    return next(
      new AppError(
        "Invalid CSRF token",
        403,
        "INVALID_CSRF_TOKEN"
      )
    );
  }

  next();
}