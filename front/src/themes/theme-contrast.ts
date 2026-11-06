import {
  contrast,
  convertColorValue,
  createScale,
} from "@adobe/leonardo-contrast-colors";

/**
 * Mesure et correction des contrastes WCAG 2.x des thèmes DaisyUI avec Leonardo
 * (`@adobe/leonardo-contrast-colors`). Le module est pur (aucun accès fichier) :
 * `scripts/theme-contrast.ts` l'utilise pour auditer et corriger les feuilles de
 * style, et `theme-contrast.test.ts` pour empêcher toute régression.
 */

export type Rgb = [number, number, number];

/** Seuil AA du texte courant (WCAG 1.4.3). */
export const TEXT_MIN_CONTRAST = 4.5;
/** Seuil AA des composants d'interface et des indicateurs de focus (WCAG 1.4.11). */
export const UI_MIN_CONTRAST = 3;
/** Marge de génération : évite qu'un arrondi de la valeur hexadécimale repasse sous le seuil. */
const GENERATION_MARGIN = 0.05;
/** Opacité des textes secondaires (`text-base-content/60`), la plus employée dans l'interface. */
export const SECONDARY_TEXT_ALPHA = 0.6;

export type ThemeVariables = Record<string, string>;
export type ThemeDefinition = {
  name: string;
  scheme: "light" | "dark";
  /** Variables du thème, complétées par celles des blocs `:where([data-theme])` partagés. */
  variables: ThemeVariables;
};

export type ContrastResult = {
  theme: string;
  label: string;
  ratio: number;
  minimum: number;
  passes: boolean;
};

type ColorRef = { variable: string; alpha?: number };
type ContrastCheck = {
  label: string;
  foreground: ColorRef;
  background: string;
  minimum: number;
};

/* ------------------------------------------------------------------ */
/* Couleurs                                                            */
/* ------------------------------------------------------------------ */

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const parseHex = (value: string): Rgb | null => {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (char) => char + char)
      : match[1];
  return [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16)) as Rgb;
};

export const toHex = (rgb: Rgb): `#${string}` =>
  `#${rgb
    .map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, "0"))
    .join("")}`;

const toLinear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (value: number) =>
  255 * (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055);

const toOklab = ([r, g, b]: Rgb): [number, number, number] => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const fromOklab = ([lightness, a, b]: [number, number, number]): Rgb => {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((channel) => clamp(fromLinear(clamp(channel, 0, 1)), 0, 255)) as Rgb;
};

/** Rapport de contraste WCAG 2.x calculé par Leonardo. */
export const contrastRatio = (foreground: Rgb, background: Rgb): number =>
  // Leonardo signe le rapport selon que le premier plan est plus clair ou plus foncé.
  Math.abs(contrast(foreground, background));

/** Composition d'une couleur semi-transparente sur son fond, comme le fait le navigateur (sRGB). */
const composite = (foreground: Rgb, background: Rgb, alpha: number): Rgb =>
  foreground.map(
    (channel, index) => alpha * channel + (1 - alpha) * background[index],
  ) as Rgb;

/* ------------------------------------------------------------------ */
/* Lecture des feuilles de style                                       */
/* ------------------------------------------------------------------ */

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const parseDeclarations = (body: string): ThemeVariables => {
  const variables: ThemeVariables = {};
  for (const [, name, value] of stripComments(body).matchAll(
    /(--[\w-]+)\s*:\s*([^;]+);/g,
  )) {
    variables[name] = value.trim();
  }
  return variables;
};

const THEME_BLOCK = /@plugin\s+"daisyui\/theme"\s*\{([^}]*)\}/g;
const SHARED_BLOCK = /:where\(([^)]*data-theme[^)]*)\)\s*\{([^}]*)\}/g;

