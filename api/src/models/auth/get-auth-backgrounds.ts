import { env } from "../../config/env.ts";
const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const PHOTO_COUNT = 12;
const SEARCH_QUERY = "abstract architecture minimal";

export type BackgroundTheme = "light" | "dark";
export type AuthBackground = {
  id: string;
  url: string;
  alt: string;
  author: { name: string; profileUrl: string };
};

type UnsplashPhoto = {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: { regular: string };
  user: { name: string; links: { html: string } };
};

type CachedBackgrounds = { expiresAt: number; photos: AuthBackground[] };
const cache: Record<BackgroundTheme, CachedBackgrounds | null> = {
  light: null,
  dark: null,
};
const pendingRequests: Record<
  BackgroundTheme,
  Promise<AuthBackground[]> | null
> = { light: null, dark: null };

const searchConfig: Record<
  BackgroundTheme,
  { query: string; color: "white" | "black" }
> = {
  light: { query: `${SEARCH_QUERY} bright`, color: "white" },
  dark: { query: `${SEARCH_QUERY} dark`, color: "black" },
};

function addTracking(url: string) {
  const trackedUrl = new URL(url);
  trackedUrl.searchParams.set("utm_source", "andria_lxp");
  trackedUrl.searchParams.set("utm_medium", "referral");
  return trackedUrl.toString();
}

async function fetchBackgrounds(theme: BackgroundTheme) {
  const accessKey = env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) throw new Error("UNSPLASH_ACCESS_KEY is not configured");

  const url = new URL(UNSPLASH_API_URL);
  url.searchParams.set("query", searchConfig[theme].query);
  url.searchParams.set("color", searchConfig[theme].color);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");
  url.searchParams.set("per_page", PHOTO_COUNT.toString());

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}`, "Accept-Version": "v1" },
  });
  if (!response.ok) throw new Error(`Unsplash API returned ${response.status}`);

  const data = (await response.json()) as { results?: UnsplashPhoto[] };
  return (data.results ?? []).map((photo) => ({
    id: photo.id,
    url: photo.urls.regular,
    alt:
      photo.alt_description ??
      photo.description ??
      "Espace d'apprentissage et de travail",
    author: { name: photo.user.name, profileUrl: addTracking(photo.user.links.html) },
  }));
}

export default async function getAuthBackgrounds(theme: BackgroundTheme) {
  const current = cache[theme];
  if (current && current.expiresAt > Date.now()) return current.photos;

  if (!pendingRequests[theme]) {
    pendingRequests[theme] = fetchBackgrounds(theme)
      .then((photos) => {
        if (photos.length === 0) throw new Error("Unsplash API returned no photos");
        cache[theme] = { expiresAt: Date.now() + CACHE_TTL_MS, photos };
        return photos;
      })
      .finally(() => {
        pendingRequests[theme] = null;
      });
  }
  return pendingRequests[theme];
}
