export const PORT = process.env.PORT || 5001;
export const HTTPS_ENABLED = process.env.HTTPS_ENABLED === "true";
export const MTLS_TO_FASTAPI = process.env.MTLS_TO_FASTAPI === "true";

export const tokensMaxAge = {
  accessToken: 20 * 60 * 1000,
  refreshToken: 2 * 60 * 60 * 1000,
};

export const accessExpire = "20min";
export const refreshExpire = "2h";

export const corsOrigins =
  process.env.ENVIRONMENT === "production"
    ? ["*"]
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        ...(HTTPS_ENABLED
          ? [
              "https://localhost:5173",
              "https://localhost:5174",
              "https://localhost:5175",
            ]
          : []),
      ];
