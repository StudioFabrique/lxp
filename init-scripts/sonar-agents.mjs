#!/usr/bin/env node
// Relance le workflow « agents en parallèle » sur les issues SonarQube Cloud.
//
// 1. lit les issues ouvertes du projet indexé (API publique, ou jeton SONAR_TOKEN) ;
// 2. les répartit en lots sur des périmètres de fichiers disjoints ;
// 3. lance un agent par lot (claude, codex, opencode ou une commande libre),
//    avec le modèle et l'effort choisis ;
// 4. relance les vérifications locales (lint, types, tests) et affiche le bilan.
//
// Usage : npm run sonar:fix -- --help
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGE_SIZE = 500;
const SONAR_MAX_RESULTS = 10_000;

// Efforts acceptés par moteur ; `null` = valeur libre transmise telle quelle.
const ENGINES = {
  claude: { efforts: ["low", "medium", "high", "xhigh", "max"], modelHint: "sonnet, opus, claude-opus-5-5…" },
  codex: { efforts: ["minimal", "low", "medium", "high", "xhigh"], modelHint: "gpt-5-codex…" },
  opencode: { efforts: null, modelHint: "fournisseur/modèle, ex. anthropic/claude-sonnet-5-5" },
  custom: { efforts: null, modelHint: "valeur libre, injectée dans {model}" },
};

// Un lot = un périmètre de fichiers. L'ordre compte : la première règle qui
// correspond à une issue gagne. Les lots « security » et « reliability » sont
// sélectionnés par la qualité Sonar, quel que soit le chemin ; les autres par
// préfixe de chemin, ce qui garantit que deux agents ne modifient pas les
// mêmes fichiers (hors lots transverses, traités avec des changements minimes).
const LOTS = [
  {
    id: "security",
    title: "Sécurité",
    match: (i) => i.qualities.includes("SECURITY") || i.type === "VULNERABILITY" || i.type === "SECURITY_HOTSPOT",
    scope: "tout le code applicatif (modifications minimales et ciblées, sans refactor)",
    brief:
      "Corrige les vulnérabilités réelles. Pour un faux positif, laisse le code et explique pourquoi dans le compte rendu ; n'ajoute un NOSONAR que motivé, sur la ligne concernée. Un changement qui modifie le comportement de l'application (en-têtes, utilisateur Docker, droits) doit être signalé et non appliqué sans justification.",
    checks: "api: `npm run typecheck` et `npm run build` ; front: `npx tsc --noEmit` ; `bash -n` sur les scripts modifiés.",
  },
  {
    id: "reliability",
    title: "Fiabilité (bugs)",
    match: (i) => i.qualities.includes("RELIABILITY") || i.type === "BUG",
    scope: "tout le code applicatif (modifications minimales et ciblées)",
    brief:
      "Corrige les bugs réels, notamment d'accessibilité front (labels, rôles, boutons) en préservant le rendu et les tests existants (certains tests interrogent `[role=\"status\"]` via un sélecteur CSS).",
    checks: "front: `npx tsc --noEmit` et les tests des composants touchés ; api: `npm run typecheck`.",
  },
  {
    id: "front-features",
    title: "Front, features",
    match: (i) => i.file.startsWith("front/src/features/"),
    scope: "front/src/features/**",
    brief: "Ternaires imbriquées (extraire en variables, fonctions ou tables), props en `Readonly<>`, complexité cognitive, optional chaining.",
    checks: "depuis front/ : `npx tsc --noEmit`, `npx eslint <fichiers> --report-unused-disable-directives`, `npm run test -- --run <tests concernés>`.",
  },
  {
    id: "front-shared",
    title: "Front, partagé",
    match: (i) => i.file.startsWith("front/src/"),
    scope: "front/src/** hors features/",
    brief: "Mêmes règles que front-features ; traite aussi les warnings `react-refresh/only-export-components` quand le déplacement n'oblige pas à modifier `features/`.",
    checks: "depuis front/ : `npx tsc --noEmit`, `npx eslint <fichiers> --report-unused-disable-directives`, `npm run test -- --run <tests concernés>`.",
  },
  {
    id: "api-models",
    title: "API, modèles",
    match: (i) => i.file.startsWith("api/src/models/"),
    scope: "api/src/models/**",
    brief: "Complexité cognitive (extraire des fonctions), ternaires imbriquées, imports inutilisés, modernisations sans effet de comportement.",
    checks: "depuis api/ : `npm run typecheck`, `npm run build`, tests Jest ciblés (bases de test uniquement, cf. AGENTS.md).",
  },
  {
    id: "api-core",
    title: "API, services et couches HTTP",
    match: (i) => i.file.startsWith("api/"),
    scope: "api/** hors api/src/models/",
    brief: "Services, middlewares, contrôleurs, routes, helpers. Respecte la séparation routes → contrôleurs → modèles.",
    checks: "depuis api/ : `npm run typecheck`, `npm run build`, `src/helpers/tests/backend-layering.spec.ts` et les tests Jest concernés.",
  },
  {
    id: "infra",
    title: "CSS, scripts shell et CI",
    match: () => true,
    scope: "front/**/*.css|scss, init-scripts/, deployment/, Dockerfile, .github/",
    brief: "Sélecteurs CSS dupliqués (préserver la cascade, ne pas toucher aux couleurs de thème), `[[ ]]` dans les scripts bash, durcissement Docker et workflows.",
    checks: "`bash -n` sur les scripts ; depuis front/ : `npm run build`, `npm run theme:contrast` si CSS de thème touché.",
  },
];

