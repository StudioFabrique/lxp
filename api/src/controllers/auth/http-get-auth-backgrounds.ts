import { Request, Response } from "express";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const PHOTO_COUNT = 12;
const SEARCH_QUERY = "abstract architecture minimal";

type BackgroundTheme = "light" | "dark";

const THEME_SEARCH_CONFIG: Record<
  BackgroundTheme,
  { query: string; color: "white" | "black" }
> = {
  light: { query: `${SEARCH_QUERY} bright`, color: "white" },
  dark: { query: `${SEARCH_QUERY} dark`, color: "black" },
};

type UnsplashPhoto = {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: {
    regular: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
};

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

const cache: Record<BackgroundTheme, CachedBackgrounds | null> = {
  light: null,
  dark: null,
};
const pendingRequests: Record<
  BackgroundTheme,
  Promise<AuthBackground[]> | null
> = {
  light: null,
  dark: null,
};

const addUnsplashTracking = (url: string) => {
  const trackedUrl = new URL(url);
  trackedUrl.searchParams.set("utm_source", "andria_lxp");
  trackedUrl.searchParams.set("utm_medium", "referral");
  return trackedUrl.toString();
};

const fetchBackgrounds = async (theme: BackgroundTheme) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  }

  const searchConfig = THEME_SEARCH_CONFIG[theme];
  const url = new URL(UNSPLASH_API_URL);
  url.searchParams.set("query", searchConfig.query);
  url.searchParams.set("color", searchConfig.color);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");
  url.searchParams.set("per_page", PHOTO_COUNT.toString());

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash API returned ${response.status}`);
  }

  const data = (await response.json()) as { results?: UnsplashPhoto[] };

  return (data.results ?? []).map((photo) => ({
    id: photo.id,
    url: photo.urls.regular,
    alt:
      photo.alt_description ??
      photo.description ??
      "Espace d'apprentissage et de travail",
    author: {
      name: photo.user.name,
      profileUrl: addUnsplashTracking(photo.user.links.html),
    },
  }));
};

const getBackgrounds = async (theme: BackgroundTheme) => {
  const themeCache = cache[theme];
  if (themeCache && themeCache.expiresAt > Date.now()) {
    return themeCache.photos;
  }

  if (!pendingRequests[theme]) {
    pendingRequests[theme] = fetchBackgrounds(theme)
      .then((photos) => {
        if (photos.length === 0) {
          throw new Error("Unsplash API returned no photos");
        }

        cache[theme] = {
          expiresAt: Date.now() + CACHE_TTL_MS,
          photos,
        };

        return photos;
      })
      .finally(() => {
        pendingRequests[theme] = null;
      });
  }

  return pendingRequests[theme];
};

export default async function httpGetAuthBackgrounds(
  req: Request,
  res: Response,
) {
  const requestedTheme = req.query.theme;
  if (requestedTheme !== "light" && requestedTheme !== "dark") {
    return res.status(400).json({ message: "Le thème doit être light ou dark." });
  }

  try {
    const photos = await getBackgrounds(requestedTheme);

    res.setHeader(
      "Cache-Control",
      "public, max-age=21600, stale-while-revalidate=86400",
    );
    return res.status(200).json({ theme: requestedTheme, photos });
  } catch (error) {
    console.error("Unable to load Unsplash auth backgrounds:", error);
    return res.status(503).json({
      message: "Les images d'arrière-plan sont temporairement indisponibles.",
    });
  }
}
