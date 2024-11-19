export default function getDaisyuiBgThemeColor(
  themeColor: DaisyuiThemeColor,
): string {
  const primaryHsl = getComputedStyle(
    document.documentElement,
  ).getPropertyValue(getThemePropertyValue(themeColor));

  return hslToHex(primaryHsl);
}

export function getRandomDaisyuiBgThemeColor(): string {
  const themeColors: DaisyuiThemeColor[] = [
    "primary",
    "primary-focus",
    "secondary",
    "secondary-focus",
    "accent",
    "accent-focus",
    "neutral",
    "neutral-focus",
    "info",
    "warning",
    "error",
    "success",
  ];

  const useGradient = Math.random() > 0.5;

  let selectedColor: string;
  if (useGradient) {
    const color1 = getDaisyuiBgThemeColor(
      themeColors[Math.floor(Math.random() * themeColors.length)],
    );
    const color2 = getDaisyuiBgThemeColor(
      themeColors[Math.floor(Math.random() * themeColors.length)],
    );
    selectedColor = `linear-gradient(135deg, ${color1}, ${color2})`;
  } else {
    selectedColor = getDaisyuiBgThemeColor(
      themeColors[Math.floor(Math.random() * themeColors.length)],
    );
  }

  return selectedColor;
}

type DaisyuiThemeColor =
  | "primary"
  | "primary-focus"
  | "primary-content"
  | "secondary"
  | "secondary-focus"
  | "secondary-content"
  | "accent"
  | "accent-focus"
  | "accent-content"
  | "neutral"
  | "neutral-focus"
  | "neutral-content"
  | "base-100"
  | "base-200"
  | "base-300"
  | "base-content"
  | "info"
  | "info-content"
  | "success"
  | "success-content"
  | "warning"
  | "warning-content"
  | "error"
  | "error-content";

function getThemePropertyValue(themeColor: DaisyuiThemeColor): string {
  switch (themeColor) {
    case "primary":
      return "--p";
    case "primary-focus":
      return "--pf";
    case "primary-content":
      return "--pc";
    case "secondary":
      return "--s";
    case "secondary-focus":
      return "--sf";
    case "secondary-content":
      return "--sc";
    case "accent":
      return "--a";
    case "accent-focus":
      return "--af";
    case "accent-content":
      return "--ac";
    case "neutral":
      return "--n";
    case "neutral-focus":
      return "--nf";
    case "neutral-content":
      return "--nc";
    case "base-100":
      return "--b1";
    case "base-200":
      return "--b2";
    case "base-300":
      return "--b3";
    case "base-content":
      return "--bc";
    case "info":
      return "--in";
    case "info-content":
      return "--inc";
    case "success":
      return "--su";
    case "success-content":
      return "--suc";
    case "warning":
      return "--wa";
    case "warning-content":
      return "--wac";
    case "error":
      return "--er";
    case "error-content":
      return "--erc";
    default:
      return "--p";
  }
}

function hslToHex(hsl: string) {
  const [h, s, l] = hsl
    .trim()
    .split(" ")
    .map((val) => parseFloat(val.replace("%", "")));

  const C = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l / 100 - C / 2;

  let [r, g, b] = [0, 0, 0];

  if (h >= 0 && h < 60) {
    [r, g, b] = [C, X, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [X, C, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, C, X];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, X, C];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [X, 0, C];
  } else {
    [r, g, b] = [C, 0, X];
  }

  const toHex = (val: number) => {
    const hex = Math.round((val + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
