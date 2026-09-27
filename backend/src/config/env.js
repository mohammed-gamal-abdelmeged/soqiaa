import * as z from "zod";

/*
|--------------------------------------------------------------------------
| Time Zone Validation
|--------------------------------------------------------------------------
*/

function isValidTimeZone(
  value
) {
  try {
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: value,
      }
    ).format();

    return true;
  } catch {
    return false;
  }
}

/*
|--------------------------------------------------------------------------
| Environment Schema
|--------------------------------------------------------------------------
*/

const envSchema = z.object({
  NODE_ENV: z
    .enum([
      "development",
      "test",
      "production",
    ])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(5000),

  DATABASE_URL: z
    .string()
    .min(
      1,
      "DATABASE_URL is required"
    )
    .refine(
      (value) =>
        value.startsWith(
          "postgresql://"
        ) ||
        value.startsWith(
          "postgres://"
        ),
      "DATABASE_URL must be a PostgreSQL connection URL"
    ),

  FRONTEND_ORIGIN:
    z.url(),

  ADMIN_ORIGIN:
    z.url(),

  ASSET_BASE_URL:
    z
      .url()
      .optional(),

  SESSION_COOKIE_NAME:
    z
      .string()
      .min(1)
      .default(
        "soqiaa_session"
      ),

  SESSION_TTL_DAYS:
    z.coerce
      .number()
      .int()
      .min(1)
      .max(30)
      .default(7),

  DELIVERY_FEE:
    z.coerce
      .number()
      .min(
        0,
        "DELIVERY_FEE must be zero or greater"
      )
      .max(
        10000,
        "DELIVERY_FEE is too large"
      )
      .default(30),

  STORE_TIME_ZONE:
    z
      .string()
      .trim()
      .min(
        1,
        "STORE_TIME_ZONE is required"
      )
      .refine(
        isValidTimeZone,
        {
          message:
            "STORE_TIME_ZONE must be a valid IANA time zone",
        }
      )
      .default(
        "Africa/Cairo"
      ),
});

const result =
  envSchema.safeParse(
    process.env
  );

if (!result.success) {
  console.error(
    "Invalid environment variables:"
  );

  console.error(
    z.prettifyError(
      result.error
    )
  );

  process.exit(1);
}

export const env =
  Object.freeze({
    nodeEnv:
      result.data.NODE_ENV,

    port:
      result.data.PORT,

    databaseUrl:
      result.data.DATABASE_URL,

    frontendOrigin:
      result.data
        .FRONTEND_ORIGIN,

    adminOrigin:
      result.data
        .ADMIN_ORIGIN,

    assetBaseUrl:
      result.data
        .ASSET_BASE_URL ??
      `http://localhost:${result.data.PORT}`,

    sessionCookieName:
      result.data
        .SESSION_COOKIE_NAME,

    sessionTtlDays:
      result.data
        .SESSION_TTL_DAYS,

    deliveryFee:
      result.data
        .DELIVERY_FEE,

    storeTimeZone:
      result.data
        .STORE_TIME_ZONE,

    isDevelopment:
      result.data.NODE_ENV ===
      "development",

    isProduction:
      result.data.NODE_ENV ===
      "production",

    isTest:
      result.data.NODE_ENV ===
      "test",
  });