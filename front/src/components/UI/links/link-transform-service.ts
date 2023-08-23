import { LinkType } from "./link";

const TwitterRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?twitter\.com\/(@\w+|status\/\d+)$/;

const FacebookRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?facebook\.com\/(pages\/[a-zA-Z0-9_-]+\/\d+|pg\/[a-zA-Z0-9_-]+\/\d+|profile\.php\?id=\d+|[\w.-]+)$/;

const InstagramRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)(\/|\b)$/;

const LinkedinRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?linkedin\.com\/(in\/[a-zA-Z0-9_-]+|company\/[a-zA-Z0-9_-]+|company\/[a-zA-Z0-9_-]+\/people\/)(\/|\b)$/;

const YoutubeRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?youtube\.com\/(?:@([a-zA-Z0-9_-]+)|watch\?v=([a-zA-Z0-9_-]+))$/;

const genericURLRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?([a-zA-Z0-9.@-]+?)(\.[a-z]{2,})([a-z.]{2,6})(\/?@[a-zA-Z0-9_-]+)?([\/\w\.-]*)*\/?$/;

export const linkIsValid = (link: string) => link.match(genericURLRegex);

export function setUrlWebsiteType(url: string) {
  if (TwitterRegex.test(url)) return "twitter";
  if (FacebookRegex.test(url)) return "facebook";
  if (InstagramRegex.test(url)) return "instagram";
  if (LinkedinRegex.test(url)) return "linkedin";
  if (YoutubeRegex.test(url)) return "youtube";
  return "website";
}

export function tranformLinkIntoAlias(
  linkToTransform: string,
  linkType: LinkType
) {
  try {
    const url = new URL(linkToTransform);
    const pathnameParts = url.pathname.split("/");
    switch (linkType) {
      case "youtube":
        return youtubeAlias(pathnameParts);
      default:
        return null;
    }
  } catch (error) {
    console.error("Error parsing the URL:", error);
    return null;
  }
}

const youtubeAlias = (pathnameParts: string[]) => {
  if (pathnameParts[1].includes("@")) return pathnameParts[1].substring(1);

  return null;
};

const twitterAlias = (pathnameParts: string[]) => {};

const facebookAlias = (pathnameParts: string[]) => {};

const instagramAlias = (pathnameParts: string[]) => {};

const linkedinAlias = (pathnameParts: string[]) => {};
