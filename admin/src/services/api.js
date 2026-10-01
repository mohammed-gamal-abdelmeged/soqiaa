import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,

  withCredentials: true,

  timeout: 10000,
});

let csrfToken = null;
let csrfRequest = null;

const SAFE_METHODS =
  new Set([
    "get",
    "head",
    "options",
  ]);

const CSRF_EXCLUDED_PATHS =
  new Set([
    "/auth/login",
    "/auth/register",
  ]);

function getRequestPath(
  config
) {
  const url =
    config?.url || "";

  try {
    return new URL(
      url,
      API_BASE_URL
    ).pathname.replace(
      /^\/api\/v1/,
      ""
    );
  } catch {
    return url;
  }
}

function requiresCsrf(
  config
) {
  const method =
    config.method
      ?.toLowerCase() ||
    "get";

  if (
    SAFE_METHODS.has(
      method
    )
  ) {
    return false;
  }

  const path =
    getRequestPath(
      config
    );

  return !CSRF_EXCLUDED_PATHS.has(
    path
  );
}

export function setCsrfToken(
  token
) {
  csrfToken =
    typeof token ===
      "string" &&
    token.length > 0
      ? token
      : null;
}

export function clearCsrfToken() {
  csrfToken = null;
}

async function requestCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  if (csrfRequest) {
    return csrfRequest;
  }

  csrfRequest =
    axios
      .get(
        `${API_BASE_URL}/auth/csrf`,
        {
          withCredentials:
            true,

          timeout:
            10000,
        }
      )
      .then(
        (response) => {
          const token =
            response
              .data
              ?.data
              ?.csrfToken;

          if (!token) {
            throw new Error(
              "CSRF token was not returned by the server"
            );
          }

          csrfToken =
            token;

          return token;
        }
      )
      .finally(() => {
        csrfRequest =
          null;
      });

  return csrfRequest;
}

api.interceptors.request.use(
  async (config) => {
    if (
      requiresCsrf(
        config
      )
    ) {
      const token =
        await requestCsrfToken();

      config.headers.set(
        "x-csrf-token",
        token
      );
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    const path =
      getRequestPath(
        response.config
      );

    if (
      path ===
      "/auth/login"
    ) {
      const token =
        response
          .data
          ?.data
          ?.csrfToken;

      if (token) {
        setCsrfToken(
          token
        );
      }
    }

    if (
      path ===
      "/auth/logout"
    ) {
      clearCsrfToken();
    }

    return response;
  },

  async (error) => {
    const response =
      error.response;

    const originalRequest =
      error.config;

    const errorCode =
      response
        ?.data
        ?.error
        ?.code;

    if (
      response?.status ===
      401
    ) {
      clearCsrfToken();
    }

    const canRetryCsrf =
      response?.status ===
        403 &&
      errorCode ===
        "INVALID_CSRF_TOKEN" &&
      originalRequest &&
      !originalRequest
        ._csrfRetry &&
      requiresCsrf(
        originalRequest
      );

    if (
      canRetryCsrf
    ) {
      originalRequest
        ._csrfRetry = true;

      clearCsrfToken();

      try {
        const token =
          await requestCsrfToken();

        originalRequest
          .headers
          .set(
            "x-csrf-token",
            token
          );

        return api(
          originalRequest
        );
      } catch {
        clearCsrfToken();
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default api;