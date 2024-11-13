export function validateYoutubeUrl(url: string): boolean {
  // Vérifie si c'est une URL YouTube valide
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+(\?[^?]*)?$/;

  if (!youtubeRegex.test(url)) {
    return false;
  }

  // Vérifie qu'il n'y a pas de paramètres suspects
  const suspiciousParams = ["videoplayback", "log_event", "watchtime"];
  const urlParams = new URL(url).searchParams;

  for (const param of suspiciousParams) {
    if (urlParams.has(param)) {
      return false;
    }
  }

  return true;
}
