export function validateYoutubeUrl(url: string): boolean {
  // Base YouTube URL pattern
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/;

  if (!youtubeRegex.test(url)) {
    return false;
  }

  try {
    const urlObj = new URL(url);

    // Must have video ID
    if (!urlObj.searchParams.has("v") && !url.includes("youtu.be/")) {
      return false;
    }

    // Check for suspicious parameters
    const suspiciousParams = ["videoplayback", "log_event", "watchtime"];
    for (const param of suspiciousParams) {
      if (urlObj.searchParams.has(param)) {
        return false;
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}
