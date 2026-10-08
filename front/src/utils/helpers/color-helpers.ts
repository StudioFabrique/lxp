const bgImageGradient = (imageUrl: string) =>
  `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0)), url(${imageUrl})`;

const parseColor = (color: string): [number, number, number] | null => {
  const value = color.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    return [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16)) as [number, number, number];
  }
  const rgb = /^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i.exec(value);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null;
};

const linear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/**
 * Couleur de texte lisible (sombre ou claire) sur un fond donné, selon sa
 * luminance relative ; `undefined` si le fond n'est pas une couleur reconnue
 * (hexadécimale ou `rgb()`).
 */
const readableTextColor = (background: string): string | undefined => {
  const rgb = parseColor(background);
  if (!rgb) return undefined;
  const luminance =
    0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2]);
  // Seuil où le texte noir et le texte blanc ont le même contraste.
  return luminance > 0.179 ? "#1a1a1a" : "#ffffff";
};

export { bgImageGradient, readableTextColor };
