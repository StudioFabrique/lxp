const UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos";

type UnsplashResult = { urls?: { regular?: string } };

/** Downloads a landscape presentation image matching a content title. */
export async function getUnsplashPresentationImage(title: string) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const searchUrl = new URL(UNSPLASH_SEARCH_URL);
    searchUrl.searchParams.set("query", title);
    searchUrl.searchParams.set("orientation", "landscape");
    searchUrl.searchParams.set("content_filter", "high");
    searchUrl.searchParams.set("per_page", "1");

    const searchResponse = await fetch(searchUrl, {
      headers: { Authorization: `Client-ID ${accessKey}`, "Accept-Version": "v1" },
    });
    if (!searchResponse.ok) return null;

    const payload = (await searchResponse.json()) as { results?: UnsplashResult[] };
    const imageUrl = payload.results?.[0]?.urls?.regular;
    if (!imageUrl) return null;

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) return null;
    return Buffer.from(await imageResponse.arrayBuffer());
  } catch {
    // Image generation must never prevent content creation.
    return null;
  }
}
