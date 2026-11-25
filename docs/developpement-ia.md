# Démarrer le service IA en développement

Le service ANDRIA-IA fournit le chatbot, la génération de quiz et les
indicateurs prédictifs. Il lit les contenus du LXP et stocke son index dans
PostgreSQL avec pgvector. En développement, il n'est plus à cloner ni à
construire : le Compose local télécharge l'image publiée sur Docker Hub
(`studiostep/lxp-ai`).

## Architecture locale

```text
navigateur
    │
    ▼
LXP :5173 / API :3000 (sur la machine)
    │                 ┌───────────────────────────┐
    ├── PostgreSQL ──►│ ai :8000 (conteneur)      │
    ├── MongoDB ─────►│ watcher + quiz + RAG      │
    └── uploads ─────►│ PostgreSQL/pgvector IA    │
                      └───────────────────────────┘
```

Les conteneurs viennent de `deployment/compose.yml` et `ai.compose.yml`,
complétés par `local.compose.yml` qui publie les ports sur `127.0.0.1`. Le
service lit `api/uploads/activities`, monté dans le conteneur.

## 1. Renseigner les clés Mistral

Le service démarre seulement si les deux clés existent et que
`DISABLE_AI_FEATURES` n'est pas `true`.

- **Avec Infisical** : les clés sont dans le dossier `/runtime` de
  l'environnement configuré. `npm run init` indique si elles sont reçues, sans
  rien demander ni écrire.
- **Sans Infisical** : `npm run init` demande d'abord si vous activez le service
  IA, puis les deux clés. Un refus écrit `DISABLE_AI_FEATURES=true` dans
  `api/.env`. Vous pouvez aussi les ajouter à la main :

```dotenv
MISTRAL_STUDENT_API_KEY=<cle-dev>
MISTRAL_CONTENT_API_KEY=<cle-dev>
DISABLE_AI_FEATURES=false
```

`DOCKER_IA_AUTH_SECRET` (API) est transmis au service sous le nom `SECRET_KEY` :
il n'y a qu'une valeur à maintenir. N'utilisez aucune clé de production.

## 2. Démarrer

```bash
npm run init           # première fois : bases, migrations, triggers
npm run services:up    # ensuite : démarre les bases et le service IA
npm run dev
```

`services:up` télécharge l'image (`docker compose pull`), crée les tables
`andria_*` (`python -m app.db_provision`) puis démarre le service. Sans accès à
l'image (`docker login` nécessaire si le dépôt Docker Hub est privé), le script
explique la cause, rappelle les variables concernées (`LXP_AI_IMAGE`,
`LXP_AI_IMAGE_TAG`) et demande s'il faut continuer sans IA. Sans terminal
interactif, il continue sans IA.

L'image est publiée en `linux/amd64` et `linux/arm64` : Docker choisit la variante
native, y compris sur Mac Apple Silicon.

Pour choisir une autre version : `LXP_AI_IMAGE_TAG=<tag> npm run services:up`.
Le premier démarrage télécharge aussi les modèles Hugging Face dans le volume
`lxp-local_hf_cache` et peut prendre plusieurs minutes.

## 3. Vérifier le service et le watcher

```bash
curl http://localhost:8000/health
```

Il doit répondre `{"status":"ok"}`. Modifiez ensuite un cours, une leçon ou une
activité dans le LXP : `docker compose -p lxp-local logs -f ai` doit afficher
un événement `INGEST`. La suppression d'un cours produit un événement `PRUNE`.

Le schéma SQL exposé au service conserve volontairement les noms historiques
PascalCase (`"Course"`, `"Lesson"`, `"Activity"`), figés par les `@@map` du
contrat Prisma 8.

## Arrêter ou couper l'IA

```bash
npm run services:down                # arrête les conteneurs, les données restent
```

Pour travailler sans le service, mettez `DISABLE_AI_FEATURES=true` (dans
`api/.env` ou Infisical) : il n'est plus démarré et l'API coupe les fonctions IA.

## Problèmes courants

| Symptôme                                 | Contrôle                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| « Service IA non démarré »               | Clés Mistral absentes ou `DISABLE_AI_FEATURES=true`.                            |
| « Image indisponible »                   | Faites `docker login` avec un compte autorisé sur `studiostep/lxp-ai`.          |
| « no matching manifest » | Le tag visé n'est pas publié pour votre architecture : choisissez un autre `LXP_AI_IMAGE_TAG`. |
| Réponse IA `401`                         | Redémarrez le service après un changement de `DOCKER_IA_AUTH_SECRET`.           |
| Watcher sans événement                   | `npm run notify-triggers --prefix api`, puis `docker compose -p lxp-local restart ai`. |
| Anciens volumes `lxp-api_*`              | Ils ne sont plus utilisés : voir l'avertissement affiché par `npm run init`.    |

La liste des variables se trouve dans
[Variables d'environnement](variables-environnement.md#andria-ia-en-développement).
