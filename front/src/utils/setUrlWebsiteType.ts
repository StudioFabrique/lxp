const TwitterRegex =
  /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}\/?$/;

const FacebookRegex =
  /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:[a-zA-Z0-9.]+\/)?(?:profile\.php\?id=[0-9]+|groups\/[A-Za-z0-9_.-]+|[^/]+)\/?$/;

const InstagramRegex =
  /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/;

const LinkedinRegex =
  /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:company\/[A-Za-z0-9_.-]+|in\/[A-Za-z0-9_.-]+)\/?$/;

const YoutubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}$/;

export default function setUrlWebsiteType(url: string) {
  if (TwitterRegex.test(url)) return "twitter";
  if (FacebookRegex.test(url)) return "facebook";
  if (InstagramRegex.test(url)) return "instagram";
  if (LinkedinRegex.test(url)) return "linkedin";
  if (YoutubeRegex.test(url)) return "youtube";
  return "website";
}
