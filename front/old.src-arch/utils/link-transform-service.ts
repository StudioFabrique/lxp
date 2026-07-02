import { LinkType } from "./interfaces/link";

export const urlIsValid = (url: string): boolean => {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

export function transformLink(linkToTransform: string): {
  url: string;
  type: LinkType;
  alias?: string | null;
} {
  try {
    // Normalisation
    const formatted = linkToTransform.startsWith("http")
      ? linkToTransform
      : `https://${linkToTransform}`;
    const url = new URL(formatted);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    const pathnameParts = url.pathname.split("/").filter(Boolean);

    // Détection du type de lien
    if (hostname.includes("youtube") || hostname === "youtu.be") {
      return {
        url: url.toString(),
        type: "youtube",
        alias: youtubeAlias(pathnameParts),
      };
    }
    if (hostname.includes("twitter") || hostname === "x.com") {
      return {
        url: url.toString(),
        type: "twitter",
        alias: twitterAlias(pathnameParts),
      };
    }
    if (hostname.includes("facebook")) {
      return { url: url.toString(), type: "facebook" };
    }
    if (hostname.includes("instagram")) {
      return { url: url.toString(), type: "instagram" };
    }
    if (hostname.includes("linkedin")) {
      return { url: url.toString(), type: "linkedin" };
    }

    return { url: url.toString(), type: "website" };
  } catch (error) {
    console.error("Error parsing the URL:", error);
    return { url: "error", type: "website" };
  }
}

// Helpers
const youtubeAlias = (pathnameParts: string[]) => {
  if (!pathnameParts.length) return "Page YouTube";
  if (pathnameParts[0].startsWith("@")) return pathnameParts[0].substring(1);
  if (pathnameParts[0] === "watch") return "Vidéo YouTube";
  return "Contenu YouTube";
};

const twitterAlias = (pathnameParts: string[]) => {
  if (pathnameParts.length >= 2 && pathnameParts[1].includes("status"))
    return `Tweet de ${pathnameParts[0]}`;
  return pathnameParts[0] || "Profil Twitter";
};
