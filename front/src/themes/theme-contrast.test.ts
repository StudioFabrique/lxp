import { describe, expect, it } from "vitest";

import { readFileSync } from "node:fs";
import {
  applyThemeFixes,
  auditTheme,
  computeThemeFixes,
  contrastRatio,
  parseThemes,
  resolveColor,
  TEXT_MIN_CONTRAST,
  type ThemeDefinition,
} from "./theme-contrast";

const roundTwo = (value: number) => Math.round(value * 100) / 100;

// Lecture directe : Vitest ne renvoie pas le contenu des feuilles de style importées avec `?raw`.
const readStylesheet = (relativePath: string) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8");

const themes = parseThemes([
  readStylesheet("../index.css"),
  readStylesheet("./light-themes.css"),
  readStylesheet("./dark-themes.css"),
]);

describe("contraste des thèmes", () => {
  it("détecte les 32 thèmes déclarés", () => {
    expect(themes).toHaveLength(32);
    expect(themes.filter((theme) => theme.scheme === "light")).toHaveLength(16);
    expect(themes.filter((theme) => theme.scheme === "dark")).toHaveLength(16);
  });

  it.each(themes.map((theme) => [theme.name, theme] as const))(
    "%s respecte le niveau AA (npm run theme:contrast:fix pour corriger)",
    (_name, theme) => {
      const failing = auditTheme(theme)
        .filter((result) => !result.passes)
        .map(
          (result) =>
            `${result.label}: ${roundTwo(result.ratio)} < ${result.minimum}`,
        );
      expect(failing).toEqual([]);
    },
  );
});

describe("lecture des feuilles de style", () => {
  const theme: ThemeDefinition = {
    name: "test",
    scheme: "light",
    variables: {
      "--color-neutral": "#000000",
      "--sidebar-bg": "var(--color-neutral)",
      "--sidebar-hover": "color-mix(in oklab, var(--color-neutral) 50%, white)",
    },
  };

  it("résout var() et color-mix()", () => {
    expect(resolveColor(theme, "--sidebar-bg")).toEqual([0, 0, 0]);
    const hover = resolveColor(theme, "--sidebar-hover");
    expect(hover?.[0]).toBeGreaterThan(90);
    expect(hover?.[0]).toBeLessThan(130);
  });

  it("applique les variables partagées sous celles du thème", () => {
    const [shared] = parseThemes([
      ':where([data-theme="x"]) { --color-info-content: #111111; --color-error-content: #222222; }',
      '@plugin "daisyui/theme" { name: "x"; color-scheme: dark; --color-error-content: #333333; }',
    ]);
    expect(shared.variables["--color-info-content"]).toBe("#111111");
    expect(shared.variables["--color-error-content"]).toBe("#333333");
  });
});

describe("correction avec Leonardo", () => {
  const failingCss = `@plugin "daisyui/theme" {
  name: "faible"; color-scheme: light;
  --color-primary: #334155; --color-primary-content: #fff; --color-secondary: #a78bfa; --color-secondary-content: #1e1b4b;
  --color-accent: #06b6d4; --color-accent-content: #083344; --color-neutral: #475569; --color-neutral-content: #fff;
  --color-base-100: #fff; --color-base-200: #f8fafc; --color-base-300: #e2e8f0; --color-base-content: #94a3b8;
  --color-info: #0369a1; --color-info-content: #fff; --color-success: #86efac; --color-success-content: #fff;
  --color-warning: #fde047; --color-warning-content: #fff; --color-error: #dc2626; --color-error-content: #fff;
  --sidebar-bg: var(--color-neutral); --sidebar-content: var(--color-neutral-content);
  --sidebar-surface: var(--color-neutral); --sidebar-hover: var(--color-neutral);
  --sidebar-active: var(--color-neutral); --sidebar-active-content: var(--color-neutral-content);
}`;

  it("corrige un thème insuffisant et conserve la teinte", () => {
    const [before] = parseThemes([failingCss]);
    expect(auditTheme(before).some((result) => !result.passes)).toBe(true);

    const fixes = computeThemeFixes(before);
    const [after] = parseThemes([applyThemeFixes(failingCss, "faible", fixes)]);

    expect(auditTheme(after).filter((result) => !result.passes)).toEqual([]);
    // Les couleurs déjà conformes ne bougent pas.
    expect(fixes["--color-primary"]).toBeUndefined();
    expect(fixes["--color-neutral"]).toBeUndefined();
    expect(after.variables["--color-primary"]).toBe("#334155");
  });

  it("ajoute une variable absente du bloc du thème", () => {
    const css = '@plugin "daisyui/theme" {\n  name: "t"; color-scheme: light;\n  --color-info: #000;\n}';
    expect(applyThemeFixes(css, "t", { "--color-info-content": "#ffffff" })).toContain(
      "--color-info-content: #ffffff;",
    );
  });

  it("mesure un rapport de contraste positif", () => {
    expect(contrastRatio([255, 255, 255], [0, 0, 0])).toBeGreaterThanOrEqual(TEXT_MIN_CONTRAST);
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeGreaterThan(0);
  });
});