const HELP = `Relance les agents de correction SonarQube.

Usage : npm run sonar:fix -- [options]

Projet
  --project <clé>     Clé du projet Sonar (défaut : sonar.projectKey de sonar-project.properties)
  --branch <nom>      Branche analysée (défaut : beta)
  --host <url>        Serveur Sonar (défaut : $SONAR_HOST ou https://sonarcloud.io)
                      Un projet privé demande SONAR_TOKEN dans l'environnement.

Agent
  --engine <nom>      claude | codex | opencode | custom (demandé si absent)
  --model <modèle>    Modèle du moteur (demandé si absent ; vide = défaut du moteur)
  --effort <niveau>   Effort de raisonnement (claude : low|medium|high|xhigh|max,
                      codex : minimal|low|medium|high|xhigh, opencode : variante libre)
  --command <modèle>  Pour --engine custom : commande avec {promptFile}, {model},
                      {effort}, {root}. Le prompt est aussi envoyé sur stdin.

Exécution
  --lots <ids>        Lots à traiter, séparés par des virgules (défaut : tous)
                      Lots : ${LOTS.map((l) => l.id).join(", ")}
  --parallel <n>      Agents simultanés (défaut : nombre de lots)
  --min-issues <n>    Ignore les lots avec moins de n issues (défaut : 1)
  --no-verify         Ne relance pas lint, types et tests à la fin
  --report            Affiche seulement la répartition des issues, sans agent
  --dry-run           Écrit les prompts et affiche les commandes sans les lancer
  --yes               Ne pose aucune question (utilise les valeurs par défaut)
  -h, --help          Cette aide

Exemples
  npm run sonar:fix -- --report
  npm run sonar:fix -- --engine claude --model sonnet --effort high
  npm run sonar:fix -- --engine codex --model gpt-5-codex --effort medium --lots api-models,api-core
`;

function parseArgs(argv) {
  const opts = { verify: true, yes: false, report: false, dryRun: false };
  const flags = new Set(["no-verify", "report", "dry-run", "yes", "help", "h"]);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("-")) throw new Error(`Argument inattendu : ${arg}`);
    const [rawKey, inline] = arg.replace(/^-+/, "").split(/=(.*)/s);
    const key = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (flags.has(rawKey)) {
      if (rawKey === "no-verify") opts.verify = false;
      else if (rawKey === "h" || rawKey === "help") opts.help = true;
      else opts[key] = true;
      continue;
    }
    const value = inline ?? argv[++i];
    if (value === undefined) throw new Error(`Valeur manquante pour --${rawKey}`);
    opts[key] = value;
  }
  return opts;
}

