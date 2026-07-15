import { Request, Response } from "express";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const PHOTO_COUNT = 12;
const SEARCH_QUERY = "abstract architecture minimal";

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

let cache: CachedBackgrounds | null = null;
let pendingRequest: Promise<AuthBackground[]> | null = null;

const addUnsplashTracking = (url: string) => {
  const trackedUrl = new URL(url);
  trackedUrl.searchParams.set("utm_source", "andria_lxp");
  trackedUrl.searchParams.set("utm_medium", "referral");
  return trackedUrl.toString();
};

const fetchBackgrounds = async () => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  }

  const url = new URL(UNSPLASH_API_URL);
  url.searchParams.set("query", SEARCH_QUERY);
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

const getBackgrounds = async () => {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.photos;
  }

  if (!pendingRequest) {
    pendingRequest = fetchBackgrounds()
      .then((photos) => {
        if (photos.length === 0) {
          throw new Error("Unsplash API returned no photos");
        }

        cache = {
          expiresAt: Date.now() + CACHE_TTL_MS,
          photos,
        };

        return photos;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
};

export default async function httpGetAuthBackgrounds(
  _req: Request,
  res: Response,
) {
  try {
    const photos = await getBackgrounds();

    res.setHeader(
      "Cache-Control",
      "public, max-age=21600, stale-while-revalidate=86400",
    );
    return res.status(200).json({ photos });
  } catch (error) {
    console.error("Unable to load Unsplash auth backgrounds:", error);
    return res.status(503).json({
      message: "Les images d'arrière-plan sont temporairement indisponibles.",
    });
  }
}
