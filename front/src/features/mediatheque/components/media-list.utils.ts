import type Media from "../interfaces/media";

export function getMediaUrl(media: Media) {
  const base = import.meta.env.VITE_API_BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const directories: Record<Media["type"], string> = {
    image: "activities/images/",
    video: "activities/videos/",
    audio: "activities/audios/",
    resource: "activities/files/",
  };

  return `${normalizedBase}${directories[media.type]}${encodeURIComponent(media.url)}`;
}
