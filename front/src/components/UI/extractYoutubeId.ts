export function extractYouTubeId(
  urlOrId: string | null | undefined,
): string | null {
  if (!urlOrId) return null;
  const s = String(urlOrId).trim();

  // if already looks like an id (11 chars, letters/numbers/_-)
  if (/^[\w-]{11}$/.test(s)) return s;

  // common YouTube URL forms
  const match =
    /(?:v=|\/embed\/|\/v\/|youtu\.be\/)([\w-]{11})/.exec(s) ||
    /youtube\.com\/shorts\/([\w-]{11})/.exec(s);
  return match ? match[1] : null;
}

export function normalizeVideoUrl(raw: unknown): {
  provider: "youtube" | "unknown";
  id: string | null;
} {
  // Seuls un texte ou un nombre peuvent contenir un identifiant ; tout autre type n'en porte pas.
  const str =
    typeof raw === "string" || typeof raw === "number" ? String(raw) : "";
  const ytId = extractYouTubeId(str);
  if (ytId) return { provider: "youtube", id: ytId };
  return { provider: "unknown", id: null };
}
