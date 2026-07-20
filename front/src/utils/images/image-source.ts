const DISPLAYABLE_IMAGE_SOURCE = /^(?:blob:|data:image\/|https?:\/\/)/i;
const RAW_BASE64 = /^[a-z0-9+/]+={0,2}$/i;

export type ImageSource = string | null | undefined;

/**
 * Normalizes every image representation used by the application into a value
 * suitable for `img.src` / CSS `url()`. Raw base64 is kept as a supported
 * legacy input while API responses migrate to complete data URLs.
 */
export function normalizeImageSource(
  source: ImageSource,
  mimeType = "image/jpeg",
): string | undefined {
  const value = source?.trim();

  if (!value) return undefined;
  if (DISPLAYABLE_IMAGE_SOURCE.test(value)) return value;
  // JPEG base64 commonly starts with `/9j/`; it must not be confused with a
  // root-relative application URL.
  if (value.startsWith("/") && !isLikelyBase64(value)) return value;

  return `data:${mimeType};base64,${value}`;
}

function isLikelyBase64(value: string): boolean {
  return value.length >= 16 && RAW_BASE64.test(value);
}
