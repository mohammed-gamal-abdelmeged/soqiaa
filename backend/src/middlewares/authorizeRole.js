import { AppError } from "../shared/errors/AppError.js";

export function authorizeRole(
  ...allowedRoles
) {
  return (
    req,
    res,
    next
  ) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401,
          "AUTHENTICATION_REQUIRED"
        )
      );
    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403,
          "INSUFFICIENT_PERMISSIONS"
        )
      );
    }

    next();
  };
}