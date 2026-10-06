/** Compile genuine LXP presentational components and their Tailwind/DaisyUI CSS. */
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdtemp, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
const front = path.resolve(here, '../../front');
const requireFront = createRequire(path.join(front, 'package.json'));
const esbuildPath = process.env.HYPERFRAMES_ESBUILD;
if (!esbuildPath) throw new Error('Set HYPERFRAMES_ESBUILD to the installed Hyperframes esbuild module.');
const { build } = await import(esbuildPath);
const temp = await mkdtemp(path.join(tmpdir(),'andria-fixtures-'));
const fixtureBundle = path.join(temp,'ui-fixtures.cjs');
await build({entryPoints:[path.join(here,'ui-fixtures.tsx')], outfile:fixtureBundle, bundle:true, platform:'node', format:'cjs', jsx:'automatic', define:{'import.meta.env':'{}'}, nodePaths:[path.join(front,'node_modules')], logLevel:'warning'});
execFileSync(process.execPath, [fixtureBundle], {cwd:here, stdio:'inherit'});
await unlink(fixtureBundle);
// Remove the obsolete generated bundle from the first build; it is not a runtime asset.
await unlink(path.join(here,'assets/ui-fixtures.cjs')).catch(error => {
  if (error.code !== 'ENOENT') throw error;
});
const postcss = requireFront('postcss');
const tailwind = requireFront('@tailwindcss/postcss');
const appCss = await readFile(path.join(front,'src/index.css'),'utf8');
const themes = [...appCss.matchAll(/@plugin "daisyui\/theme"\s*\{[^}]+\}/g)].map(match => match[0]).filter(block => /name:\s*"(classic|ocean|linen|sage|classic-dark|aurora|ember|abyss)"/.test(block));
// The film themes plus every theme enabled by default, shown by the instance settings.
if (themes.length !== 8) throw new Error('Expected the eight default theme definitions in the LXP stylesheet.');
const source = `@import "tailwindcss" source(none);
@plugin "daisyui" { include: button, list, badge, range, textarea, modal, input; themes: false; }
@source "../../brag-output/composition/assets/ui-fragments.json";
@source "../../brag-output/composition/assets/relationship-fragments.json";
@source "../../brag-output/composition/assets/care-fragments.json";
@source "../../brag-output/composition/assets/instance-fragments.json";
@source "../../brag-output/composition/assets/sidebar-fragments.json";
@source "../../brag-output/composition/assets/chatbot-launcher.html";
${themes.join('\n')}`;
const result = await postcss([tailwind({base:front})]).process(source, {from:path.join(front,'src/index.css'),to:path.join(here,'assets/lxp.css')});
// Interactive browser-clock transitions are replaced by the film's seekable GSAP timeline.
result.root.walkDecls(decl => {
  if (/^(transition|animation)(-|$)/.test(decl.prop)) decl.remove();
  if (decl.prop === '--font-sans' || decl.prop === '--default-font-family') decl.value = 'system-ui, sans-serif';
  if (decl.prop === '--font-mono' || decl.prop === '--default-mono-font-family') decl.value = 'monospace';
  if (decl.prop === 'font-family' && /SFMono|emoji/i.test(decl.value)) decl.value = decl.value.includes('SFMono') ? 'monospace' : 'system-ui, sans-serif';
});
result.root.walkAtRules('keyframes',rule => rule.remove());
await writeFile(path.join(here,'assets/lxp.css'),result.root.toString());
console.log('LXP components and theme CSS compiled without API calls.');
