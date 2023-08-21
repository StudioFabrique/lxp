const TwitterRegex =
  /^(https:\/\/twitter.com\/(?![a-zA-Z0-9_]+\/)([a-zA-Z0-9_]+))$/;

const FacebookRegex =
  /^((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}$/;

const InstagramRegex =
  /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\/?$/;

const LinkedinRegex =
  /^[(https:\/\/www\.linkedin.com)]{20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)+$/;

const YoutubeRegex =
  /^(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(v=[^&\s]+).*)|(?:v(\/.*))|(channel\/.+)|(?:user\/(.+))|(?:results\?(search_query=.+))))?)|(?:youtu\.be(\/.*)?))$/;

export default function setUrlWebsiteType(url: string) {
  let websiteType:
    | "website"
    | "twitter"
    | "facebook"
    | "youtube"
    | "instagram"
    | "linkedin"
    | "reddit" = "website";
  if (TwitterRegex.test(url)) websiteType = "twitter";
  if (FacebookRegex.test(url)) websiteType = "facebook";
  if (InstagramRegex.test(url)) websiteType = "instagram";
  if (LinkedinRegex.test(url)) websiteType = "linkedin";
  if (YoutubeRegex.test(url)) websiteType = "youtube";
  return websiteType;
}