function readProjectKey() {
  const file = path.join(ROOT, "sonar-project.properties");
  if (!existsSync(file)) return undefined;
  return /^sonar\.projectKey\s*=\s*(.+)$/m.exec(readFileSync(file, "utf8"))?.[1]?.trim();
}

// Exclusions déclarées dans sonar-project.properties : on ne distribue pas aux
// agents des fichiers que Sonar ignorera de toute façon au prochain scan.
function readExclusions() {
  const file = path.join(ROOT, "sonar-project.properties");
  if (!existsSync(file)) return [];
  const line = /^sonar\.exclusions\s*=\s*(.+)$/m.exec(readFileSync(file, "utf8"))?.[1] ?? "";
  return line
    .split(",")
    .map((glob) => glob.trim())
    .filter(Boolean)
    .map((glob) => {
      const source = glob
        .replaceAll(/[.+^${}()|[\]\\]/g, String.raw`\$&`)
        .replaceAll("**/", "\u0000")
        .replaceAll("**", "\u0001")
        .replaceAll("*", "[^/]*")
        .replaceAll("\u0000", "(?:.*/)?")
        .replaceAll("\u0001", ".*");
      return new RegExp(`^${source}$`);
    });
}

async function ask(rl, question, fallback) {
  const fallbackHint = fallback ? ` [${fallback}]` : "";
  const answer = (await rl.question(`${question}${fallbackHint} : `)).trim();
  return answer || fallback || "";
}

