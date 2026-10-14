/** Rebuild the offline FeelingFeedback fixture using the existing Hyperframes esbuild. */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const here = path.dirname(fileURLToPath(import.meta.url));
const esbuildPath = process.env.HYPERFRAMES_ESBUILD;
if (!esbuildPath) throw new Error('Set HYPERFRAMES_ESBUILD to the installed esbuild module.');
const { build } = await import(esbuildPath);
const temporary = await mkdtemp(path.join(tmpdir(), 'andria-care-'));
try {
  const output = path.join(temporary, 'care.cjs');
  await build({ entryPoints: [path.join(here, 'care-fixture.tsx')], outfile: output, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', nodePaths: [path.resolve(here, '../../front/node_modules')], define: { 'import.meta.env': '{}' }, logLevel: 'warning' });
  execFileSync(process.execPath, [output], { cwd: here, stdio: 'inherit' });
} finally {
  await rm(temporary, { recursive: true, force: true });
}