/** Thèmes DaisyUI déclarés dans les feuilles de style, avec les variables partagées par groupe. */
export const parseThemes = (sources: string[]): ThemeDefinition[] => {
  const shared = new Map<string, ThemeVariables>();
  const themes: ThemeDefinition[] = [];

  for (const css of sources) {
    for (const [, selectors, body] of css.matchAll(SHARED_BLOCK)) {
      const variables = parseDeclarations(body);
      for (const [, name] of selectors.matchAll(/data-theme="([^"]+)"/g)) {
        shared.set(name, { ...shared.get(name), ...variables });
      }
    }
  }

  for (const css of sources) {
    for (const [, body] of css.matchAll(THEME_BLOCK)) {
      const clean = stripComments(body);
      const name = /name:\s*"([^"]+)"/.exec(clean)?.[1];
      const scheme = /color-scheme:\s*(light|dark)/.exec(clean)?.[1];
      if (!name || (scheme !== "light" && scheme !== "dark")) continue;
      themes.push({
        name,
        scheme,
        variables: { ...shared.get(name), ...parseDeclarations(body) },
      });
    }
  }

  return themes;
};

const splitTopLevel = (value: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
};

/** Résout une valeur : hexadécimal, `white`/`black`, `var(--x)` et `color-mix(in oklab, …)`. */
const resolveValue = (
  value: string,
  variables: ThemeVariables,
  depth = 0,
): Rgb | null => {
  if (depth > 8) return null;
  const trimmed = value.trim();
  if (trimmed === "white") return [255, 255, 255];
  if (trimmed === "black") return [0, 0, 0];
  const hex = parseHex(trimmed);
  if (hex) return hex;

  const reference = /^var\((--[\w-]+)\)$/.exec(trimmed);
  if (reference) {
    const target = variables[reference[1]];
    return target === undefined ? null : resolveValue(target, variables, depth + 1);
  }

  const mix = /^color-mix\((.*)\)$/.exec(trimmed);
  if (mix) {
    const [space, first, second] = splitTopLevel(mix[1]);
    if (space !== "in oklab" || !first || !second) return null;
    const readStop = (stop: string) => {
      const percent = /\s+(\d+(?:\.\d+)?)%$/.exec(stop);
      return {
        color: resolveValue(percent ? stop.slice(0, percent.index) : stop, variables, depth + 1),
        percent: percent ? Number(percent[1]) : undefined,
      };
    };
    const a = readStop(first);
    const b = readStop(second);
    if (!a.color || !b.color) return null;
    const weightA = (a.percent ?? 100 - (b.percent ?? 50)) / 100;
    const weightB = (b.percent ?? 100 - (a.percent ?? 50)) / 100;
    const total = weightA + weightB;
    const labA = toOklab(a.color);
    const labB = toOklab(b.color);
    return fromOklab(
      labA.map(
        (channel, index) => (channel * weightA + labB[index] * weightB) / total,
      ) as [number, number, number],
    );
  }

  return null;
};

export const resolveColor = (
  theme: ThemeDefinition,
  variable: string,
  overrides: ThemeVariables = {},
): Rgb | null => {
  const variables = { ...theme.variables, ...overrides };
  const value = variables[variable];
  return value === undefined ? null : resolveValue(value, variables);
};

/* ------------------------------------------------------------------ */
/* Mesures                                                             */
/* ------------------------------------------------------------------ */

const BASE_BACKGROUNDS = ["--color-base-100", "--color-base-200"];
const BRANDS = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
] as const;
/** Couleurs de marque employées comme texte (`text-primary`, `text-error`, `btn-outline`…). */
const TEXT_BRANDS = ["primary", "info", "success", "warning", "error"] as const;

