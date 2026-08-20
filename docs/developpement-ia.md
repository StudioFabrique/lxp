# Service IA et synchronisation en développement

Le service IA vit dans le dépôt privé `ia-lxp`. Il utilise PostgreSQL/pgvector
pour ses données et lit les cours dans la base PostgreSQL du LXP. Un watcher
réindexe les cours après chaque modification d'un cours, d'une leçon ou d'une
activité.

## Prérequis

- le LXP initialisé avec `npm run init` ;
- le dépôt `ia-lxp` cloné à côté du dépôt `lxp` ;
- deux clés API Mistral. Une même clé peut servir aux deux usages en
  développement.

```text
projets/
├── lxp/
└── ia-lxp/
```

Le LXP doit démarrer ses bases en premier. Son fichier
`api/docker-compose.yml` crée le réseau Docker `lxp` utilisé par le conteneur
IA.

## 1. Initialiser le LXP

Depuis le dépôt `lxp` :

```bash
npm run init
```

Cette commande installe aussi les triggers PostgreSQL qui publient les
changements sur le canal `andria_lxp_changes`.

Dans un terminal réservé au LXP :

```bash
npm run dev
```

Le frontend écoute sur <http://localhost:5173> et l'API sur
<http://localhost:3000>.

## 2. Configurer le service IA

Depuis le dépôt `ia-lxp` :

```bash
cp .env.example .env
```

Renseigner `ia-lxp/.env` :

```dotenv
MISTRAL_STUDENT_API_KEY=<cle-mistral>
MISTRAL_CONTENT_API_KEY=<cle-mistral>
MISTRAL_MODEL=mistral-small-latest

DATABASE_URL=postgresql://andria:andria@lxp-ai-postgres:5432/lxp_ai
ANDRIA_AI_DB_URL=postgresql://andria:andria@lxp-ai-postgres:5432/lxp_ai
LXP_DB_URL=postgresql://postgres:postgres@lxp-prisma:5432/lxp

LXP_UPLOADS_DIR=/lxp/api/uploads/activities
LXP_PUBLIC_BASE=http://localhost:3000
DB_INGEST_MIN_WORDS=20

SECRET_KEY=secret-key
DEV_BYPASS_AUTH=True
```

Les identifiants des deux URL PostgreSQL doivent correspondre aux valeurs de
`lxp/api/.env` :

- `POSTGRES_*` pour `LXP_DB_URL` ;
- `ANDRIA_POSTGRES_*` pour `DATABASE_URL` et `ANDRIA_AI_DB_URL`.

Les noms `lxp-prisma` et `lxp-ai-postgres` désignent les conteneurs. Le service
IA ne doit pas utiliser `localhost:5500` ou `localhost:5501` depuis son propre
conteneur.

`SECRET_KEY` doit avoir la même valeur que `DOCKER_IA_AUTH_SECRET` dans
`lxp/api/.env`.

## 3. Provisionner et démarrer le service IA

Le premier démarrage doit créer les tables `andria_*` :

```bash
docker compose build
docker compose run --rm ai-service python -m app.db_provision
docker compose up -d
```

Le provisionnement accepte plusieurs exécutions. Il faut le relancer après la
suppression du volume PostgreSQL `pg_ai`.

Suivre le démarrage :

```bash
docker compose logs -f ai-service
```

Le service charge ses modèles, compare les cours présents dans le LXP avec son
index, puis démarre le watcher. Le premier démarrage peut prendre plusieurs
minutes, selon la machine et le volume de cours.

Les démarrages suivants demandent une seule commande :

```bash
docker compose up -d
```

## 4. Vérifier les services

```bash
curl http://localhost:8000/health
curl http://localhost:8000/health/watcher
```

Champs à contrôler dans les réponses :

```json
{"status":"ok"}
```

```json
{
  "status": "ok",
  "thread_alive": true
}
```

`last_tick_at` indique la dernière comparaison complète de l'index. Le watcher
attend les événements PostgreSQL entre deux comparaisons, donc une valeur
ancienne ne signale pas une panne si `thread_alive` vaut `true`.

Contrôler les conteneurs :

```bash
cd ../lxp/api
docker compose ps

cd ../../ia-lxp
docker compose ps
```

Le LXP doit afficher `lxp-prisma`, `lxp-ai-postgres` et `lxp-mongo`. Le dépôt IA
doit afficher `lxp-ai`.

## 5. Tester la synchronisation

Laisser les logs du service IA ouverts :

```bash
docker compose logs -f ai-service
```

