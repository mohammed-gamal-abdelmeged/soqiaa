import { AppError } from "../shared/errors/AppError.js";

export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(
      req[source]
    );

    if (!result.success) {
      const details =
        result.error.issues.map(
          (issue) => ({
            field:
              issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })
        );

      return next(
        new AppError(
          "Validation failed",
          400,
          "VALIDATION_ERROR",
          details
        )
      );
    }

    /*
     * Keep only validated and normalized
     * data for business logic.
     */
    req.validated ??= {};

    req.validated[source] =
      result.data;

    next();
  };
}