const CHECKS: ContrastCheck[] = [
  ...["--color-base-100", "--color-base-200", "--color-base-300"].map(
    (background) => ({
      label: `Texte courant sur ${background.slice(8)}`,
      foreground: { variable: "--color-base-content" },
      background,
      minimum: TEXT_MIN_CONTRAST,
    }),
  ),
  ...BASE_BACKGROUNDS.map((background) => ({
    label: `Texte secondaire (60 %) sur ${background.slice(8)}`,
    foreground: { variable: "--color-base-content", alpha: SECONDARY_TEXT_ALPHA },
    background,
    minimum: TEXT_MIN_CONTRAST,
  })),
  ...BRANDS.map((brand) => ({
    label: `${brand}-content sur ${brand}`,
    foreground: { variable: `--color-${brand}-content` },
    background: `--color-${brand}`,
    minimum: TEXT_MIN_CONTRAST,
  })),
  ...TEXT_BRANDS.flatMap((brand) =>
    BASE_BACKGROUNDS.map((background) => ({
      label: `Texte ${brand} sur ${background.slice(8)}`,
      foreground: { variable: `--color-${brand}` },
      background,
      minimum: TEXT_MIN_CONTRAST,
    })),
  ),
  ...BASE_BACKGROUNDS.map((background) => ({
    label: `Contour de focus (primary) sur ${background.slice(8)}`,
    foreground: { variable: "--color-primary" },
    background,
    minimum: UI_MIN_CONTRAST,
  })),
  ...["--sidebar-bg", "--sidebar-surface", "--sidebar-hover"].map(
    (background) => ({
      label: `Texte de la barre latérale sur ${background.slice(2)}`,
      foreground: { variable: "--sidebar-content" },
      background,
      minimum: TEXT_MIN_CONTRAST,
    }),
  ),
  {
    label: "Entrée active de la barre latérale",
    foreground: { variable: "--sidebar-active-content" },
    background: "--sidebar-active",
    minimum: TEXT_MIN_CONTRAST,
  },
];

const measure = (
  theme: ThemeDefinition,
  check: ContrastCheck,
  overrides: ThemeVariables,
): number | null => {
  const foreground = resolveColor(theme, check.foreground.variable, overrides);
  const background = resolveColor(theme, check.background, overrides);
  if (!foreground || !background) return null;
  return contrastRatio(
    check.foreground.alpha === undefined
      ? foreground
      : composite(foreground, background, check.foreground.alpha),
    background,
  );
};

export const auditTheme = (
  theme: ThemeDefinition,
  overrides: ThemeVariables = {},
): ContrastResult[] =>
  CHECKS.flatMap((check) => {
    const ratio = measure(theme, check, overrides);
    return ratio === null
      ? []
      : [
          {
            theme: theme.name,
            label: check.label,
            ratio,
            minimum: check.minimum,
            passes: ratio >= check.minimum,
          },
        ];
  });

/* ------------------------------------------------------------------ */
/* Corrections avec Leonardo                                           */
/* ------------------------------------------------------------------ */

const SCALE_SWATCHES = 600;

/**
 * Variante de `current` qui satisfait `ratiosFor` : Leonardo génère l'échelle de
 * luminosité de la couleur (même teinte, de blanc à noir) et on retient la nuance
 * conforme la plus proche de l'originale, pour changer le moins possible le thème.
 */
const nearestPassingShade = (
  current: Rgb,
  ratiosFor: (candidate: Rgb) => number[],
  minimum: number,
): Rgb => {
  if (Math.min(...ratiosFor(current)) >= minimum) return current;

  const target = minimum + GENERATION_MARGIN;
  const originalLightness = toOklab(current)[0];
  const scale = createScale({
    swatches: SCALE_SWATCHES,
    colorKeys: [toHex(current)],
    colorSpace: "OKLCH",
    fullScale: true,
  });

  let best: { rgb: Rgb; distance: number } | null = null;
  for (const swatch of scale) {
    const { r, g, b } = convertColorValue(swatch, "RGB", true) as Record<
      string,
      number
    >;
    const rgb: Rgb = [r, g, b];
    if (Math.min(...ratiosFor(rgb)) < target) continue;
    const distance = Math.abs(toOklab(rgb)[0] - originalLightness);
    if (!best || distance < best.distance) best = { rgb, distance };
  }

  // Le noir et le blanc ferment l'échelle : à défaut de nuance, on garde la meilleure extrémité.
  return (
    best?.rgb ??
    ([[0, 0, 0], [255, 255, 255]] as Rgb[]).reduce((a, b) =>
      Math.min(...ratiosFor(a)) >= Math.min(...ratiosFor(b)) ? a : b,
    )
  );
};

