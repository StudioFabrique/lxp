export function maxSizeError(maxSize: number) {
  const baseText = "La taille du fichier doit être inférieure à";
  const convertedSize = maxSize / (1024 * 1024);
  return convertedSize < 1
    ? `${baseText} ${maxSize / 1024} ko`
    : `${baseText} ${convertedSize} mo`;
}