Créer ou modifier un cours, une leçon ou une activité depuis le LXP. Le watcher
doit écrire une ligne `INGEST` avec le slug du cours. La suppression d'un cours
produit une ligne `PRUNE`.

Consulter l'état de l'index :

```bash
docker exec lxp-ai-postgres psql -U andria -d lxp_ai -c \
  'SELECT course_slug, last_indexed_at, n_windows FROM andria_course_index_state ORDER BY last_indexed_at DESC;'
```

La synchronisation suit ce parcours :

```text
Modification dans le LXP
        │
        ▼
Trigger sur Course, Lesson ou Activity
        │  pg_notify('andria_lxp_changes', ...)
        ▼
Watcher du service IA
        │
        ▼
Réindexation du cours dans lxp_ai
```

## 6. Interroger le modèle d'indicateurs

Le service IA expose un modèle qui estime l'issue d'un parcours — `graduate`,
`fail` ou `dropout` — et applique des règles d'alerte déterministes. Le LXP
l'interroge depuis la fiche d'un apprenant, `Administration > Utilisateurs >
un apprenant`, avec le bouton « Interroger le modèle IA ».

Côté API :

```text
POST /v1/indicators/:userId/prediction?from=&to=
```

L'appel calcule les indicateurs de la plateforme sur la fenêtre demandée, les
traduit vers les onze variables du modèle, puis relaie la réponse du service IA.
La permission `stats:read` est requise et les apprenants sont refusés, y compris
sur leur propre fiche : un pronostic d'abandon relève de l'accompagnement.

Les noms diffèrent de part et d'autre, le modèle ayant été entraîné sur le jeu de
données OULAD :

| Variable du modèle | Indicateur du LXP | Conversion |
| --- | --- | --- |
| `session_time` | `session_time` | millisecondes → minutes |
| `mood_proxy` | `mood` | aucune (échelle 1-5) |
| `monthly_connection_days` | `monthly_connection_days` | aucune |
| `days_since_last_activity` | `days_since_last_activity` | aucune |
| `time_on_content` | `time_on_content` | millisecondes → minutes |
| `quiz_interaction_count` | `quiz_interactions` | aucune |
| `chatbot_proxy` | `chatbot_interactions` | aucune |
| `score_evolution` | `correct_answer_rate_evolution` | points de pourcentage sur la période → pente journalière |
| `assessment_count` | tentatives de quiz terminées sur la période | aucune |
| `cumul_assessments` | tentatives de quiz terminées au total | aucune |
| `pass_rate` | part des tentatives à 40 % de bonnes réponses ou plus | aucune |

Une variable sans donnée est transmise à `null`, jamais à zéro, et la réponse en
donne la raison. Le nombre de variables réellement transmises est affiché sous la
prédiction : elle se lit à la lumière de ce qui a pu être mesuré.

Le service IA répond en erreur tant qu'aucun modèle n'a été entraîné. Depuis le
dépôt `ia-lxp` :

```bash
curl -X POST "http://localhost:8000/indicators/retrain?force=true"
```

L'interface affiche alors « Le modèle de prédiction est indisponible ».

## Réinstaller les triggers

`npm run init` installe les triggers. Pour les réinstaller sans réinitialiser les
données :

Depuis le dépôt `lxp` :

```bash
cd api
npm run notify-triggers
```

Vérifier leur présence :

```bash
docker exec lxp-prisma psql -U postgres -d lxp -c \
  "SELECT tgname FROM pg_trigger WHERE tgname LIKE 'andria_%';"
```

La requête doit retourner `andria_course_ch`, `andria_lesson_ch` et
`andria_activity_ch`.

## Problèmes courants

### Le réseau `lxp` est introuvable

Démarrer les bases LXP avant le service IA :

```bash
cd /chemin/vers/lxp/api
docker compose up -d
```

### Le service IA ne joint pas PostgreSQL

Utiliser les noms de conteneurs et le port interne `5432` dans `ia-lxp/.env`.
Les ports `5500` et `5501` servent aux programmes lancés sur la machine.

### Le watcher ne reçoit aucun événement

Réinstaller les triggers, redémarrer le service IA, puis contrôler ses logs :

```bash
cd /chemin/vers/lxp/api
npm run notify-triggers

cd /chemin/vers/ia-lxp
docker compose restart ai-service
docker compose logs --tail=100 ai-service
```

Le démarrage effectue une comparaison complète. Il récupère les changements
survenus pendant l'arrêt du watcher.

### Les tables `andria_*` manquent

```bash
cd /chemin/vers/ia-lxp
docker compose run --rm ai-service python -m app.db_provision
docker compose restart ai-service
```
