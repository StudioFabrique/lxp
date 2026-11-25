# Correction des issues SonarQube avec des agents

`npm run sonar:fix` lit les issues ouvertes du projet SonarQube Cloud, les répartit
en lots sur des périmètres de fichiers disjoints et lance un agent par lot, en
parallèle, avec le moteur, le modèle et l'effort choisis. Rien n'est commité :
relire `git diff` reste la dernière étape.

## Utilisation

```bash
# Répartition des issues par lot, sans lancer d'agent
npm run sonar:report

# Choix interactif du moteur, du modèle et de l'effort, puis confirmation
npm run sonar:fix

# Tout en options
npm run sonar:fix -- --engine claude --model sonnet --effort high
npm run sonar:fix -- --engine codex --model gpt-5-codex --effort medium --lots api-models,api-core
npm run sonar:fix -- --engine opencode --model anthropic/claude-sonnet-5-5 --effort high

# Voir les commandes et écrire les prompts sans rien lancer
npm run sonar:fix -- --dry-run --engine claude
```

`npm run sonar:fix -- --help` liste toutes les options.

| Option | Rôle |
|---|---|
| `--project` | Clé du projet Sonar. Défaut : `sonar.projectKey` de `sonar-project.properties`. |
| `--branch` | Branche analysée. Défaut : `beta`. |
| `--engine` | `claude`, `codex`, `opencode` ou `custom`. |
| `--model` | Modèle transmis au moteur. Vide : défaut du moteur. |
| `--effort` | `claude` : `low`, `medium`, `high`, `xhigh`, `max`. `codex` : `minimal` à `xhigh`. `opencode` : variante libre. |
| `--command` | Avec `--engine custom` : commande avec `{promptFile}`, `{model}`, `{effort}`, `{root}`. |
| `--lots` | Lots à traiter, séparés par des virgules. |
| `--parallel` | Nombre d'agents simultanés. |
| `--no-verify` | Ne relance pas lint, types et tests à la fin. |

Si le moteur, le modèle ou l'effort manquent et que le terminal est interactif,
la commande les demande. Avec `--yes`, elle utilise les valeurs par défaut.

## Lots

Les lots sont définis dans `init-scripts/sonar-agents.mjs` (`LOTS`). Une issue va dans
le premier lot qui correspond : `security` et `reliability` sont choisis par la
qualité Sonar, les autres par préfixe de chemin (`front-features`, `front-shared`,
`api-models`, `api-core`, `infra`). Deux agents ne modifient donc pas les mêmes
fichiers, sauf `security` et `reliability`, qui font des changements minimes.

## Ce que la commande garantit, et ce qu'elle ne garantit pas

- Les chemins listés dans `sonar.exclusions` (`sonar-project.properties`) sont écartés :
  Sonar les ignorera au prochain scan.
- Les issues viennent **du dernier scan de la branche**. Pour un projet privé, définir
  `SONAR_TOKEN` (et `SONAR_HOST` hors SonarQube Cloud). Pousser la branche et attendre
  l'analyse avant de relancer pour partir de chiffres à jour.
- Chaque agent reçoit l'interdiction de lancer `git stash`, `checkout`, `restore`,
  `reset` ou `clean` : lancés en parallèle dans le même dépôt, ils écraseraient le
  travail des autres.
- Les vérifications finales (lint, types front et API, tests front, test des couches API)
  signalent un échec, sans dire s'il vient d'un agent ou existait déjà : comparer avec
  `HEAD` en cas de doute.
- Le mode `claude` utilise `--permission-mode acceptEdits` et une liste d'outils
  autorisés (`Read`, `Edit`, `Write`, `npm run`, `npx`, lectures `git`). Le mode `codex`
  utilise le bac à sable `workspace-write`.

Les prompts, les issues de chaque lot et les journaux sont écrits dans
`.sonar-agents/<horodatage>/` (ignoré par git).
