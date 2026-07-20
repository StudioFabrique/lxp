const DISPLAYABLE_IMAGE_SOURCE = /^(?:blob:|data:image\/|https?:\/\/)/i;
const RAW_BASE64 = /^[a-z0-9+/]+={0,2}$/i;

/**
 * Converts a stored image into a source that can be assigned directly to an
 * HTML `src` attribute. API consumers therefore never have to guess whether a
 * value is raw base64 or an already complete URL.
 */
export function imageToDataUrl(
  image: Buffer | Uint8Array | string | null | undefined,
  mimeType?: string
): string | null {
  if (!image) return null;

  const buffer = typeof image === "string" ? undefined : Buffer.from(image);
  const value =
    typeof image === "string" ? image.trim() : buffer!.toString("base64");

  if (!value) return null;
  if (DISPLAYABLE_IMAGE_SOURCE.test(value)) return value;
  // JPEG base64 commonly starts with `/9j/`; test base64 before treating a
  // leading slash as an application-relative URL.
  if (value.startsWith("/") && !isLikelyBase64(value)) return value;

  return `data:${mimeType ?? detectImageMimeType(buffer)};base64,${value}`;
}

function isLikelyBase64(value: string): boolean {
  return value.length >= 16 && RAW_BASE64.test(value);
}

function detectImageMimeType(buffer?: Buffer): string {
  if (!buffer) return "image/jpeg";
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return "image/png";
  }
  if (buffer.subarray(0, 4).toString("ascii") === "GIF8") return "image/gif";
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return "image/jpeg";
}