async function sonarGet(host, apiPath, params) {
  const url = new URL(apiPath, host);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  const headers = {};
  if (process.env.SONAR_TOKEN) {
    const credentials = Buffer.from(process.env.SONAR_TOKEN + ":").toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sonar ${response.status} sur ${apiPath} : ${body.slice(0, 200)}`);
  }
  return response.json();
}

// L'API plafonne à 10 000 résultats et à 500 par page : on pagine, on dédoublonne
// par clé d'issue, et on découpe par sévérité si le total dépasse le plafond.
async function fetchIssues({ host, project, branch }) {
  const base = { componentKeys: project, branch, resolved: "false", ps: PAGE_SIZE };
  const first = await sonarGet(host, "/api/issues/search", { ...base, ps: 1 });
  const slices =
    first.total > SONAR_MAX_RESULTS
      ? ["BLOCKER", "HIGH", "MEDIUM", "LOW", "INFO"].map((impactSeverities) => ({ ...base, impactSeverities }))
      : [base];
  const byKey = new Map();
  for (const slice of slices) {
    for (let page = 1; page <= SONAR_MAX_RESULTS / PAGE_SIZE; page++) {
      const data = await sonarGet(host, "/api/issues/search", { ...slice, p: page });
      for (const raw of data.issues) {
        byKey.set(raw.key, {
          key: raw.key,
          rule: raw.rule,
          type: raw.type,
          severity: raw.severity,
          qualities: (raw.impacts ?? []).map((impact) => impact.softwareQuality),
          file: (raw.component ?? "").replace(`${project}:`, ""),
          line: raw.line ?? raw.textRange?.startLine ?? null,
          message: raw.message,
        });
      }
      if (page * PAGE_SIZE >= data.paging.total) break;
    }
  }
  return { total: first.total, issues: [...byKey.values()], capped: first.total > byKey.size };
}

function splitIntoLots(issues, exclusions) {
  const lots = new Map(LOTS.map((lot) => [lot.id, []]));
  let excluded = 0;
  for (const issue of issues) {
    if (exclusions.some((re) => re.test(issue.file))) {
      excluded++;
      continue;
    }
    const lot = LOTS.find((candidate) => candidate.match(issue));
    lots.get(lot.id).push(issue);
  }
  return { lots, excluded };
}

function countBy(issues, pick) {
  const counts = new Map();
  for (const issue of issues) counts.set(pick(issue), (counts.get(pick(issue)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function buildPrompt(lot, issuesFile, issueCount) {
  return `Projet : ${ROOT}
Lis AGENTS.md avant toute modification et respecte-le (cn(), un composant par fichier, formatNumber, chaîne routes → contrôleurs → modèles, validation serveur, etc.).

Mission : corriger les issues SonarQube du lot « ${lot.title} » (${issueCount} issues).
Périmètre autorisé : ${lot.scope}.
Les issues sont dans ${issuesFile} (JSON : rule, severity, file, line, message). Les numéros de ligne viennent de la branche analysée et peuvent avoir bougé : retrouve le code par son contenu. Le scan date de la dernière analyse de la branche : si une issue est déjà corrigée dans l'arbre de travail, ignore-la.

Consignes du lot : ${lot.brief}

Règles strictes :
- Ne modifie AUCUN fichier hors du périmètre. D'autres agents travaillent en parallèle dans le même dépôt sur les autres périmètres.
- N'exécute jamais git stash, git checkout, git restore, git reset, git clean ni aucune commande qui change l'état du dépôt : tu écraserais le travail des autres agents. Pour comparer à la base, utilise \`git show HEAD:<chemin>\` ou \`git diff\`. Ne commit pas.
- Ne change aucun comportement ni contrat d'API. Si une correction est risquée (ordre d'exécution, contrat d'erreur, regex de validation, DOM testé), ne l'applique pas et dis-le.
- Ne désactive aucun test, aucune règle de lint, et n'ajoute pas de NOSONAR pour masquer une issue réelle.
- Distingue ce que tu as réellement vérifié de ce que tu supposes.

Vérifications à lancer avant de terminer : ${lot.checks}

Compte rendu final, court : issues corrigées par règle, issues volontairement laissées avec la raison, commandes de vérification lancées et leur résultat, limites.`;
}

function engineCommand(opts, promptFile, prompt) {
  const model = opts.model || "";
  const effort = opts.effort || "";
  switch (opts.engine) {
    case "claude": {
      const args = ["-p", "--permission-mode", opts.permissionMode ?? "acceptEdits"];
      if (model) args.push("--model", model);
      if (effort) args.push("--effort", effort);
      // Autorise les commandes de vérification sans ouvrir tout le shell.
      args.push(
        "--allowedTools",
        "Read",
        "Edit",
        "Write",
        "Bash(npm run *)",
        "Bash(npm test *)",
        "Bash(npx *)",
        "Bash(git diff *)",
        "Bash(git show *)",
        "Bash(git status *)",
        "Bash(git log *)",
        "Bash(bash -n *)",
        "Bash(NODE_OPTIONS=* ./node_modules/.bin/dotenv *)",
      );
      return { cmd: "claude", args, stdin: prompt };
    }
    case "codex": {
      const args = ["exec", "-C", ROOT, "-s", "workspace-write"];
      if (model) args.push("-m", model);
      if (effort) args.push("-c", `model_reasoning_effort="${effort}"`);
      args.push("-");
      return { cmd: "codex", args, stdin: prompt };
    }
    case "opencode": {
      const args = ["run", "--dir", ROOT];
      if (model) args.push("-m", model);
      if (effort) args.push("--variant", effort);
      args.push(prompt);
      return { cmd: "opencode", args, stdin: "" };
    }
    default: {
      if (!opts.command) throw new Error("--engine custom demande --command.");
      const filled = opts.command
        .replaceAll("{promptFile}", promptFile)
        .replaceAll("{model}", model)
        .replaceAll("{effort}", effort)
        .replaceAll("{root}", ROOT);
      return { cmd: "bash", args: ["-c", filled], stdin: prompt };
    }
  }
}

function run({ cmd, args, stdin }, logFile, cwd = ROOT) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(cmd, args, { cwd, stdio: ["pipe", "pipe", "pipe"] });
    const chunks = [];
    child.stdout.on("data", (data) => chunks.push(data));
    child.stderr.on("data", (data) => chunks.push(data));
    child.on("error", (error) => {
      writeFileSync(logFile, `${Buffer.concat(chunks)}\n[erreur de lancement] ${error.message}\n`);
      resolve({ code: 127, seconds: 0 });
    });
    child.on("close", (code) => {
      writeFileSync(logFile, Buffer.concat(chunks));
      resolve({ code: code ?? 1, seconds: Math.round((Date.now() - started) / 1000) });
    });
    child.stdin.on("error", () => {});
    child.stdin.end(stdin);
  });
}

