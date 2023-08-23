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

export function setUrlWebsiteType(url: string) {
  let websiteType: LinkType = "website";
  if (TwitterRegex.test(url)) websiteType = "twitter";
  if (FacebookRegex.test(url)) websiteType = "facebook";
  if (InstagramRegex.test(url)) websiteType = "instagram";
  if (LinkedinRegex.test(url)) websiteType = "linkedin";
  if (YoutubeRegex.test(url)) websiteType = "youtube";
  return websiteType;
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
