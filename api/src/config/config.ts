export const PORT = process.env.PORT || 5001;

export const tokensMaxAge = {
  accessToken: 20 * 60 * 1000,
  refreshToken: 2 * 60 * 60 * 1000,
};

/**
 * Attributs des cookies de session, définis à un seul endroit.
 *
 * `sameSite: "lax"` ne relève pas du détail : l'authentification repose
 * uniquement sur les cookies, et plusieurs routes modifiant l'état répondent à
 * des GET (`/auth/logout`, `/auth/close`). Sans cet attribut, la valeur retenue
 * dépend du navigateur.
 */
export const sessionCookieOptions = (
  token: keyof typeof tokensMaxAge,
): {
  maxAge: number;
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
} => ({
  maxAge: tokensMaxAge[token],
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

/** Mêmes attributs que ci-dessus, sans durée : un cookie ne s'efface que si
 * les attributs présentés correspondent à ceux de sa pose. */
export const clearedCookieOptions = () => {
  const { maxAge, ...attributes } = sessionCookieOptions("accessToken");
  return attributes;
};

export const accessExpire = "20min";
export const refreshExpire = "2h";

export const corsOrigins =
  process.env.ENVIRONMENT === "production"
    ? []
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ];
