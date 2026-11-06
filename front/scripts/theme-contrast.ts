/**
 * Audit et correction des contrastes des thèmes DaisyUI avec Leonardo.
 *
 *   npm run theme:contrast        # rapport, code de sortie 1 si une mesure échoue
 *   npm run theme:contrast:fix    # corrige les feuilles de style puis relance le rapport
 *
 * Voir `src/themes/theme-contrast.ts` pour les mesures et la méthode de correction.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  applyThemeFixes,
  auditTheme,
  computeThemeFixes,
  parseThemes,
} from "../src/themes/theme-contrast.ts";

const STYLESHEETS = ["../src/index.css", "../src/themes/light-themes.css", "../src/themes/dark-themes.css"].map(
  (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url)),
);

// Affichage en console uniquement : formatNumber est réservé à l'interface.
const roundTwo = (value: number) => Math.round(value * 100) / 100;

const shouldFix = process.argv.includes("--fix");
const read = () => STYLESHEETS.map((path) => readFileSync(path, "utf8"));

if (shouldFix) {
  const sources = read();
  const updated = [...sources];
  for (const theme of parseThemes(sources)) {
    const fixes = computeThemeFixes(theme);
    if (Object.keys(fixes).length === 0) continue;
    updated.forEach((css, index) => {
      updated[index] = applyThemeFixes(css, theme.name, fixes);
    });
    console.log(`${theme.name}: ${Object.entries(fixes).map(([name, value]) => `${name} ${value}`).join(", ")}`);
  }
  updated.forEach((css, index) => {
    if (css !== sources[index]) writeFileSync(STYLESHEETS[index], css);
  });
}

const themes = parseThemes(read());
let failures = 0;
for (const theme of themes) {
  const results = auditTheme(theme);
  const failing = results.filter((result) => !result.passes);
  failures += failing.length;
  const worst = Math.min(...results.map((result) => result.ratio / result.minimum));
  console.log(
    `${failing.length === 0 ? "OK  " : "FAIL"} ${theme.name.padEnd(13)} ${theme.scheme.padEnd(5)} ${results.length} mesures, marge minimale x${roundTwo(worst)}`,
  );
  for (const result of failing) {
    console.log(`       ${result.label}: ${roundTwo(result.ratio)} (minimum ${result.minimum})`);
  }
}
console.log(`\n${themes.length} thèmes, ${failures} mesure(s) sous le seuil.`);
process.exit(failures === 0 ? 0 : 1);