/**
 * Valeurs corrigées (hexadécimal) à écrire dans le thème pour que toutes les
 * mesures passent. Retourne uniquement les variables modifiées.
 */
export const computeThemeFixes = (theme: ThemeDefinition): ThemeVariables => {
  const fixes: ThemeVariables = {};

  const read = (variable: string) => resolveColor(theme, variable, fixes);
  const fix = (
    variable: string,
    ratiosFor: (candidate: Rgb) => number[],
    minimum: number,
  ) => {
    const current = read(variable);
    if (!current) return;
    const next = nearestPassingShade(current, ratiosFor, minimum);
    if (toHex(next) !== toHex(current)) fixes[variable] = toHex(next);
  };

  /** Rapports d'un candidat employé comme premier plan, éventuellement semi-transparent. */
  const against = (
    backgrounds: string[],
    alpha?: number,
  ) => (candidate: Rgb) =>
    backgrounds.flatMap((background) => {
      const rgb = read(background);
      if (!rgb) return [];
      return [
        contrastRatio(
          alpha === undefined ? candidate : composite(candidate, rgb, alpha),
          rgb,
        ),
      ];
    });

  // 1. Texte courant et secondaire : la valeur la plus restrictive décide.
  fix(
    "--color-base-content",
    (candidate) => [
      ...against(["--color-base-100", "--color-base-200", "--color-base-300"])(candidate),
      ...against(BASE_BACKGROUNDS, SECONDARY_TEXT_ALPHA)(candidate),
    ],
    TEXT_MIN_CONTRAST,
  );

  // 2. Couleurs de marque utilisées comme texte sur les fonds de page.
  for (const brand of TEXT_BRANDS) {
    fix(`--color-${brand}`, against(BASE_BACKGROUNDS), TEXT_MIN_CONTRAST);
  }

  // 3. Texte posé sur chaque couleur de marque, une fois celles-ci arrêtées.
  for (const brand of BRANDS) {
    fix(`--color-${brand}-content`, against([`--color-${brand}`]), TEXT_MIN_CONTRAST);
  }

  // 4. Barre latérale : le texte est réglé sur le fond principal, puis les surfaces
  // (survol, entrée active) sont ajustées pour rester lisibles sous ce texte.
  fix("--sidebar-content", against(["--sidebar-bg"]), TEXT_MIN_CONTRAST);
  for (const surface of ["--sidebar-surface", "--sidebar-hover"]) {
    fix(
      surface,
      (candidate) => {
        const content = read("--sidebar-content");
        return content ? [contrastRatio(content, candidate)] : [];
      },
      TEXT_MIN_CONTRAST,
    );
  }
  fix("--sidebar-active-content", against(["--sidebar-active"]), TEXT_MIN_CONTRAST);

  return fixes;
};

/* ------------------------------------------------------------------ */
/* Réécriture des feuilles de style                                    */
/* ------------------------------------------------------------------ */

/**
 * Applique `fixes` au bloc `@plugin "daisyui/theme"` du thème : remplace la
 * variable si elle y est déclarée, l'ajoute sinon (elle l'emporte alors sur les
 * blocs `:where([data-theme])` partagés, dont la spécificité est nulle).
 */
export const applyThemeFixes = (
  css: string,
  themeName: string,
  fixes: ThemeVariables,
): string =>
  css.replace(THEME_BLOCK, (block, body: string) => {
    if (new RegExp(`name:\\s*"${themeName}"`).test(stripComments(body)) === false) {
      return block;
    }
    let updated = block;
    for (const [variable, value] of Object.entries(fixes)) {
      const declaration = new RegExp(`(${variable}\\s*:\\s*)[^;]+;`);
      if (declaration.test(updated)) {
        updated = updated.replace(declaration, `$1${value};`);
        continue;
      }
      const indent = /\n([ \t]+)--/.exec(updated)?.[1] ?? "  ";
      updated = updated.replace(
        /\s*\}$/,
        `\n${indent}${variable}: ${value};\n}`,
      );
    }
    return updated;
  });
