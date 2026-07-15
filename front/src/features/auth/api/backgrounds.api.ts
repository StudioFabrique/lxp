import apiClient from "../../../lib/axios";

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

const CACHE_KEY = "auth-backgrounds";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const readCache = (): CachedBackgrounds | null => {
  try {
    const value = localStorage.getItem(CACHE_KEY);
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

const getAuthBackgrounds = async (): Promise<AuthBackground[]> => {
  const cached = readCache();
  if (cached && cached.expiresAt > Date.now()) {
    return cached.photos;
  }

  try {
    const { data } = await apiClient.get<{ photos: AuthBackground[] }>(
      "/auth/backgrounds",
    );

    const freshCache: CachedBackgrounds = {
      expiresAt: Date.now() + CACHE_TTL_MS,
      photos: data.photos,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(freshCache));

    return freshCache.photos;
  } catch (error) {
    if (cached) return cached.photos;
    throw error;
  }
};

export const backgroundApi = {
  getAuthBackgrounds,
};
