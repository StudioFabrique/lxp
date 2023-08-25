import { LinkType } from "../../../utils/interfaces/link";

const genericURLRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?([a-zA-Z0-9.-]+?)(\/[@a-zA-Z0-9_-]+)?([/?].*)$/;

export const urlIsValid = (url: string) => url.match(genericURLRegex);

export function transformLink(linkToTransform: string): {
  type: LinkType;
  alias?: string | null;
} {
  try {
    const url = new URL(linkToTransform);
    const pathnameParts = url.pathname.split("/");
    const hostname = url.hostname.replace("www.", "").split(".")[0];
    console.log(url);

    switch (hostname) {
      case "youtube":
        return { type: "youtube", alias: youtubeAlias(pathnameParts) };
      case "twitter":
        return { type: "twitter", alias: twitterAlias(pathnameParts) };
      case "facebook":
        return { type: "facebook" };
      case "instagram":
        return { type: "instagram" };
      case "linkedin":
        return { type: "linkedin" };
      default:
        return { type: "website" };
    }
  } catch (error) {
    console.error("Error parsing the URL:", error);
    return { type: "website" };
  }
}

const youtubeAlias = (pathnameParts: string[]) => {
  if (pathnameParts[1].includes("@")) return pathnameParts[1].substring(1);
  if (pathnameParts[1].includes("watch")) return "Vidéo youtube";
  return "Contenu youtube";
};

const twitterAlias = (pathnameParts: string[]) => {
  if (!!pathnameParts[2] && pathnameParts[2].includes("status"))
    return `Thread de ${pathnameParts[1]}`;
  return pathnameParts[1];
};

const facebookAlias = (pathnameParts: string[]) => {};

const instagramAlias = (pathnameParts: string[]) => {};

const linkedinAlias = (pathnameParts: string[]) => {};
