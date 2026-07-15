import apiClient from "../../../lib/axios";

export type AuthBackgroundTheme = "light" | "dark";

export type AuthBackground = {
  id: string;
  url: string;
  alt: string;
  author: {
    name: string;
    profileUrl: string;
  };
};

type CachedBackgrounds = {
  expiresAt: number;
  photos: AuthBackground[];
};

const CACHE_KEY_PREFIX = "auth-backgrounds";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const pendingRequests: Record<
  AuthBackgroundTheme,
  Promise<AuthBackground[]> | null
> = {
  light: null,
  dark: null,
};

const getCacheKey = (theme: AuthBackgroundTheme) =>
  `${CACHE_KEY_PREFIX}:${theme}`;

const readCache = (theme: AuthBackgroundTheme): CachedBackgrounds | null => {
  try {
    const value = localStorage.getItem(getCacheKey(theme));
    if (!value) return null;

    const cached = JSON.parse(value) as CachedBackgrounds;
    if (!Array.isArray(cached.photos) || cached.photos.length === 0) {
      return null;
    }

    return cached;
  } catch {
    return null;
  }
};

const writeCache = (
  theme: AuthBackgroundTheme,
  value: CachedBackgrounds,
) => {
  try {
    localStorage.setItem(getCacheKey(theme), JSON.stringify(value));
  } catch {
    // Images remain usable in memory when browser storage is unavailable.
  }
};

const getAuthBackgrounds = async (
  theme: AuthBackgroundTheme,
): Promise<AuthBackground[]> => {
  const cached = readCache(theme);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.photos;
  }

  if (!pendingRequests[theme]) {
    pendingRequests[theme] = apiClient
      .get<{ photos: AuthBackground[] }>("/auth/backgrounds", {
        params: { theme },
      })
      .then(({ data }) => {
        const freshCache: CachedBackgrounds = {
          expiresAt: Date.now() + CACHE_TTL_MS,
          photos: data.photos,
        };
        writeCache(theme, freshCache);
        return freshCache.photos;
      })
      .catch((error: unknown) => {
        if (cached) return cached.photos;
        throw error;
      })
      .finally(() => {
        pendingRequests[theme] = null;
      });
  }

  return pendingRequests[theme];
};

export const backgroundApi = {
  getAuthBackgrounds,
};
