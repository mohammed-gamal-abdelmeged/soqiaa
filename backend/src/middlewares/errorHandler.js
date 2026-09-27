import { env } from "../config/env.js";

export function errorHandler(
  err,
  req,
  res,
  next
) {
  const statusCode =
    err.statusCode || 500;

  const isServerError =
    statusCode >= 500;

  const response = {
    success: false,

    error: {
      code:
        isServerError &&
        env.isProduction
          ? "INTERNAL_SERVER_ERROR"
          : err.code ||
            "INTERNAL_SERVER_ERROR",

      message:
        isServerError &&
        env.isProduction
          ? "Internal server error"
          : err.message,
    },
  };

  /*
   * Validation/business details are useful
   * to the client, but never expose details
   * of internal server errors in production.
   */
  if (
    err.details &&
    (!isServerError ||
      !env.isProduction)
  ) {
    response.error.details =
      err.details;
  }

  if (!env.isProduction) {
    response.error.stack =
      err.stack;
  }

  res
    .status(statusCode)
    .json(response);
}