async function pool(items, limit, worker) {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await worker(items[index]);
      }
    }),
  );
  return results;
}

const VERIFICATIONS = [
  { name: "front lint", cwd: "front", cmd: "npm", args: ["run", "lint", "--silent"] },
  { name: "front types", cwd: "front", cmd: "npx", args: ["tsc", "--noEmit"] },
  { name: "front tests", cwd: "front", cmd: "npm", args: ["run", "test", "--silent", "--", "--run"] },
  { name: "api types", cwd: "api", cmd: "npm", args: ["run", "typecheck", "--silent"] },
  { name: "api couches", cwd: "api", cmd: "bash", args: ["-c", "NODE_OPTIONS=--experimental-vm-modules ./node_modules/.bin/dotenv -e .env.test -- ./node_modules/.bin/jest --runInBand --runTestsByPath src/helpers/tests/backend-layering.spec.ts"] },
];

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return console.log(HELP);

  const interactive = process.stdin.isTTY && !opts.yes && !opts.report;
  const rl = interactive ? createInterface({ input: process.stdin, output: process.stdout }) : null;
  try {
    const project = opts.project ?? readProjectKey();
    if (!project) throw new Error("Clé du projet inconnue : utiliser --project <clé>.");
    const branch = opts.branch ?? "beta";
    const host = opts.host ?? process.env.SONAR_HOST ?? "https://sonarcloud.io";

    console.log(`Lecture des issues de ${project} (${branch}) sur ${host}…`);
    const { total, issues, capped } = await fetchIssues({ host, project, branch });
    const exclusions = readExclusions();
    const { lots, excluded } = splitIntoLots(issues, exclusions);

    console.log(`\n${total} issues ouvertes, ${issues.length} lues, ${excluded} dans des chemins exclus.`);
    if (capped) console.log("Attention : l'API a plafonné les résultats, la liste est incomplète.");
    console.log("\nLot".padEnd(20) + "Issues  Règles les plus fréquentes");
    for (const lot of LOTS) {
      const list = lots.get(lot.id);
      const top = countBy(list, (i) => i.rule).slice(0, 3).map(([rule, n]) => `${rule} (${n})`).join(", ");
      console.log(`${lot.id.padEnd(19)} ${String(list.length).padStart(6)}  ${top}`);
    }
    if (opts.report) return;

    const minIssues = Number(opts.minIssues ?? 1);
    const wanted = opts.lots ? new Set(opts.lots.split(",").map((id) => id.trim())) : null;
    for (const id of wanted ?? []) {
      if (!LOTS.some((lot) => lot.id === id)) throw new Error(`Lot inconnu : ${id}`);
    }
    const selected = LOTS.filter((lot) => (!wanted || wanted.has(lot.id)) && lots.get(lot.id).length >= minIssues);
    if (selected.length === 0) return console.log("\nAucun lot à traiter.");

    opts.engine ??= rl ? await ask(rl, "\nMoteur (claude, codex, opencode, custom)", "claude") : "claude";
    if (!ENGINES[opts.engine]) throw new Error(`Moteur inconnu : ${opts.engine}`);
    const engine = ENGINES[opts.engine];
    if (opts.model === undefined && rl) opts.model = await ask(rl, `Modèle (${engine.modelHint}, vide = défaut)`, "");
    if (opts.effort === undefined && rl) {
      const effortChoices = engine.efforts ? ` (${engine.efforts.join("|")})` : "";
      opts.effort = await ask(rl, `Effort${effortChoices}, vide = défaut`, "");
    }
    if (opts.effort && engine.efforts && !engine.efforts.includes(opts.effort)) {
      throw new Error(`Effort « ${opts.effort} » invalide pour ${opts.engine} : ${engine.efforts.join(", ")}.`);
    }
    if (opts.engine === "custom" && !opts.command && rl) opts.command = await ask(rl, "Commande ({promptFile}, {model}, {effort})", "");

    const stamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
    const runDir = path.join(ROOT, ".sonar-agents", stamp);
    mkdirSync(runDir, { recursive: true });

    const jobs = selected.map((lot) => {
      const list = lots.get(lot.id);
      const issuesFile = path.join(runDir, `${lot.id}.issues.json`);
      const promptFile = path.join(runDir, `${lot.id}.prompt.md`);
      const logFile = path.join(runDir, `${lot.id}.log`);
      writeFileSync(issuesFile, JSON.stringify(list, null, 2));
      const prompt = buildPrompt(lot, issuesFile, list.length);
      writeFileSync(promptFile, prompt);
      return { lot, count: list.length, logFile, command: engineCommand(opts, promptFile, prompt) };
    });

    console.log(`\nMoteur ${opts.engine}, modèle ${opts.model || "(défaut)"}, effort ${opts.effort || "(défaut)"}.`);
    console.log(`Prompts et journaux : ${path.relative(ROOT, runDir)}/`);
    if (opts.dryRun) {
      for (const job of jobs) {
        console.log(`\n[${job.lot.id}] ${job.count} issues\n  ${job.command.cmd} ${job.command.args.map((a) => (a.length > 60 ? "<prompt>" : a)).join(" ")}`);
      }
      return console.log("\n--dry-run : aucun agent lancé.");
    }

    if (rl) {
      const confirm = await ask(rl, `\nLancer ${jobs.length} agent(s) en parallèle sur le dépôt courant ? (o/N)`, "n");
      if (!/^(o|oui|y|yes)$/i.test(confirm)) return console.log("Annulé.");
    }

    const limit = Number(opts.parallel ?? jobs.length);
    const results = await pool(jobs, limit, async (job) => {
      console.log(`  → ${job.lot.id} démarré (${job.count} issues)`);
      const result = await run(job.command, job.logFile);
      console.log(`  ${result.code === 0 ? "✓" : "✗"} ${job.lot.id} terminé en ${result.seconds} s (code ${result.code})`);
      return { id: job.lot.id, ...result };
    });

    let verifyFailures = 0;
    if (opts.verify) {
      console.log("\nVérifications locales…");
      for (const check of VERIFICATIONS) {
        const result = await run({ cmd: check.cmd, args: check.args, stdin: "" }, path.join(runDir, `verify-${check.name.replaceAll(" ", "-")}.log`), path.join(ROOT, check.cwd));
        if (result.code !== 0) verifyFailures++;
        console.log(`  ${result.code === 0 ? "✓" : "✗"} ${check.name}`);
      }
    }

    console.log("\nBilan");
    for (const r of results) {
      const relativeLog = path.relative(ROOT, path.join(runDir, `${r.id}.log`));
      console.log(`  ${r.code === 0 ? "ok " : "ÉCHEC"} ${r.id} (log : ${relativeLog})`);
    }
    console.log("\nRien n'est commité. Relisez `git diff`, puis relancez un scan Sonar pour mesurer l'effet.");
    process.exitCode = results.some((r) => r.code !== 0) || verifyFailures > 0 ? 1 : 0;
  } finally {
    rl?.close();
  }
}

try {
  await main();
} catch (error) {
  console.error(`Erreur : ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
