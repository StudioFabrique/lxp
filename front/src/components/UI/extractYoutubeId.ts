export function extractYouTubeId(
  urlOrId: string | null | undefined,
): string | null {
  if (!urlOrId) return null;
  const s = String(urlOrId).trim();

  // if already looks like an id (11 chars, letters/numbers/_-)
  if (/^[\w-]{11}$/.test(s)) return s;

  // common YouTube URL forms
  const match =
    s.match(/(?:v=|\/embed\/|\/v\/|youtu\.be\/)([\w-]{11})/) ||
    s.match(/youtube\.com\/shorts\/([\w-]{11})/);
  return match ? match[1] : null;
}

export function normalizeVideoUrl(raw: any): {
  provider: "youtube" | "unknown";
  id: string | null;
} {
  const str = raw == null ? "" : String(raw);
  const ytId = extractYouTubeId(str);
  if (ytId) return { provider: "youtube", id: ytId };
  return { provider: "unknown", id: null };
}
