# Démarrer ANDRIA-IA en développement

Le dépôt privé
[`StudioFabrique/ANDRIA-IA`](https://github.com/StudioFabrique/ANDRIA-IA)
fournit le chatbot, la génération de quiz et les indicateurs prédictifs. Il lit
les contenus du LXP et stocke son index dans PostgreSQL avec pgvector.

## Architecture locale

```text
navigateur
    │
    ▼
LXP :5173 / API :3000
    │                 ┌────────────────────────┐
    ├── PostgreSQL ──►│ ANDRIA-IA :8000        │
    ├── MongoDB ─────►│ watcher + quiz + RAG   │
    └── uploads ─────►│ PostgreSQL/pgvector IA │
                      └────────────────────────┘
```

Les dépôts doivent partager le même dossier parent. Le Compose d’ANDRIA-IA
monte `../lxp/api/uploads/activities` et rejoint le réseau Docker `lxp`.

```text
projets/
├── lxp/
└── ANDRIA-IA/
```

## 1. Démarrer le LXP

Depuis `lxp/` :

```bash
npm run init
npm run dev
```

`npm run init` crée les trois bases, le réseau Docker et les triggers qui
signalent les changements de cours au watcher.

Pour un projet déjà initialisé, gardez les données et relancez les services :

```bash
docker compose -f api/docker-compose.yml up -d
npm run dev
```

## 2. Cloner et configurer ANDRIA-IA

```bash
cd ..
git clone --branch prod git@github.com:StudioFabrique/ANDRIA-IA.git
cd ANDRIA-IA
cp env.example .env
```

Complétez `.env` avec cette configuration locale :

```dotenv
MISTRAL_STUDENT_API_KEY=<cle-dev>
MISTRAL_CONTENT_API_KEY=<cle-dev>
MISTRAL_MODEL=mistral-small-latest

DATABASE_URL=postgresql://andria:andria@lxp-ai-postgres:5432/lxp_ai
ANDRIA_AI_DB_URL=postgresql://andria:andria@lxp-ai-postgres:5432/lxp_ai
LXP_DB_URL=postgresql://postgres:postgres@lxp-prisma:5432/lxp
LXP_MONGO_URL=mongodb://root:root@lxp-mongo:27017/lxp?authSource=admin

LXP_UPLOADS_DIR=/lxp/api/uploads/activities
LXP_PUBLIC_BASE=http://localhost:3000
DB_INGEST_MIN_WORDS=20
DB_WATCH_RECONNECT_DELAY=5

SECRET_KEY=secret-key
DEV_BYPASS_AUTH=false
```

Récupérez les clés Mistral dans Infisical EU, projet LXP, environnement `dev`,
chemin `/runtime`. Le Compose d’ANDRIA-IA lit un fichier `.env` local : gardez
ce fichier hors de Git et n’utilisez aucune clé de production.

Les identifiants des URL doivent correspondre à `lxp/api/.env` :

- `POSTGRES_*` alimente `LXP_DB_URL` ;
- `MONGO_ADMIN_*` alimente `LXP_MONGO_URL` ;
- `ANDRIA_POSTGRES_*` alimente `DATABASE_URL` et `ANDRIA_AI_DB_URL`.

`SECRET_KEY` et `DOCKER_IA_AUTH_SECRET` dans `lxp/api/.env` doivent contenir le
même secret. Les noms `lxp-prisma`, `lxp-mongo` et `lxp-ai-postgres` sont des
noms de conteneurs. Depuis ANDRIA-IA, n’utilisez pas les ports hôte `5500`,
`5501` ou `27000`.

## 3. Premier démarrage

Depuis `ANDRIA-IA/` :

```bash
docker compose build
docker compose run --rm ai-service python -m app.db_provision
docker compose up -d
docker compose logs -f ai-service
```

Le provisionnement crée les tables `andria_*`. Relancez-le après avoir supprimé
le volume PostgreSQL IA.

## 4. Vérifier le service et le watcher

```bash
curl http://localhost:8000/health
curl http://localhost:8000/health/watcher
```

Le premier endpoint doit renvoyer `{"status":"ok"}`. Le second doit indiquer
`"status":"ok"` et `"thread_alive":true`.

Modifiez ensuite un cours, une leçon ou une activité dans le LXP. Les logs
d’ANDRIA-IA doivent afficher un événement `INGEST`. La suppression d’un cours
produit un événement `PRUNE`.

## Démarrages suivants

```bash
cd lxp
docker compose -f api/docker-compose.yml up -d
npm run dev

cd ../ANDRIA-IA
docker compose up -d
```

## Couper l’IA en local

Pour travailler sans ANDRIA-IA, définissez cette valeur dans `lxp/api/.env`,
puis relancez l’API :

```dotenv
DISABLE_AI_FEATURES=true
```

## Problèmes courants

| Symptôme                                | Contrôle                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| `network lxp not found`                 | Démarrez les bases du LXP avant ANDRIA-IA.                                   |
| Connexion PostgreSQL ou MongoDB refusée | Utilisez les noms de conteneurs et leurs ports internes.                     |
| Réponse IA `401`                        | Alignez `SECRET_KEY` et `DOCKER_IA_AUTH_SECRET`.                             |
| Tables `andria_*` absentes              | Relancez `python -m app.db_provision` avec `docker compose run`.             |
| Watcher sans événement                  | Lancez `npm run notify-triggers --prefix api`, puis redémarrez `ai-service`. |

La liste des variables et de leurs valeurs par défaut se trouve dans
[Variables d’environnement](variables-environnement.md#andria-ia-en-développement).
