# Plateforme ANDRIA LXP

Ce dépôt contient l'API Node.js et le frontend de la plateforme. En mode
développement, PostgreSQL, PostgreSQL/pgvector et MongoDB tournent dans Docker,
tandis que l'API et le frontend tournent directement sur la machine. Le service
IA est fourni par le dépôt frère `ia-lxp` et tourne dans un conteneur séparé.

## Prérequis

- Node.js 22 et npm ;
- Docker avec Docker Compose ;
- le dépôt `ia-lxp` placé à côté de ce dépôt :

```text
Downloads/
├── lxp/
└── ia-lxp/
```

- deux clés API Mistral valides pour utiliser les fonctionnalités IA. En
  développement, une même clé peut être utilisée pour les deux audiences.

## Initialisation en mode développement

Deux modes d'initialisation sont disponibles :

- `npm run init` restaure les données fictives présentes dans les dumps ;
- `npm run init-empty` repart avec des bases LXP vides.

Les deux scripts installent les dépendances, créent `api/.env` et `front/.env`
depuis les fichiers `env.example`, démarrent les trois bases Docker, appliquent
les migrations Prisma et installent les triggers PostgreSQL utilisés par le
watcher du service IA.

> `npm run init-empty` supprime les données PostgreSQL, MongoDB et les fichiers
> d'activités existants. Ne pas l'utiliser pour conserver un environnement déjà
> rempli.

### 1. Initialiser le LXP

Depuis la racine de `lxp` :

```bash
npm run init-empty
```

Pour obtenir les données de démonstration à la place :

```bash
npm run init
```

Si les scripts ne sont pas exécutables :

```bash
chmod +x ./init-scripts/*.sh
```

À la fin de l'initialisation, les conteneurs suivants doivent être démarrés :

```bash
cd api
docker compose ps
```

Les services attendus sont `lxp-prisma`, `lxp-ai-postgres` et `lxp-mongo`.

### 2. Vérifier la configuration locale du LXP

Le script copie automatiquement `api/env.example` vers `api/.env`. Pour un
lancement de l'API sur la machine, les connexions principales doivent utiliser
les ports exposés sur `localhost` :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5500/lxp"
MONGO_LOCAL_URL="mongodb://root:root@localhost:27000/lxp?authSource=admin"
DOCKER_IA_API_BASE_URL="http://localhost:8000"
```

Les identifiants présents dans `api/.env` doivent rester cohérents avec ceux des
services définis dans `api/docker-compose.yml`.

### 3. Démarrer l'API et le frontend

Depuis la racine de `lxp` :

```bash
npm run dev
```

Le frontend devient accessible sur <http://localhost:5173> et l'API sur
<http://localhost:3000>.

### 4. Configurer le service `ia-lxp`

Le service IA tourne dans Docker. Ses URL PostgreSQL doivent donc utiliser les
noms des conteneurs et le port interne `5432`, jamais `localhost:5500` ou
`localhost:5501`.

Créer ou compléter `/chemin/vers/ia-lxp/.env` :

```env
MISTRAL_STUDENT_API_KEY=...
MISTRAL_CONTENT_API_KEY=...
MISTRAL_MODEL=mistral-small-latest

DATABASE_URL=postgresql://andria:andria@lxp-ai-postgres:5432/lxp_ai
ANDRIA_AI_DB_URL=postgresql://andria:andria@lxp-ai-postgres:5432/lxp_ai
LXP_DB_URL=postgresql://postgres:postgres@lxp-prisma:5432/lxp

LXP_UPLOADS_DIR=/lxp/api/uploads/activities
LXP_PUBLIC_BASE=http://host.docker.internal:3000

SECRET_KEY=change-me
DEV_BYPASS_AUTH=True
```

Les mots de passe doivent correspondre à `ANDRIA_POSTGRES_PASSWORD` et
`POSTGRES_PASSWORD` dans `lxp/api/.env`. Le Compose de `ia-lxp` charge ce fichier
avec `env_file: .env` et monte `lxp/api/uploads/activities` en lecture seule.

### 5. Provisionner puis démarrer le service IA

Lors du premier démarrage, ou après suppression du volume `pg_ai`, créer les
tables `andria_*` avant de lancer durablement le service :

```bash
cd ../ia-lxp
docker compose build
docker compose run --rm ai-service python -m app.db_provision
docker compose up -d
docker compose logs -f ai-service
```

Aux démarrages suivants, si la base `lxp_ai` existe toujours, seule cette commande
est nécessaire :

```bash
docker compose up -d
```

Le réseau Docker externe `lxp` est créé par `lxp/api/docker-compose.yml`. Il faut
donc toujours initialiser ou démarrer les bases LXP avant le conteneur IA.

### 6. Vérifier l'environnement

```bash
curl http://localhost:3000
curl http://localhost:8000/health
```

Pour vérifier les conteneurs et consulter les erreurs éventuelles :

```bash
cd /chemin/vers/lxp/api
docker compose ps

cd /chemin/vers/ia-lxp
docker compose ps
docker compose logs --tail=100 ai-service
```

## Résumé des ports en développement

| Service | Adresse depuis la machine |
|---|---|
| Frontend LXP | `http://localhost:5173` |
| API LXP | `http://localhost:3000` |
| API IA | `http://localhost:8000` |
| PostgreSQL LXP | `localhost:5500` |
| PostgreSQL IA/pgvector | `localhost:5501` |
| MongoDB | `localhost:27000` |

Depuis les conteneurs, PostgreSQL LXP est accessible via
`lxp-prisma:5432` et PostgreSQL IA via `lxp-ai-postgres:5432`.

## Nettoyage des données

La commande suivante arrête les bases, supprime les volumes PostgreSQL LXP,
PostgreSQL IA/pgvector et MongoDB, puis nettoie les fichiers d'activités :

```bash
npm run clean
```

Après ce nettoyage, il faut relancer le provisionnement des tables `andria_*`
décrit plus haut avant de démarrer le service IA.

## Identifiants de démonstration

Ces comptes sont disponibles uniquement après `npm run init` avec les dumps de
démonstration.

### Administrateur

- Email : `admin@studio.eco`
- Mot de passe : `Abcdef@123456`

### Étudiant

- Email : `apprenant@studio.eco`
- Mot de passe : `Abcdef@123456`

## Sauvegarder les bases de développement

```bash
./init-scripts/dump-data.sh
```

## Fichiers utiles

- `api/env.example` : exemple de configuration locale ;
- `api/docker-compose.yml` : bases de développement ;
- `init-scripts/init.sh` : initialisation avec données fictives ;
- `init-scripts/init-empty.sh` : initialisation avec bases LXP vides ;
- `init-scripts/clean-project-data.sh` : nettoyage des données locales ;
- `api/src/scripts/andria_notify_triggers.sql` : triggers de synchronisation IA.

### Endpoint public des activités en développement

```text
http://localhost:3000/activities/{id_activité}
```

---

## Spécifications du projet

### Les objectifs du projet

- Améliorer l'efficacité de l'apprentissage : En offrant un contenu de qualité et en permettant aux utilisateurs de personnaliser leur expérience d'apprentissage.

- Augmenter l'engagement des utilisateurs : En offrant des opportunités d'interaction et de collaboration avec du contenu et d'autres utilisateurs.

- Améliorer la gestion de l'apprentissage : Ce projet LXP peut également viser à améliorer la gestion de l'apprentissage au sein de l'organisation en offrant un outil centralisé pour la gestion de l'apprentissage. L'outil MAHADA IA vient en appui/complémentaire pour mieux gérer l'évolution des apprenants

- Améliorer la satisfaction des utilisateurs : En offrant une expérience d'apprentissage agréable et en répondant aux besoins en apprentissage des utilisateurs.
- Augmenter l'adoption de la plateforme : en offrant un contenu de qualité et en promouvant l'utilisation de la plateforme auprès des utilisateurs.
- Favoriser la collaboration et le partage d'informations : En utilisant des outils de collaboration et de partage de contenu.
- Améliorer la gestion des compétences : en créant des outils de suivi et de développement des compétences des utilisateurs.
- Favoriser l'apprentissage continu : Encourager l'apprentissage continu en offrant un accès facile à du contenu d'apprentissage et en permettant aux utilisateurs de suivre leur progrès d'apprentissage. - [  
   Canvas improvements](app://obsidian.md/index.html#canvas-improvements) — Canvas settings, readonly mode, global search results, and more.
- [Bugfixes](app://obsidian.md/index.html#bugfixes) — fixes for Export to PDF, mermaid graph colors, and list numbering.

### Caractéristiques de LXP

- Personnalisation : une LXP doit permettre aux utilisateurs de personnaliser leur expérience d'apprentissage en fonction de leurs intérêts et de leurs objectifs d'apprentissage.

- Recommandations de contenu : une LXP doit être capable de recommander du contenu en fonction de l'historique d'apprentissage et des préférences de l'utilisateur.

- Interactivité : une LXP doit offrir des opportunités d'interaction avec du contenu et d'autres utilisateurs, par exemple en permettant aux utilisateurs de poser des questions ou de participer à des discussions.

- Accessibilité : une LXP doit être accessible sur différents appareils et doit être facile à utiliser pour tous les utilisateurs, y compris ceux qui ont des besoins spéciaux.

- Suivi de l'apprentissage : une LXP doit permettre aux utilisateurs de suivre leurs progrès d'apprentissage et de définir des objectifs d'apprentissage à atteindre.

- Intégration de contenu : une LXP doit être capable d'intégrer du contenu provenant de différentes sources, comme des cours en ligne, des articles, des vidéos, etc.

- Fonctionnalités de collaboration : une LXP doit permettre aux utilisateurs de travailler ensemble et de partager du contenu et des idées

- Gamification : Pour rendre l'apprentissage plus engageant et amusant. Cela peut inclure des points, des badges, des niveaux, des challenges, etc. Par exemple: un badge pour chaque compétence validée.

- Analyse de l'apprentissage : Des fonctionnalités d'analyse d'apprentissage qui permettent aux utilisateurs et aux administrateurs de suivre les progrès de l'apprentissage et de mieux comprendre les forces et les faiblesses des utilisateurs.

- Outils de création de contenu : Ces outils permettent aux utilisateurs de créer du contenu personnalisé pour leur propre apprentissage ou pour partager avec d'autres utilisateurs.

- Support de la formation en direct : Par exemple en permettant aux formateurs de diffuser du contenu en direct et de répondre aux questions des utilisateurs en temps réel.

- Support de la formation mobile : certaines LXP offrent un support de la formation mobile, permettant aux utilisateurs d'accéder au contenu et aux outils d'apprentissage depuis n'importe quel appareil mobile.

- Fonctionnalités de gestion de projet : Pour permettre aux utilisateurs de planifier et de suivre l'avancement de leur apprentissage.
- Support de la formation en groupe : certaines LXP offrent un support de la formation en groupe, permettant aux utilisateurs de travailler ensemble et de partager du contenu et des idées.
- Fonctionnalités de social learning : communiquer et collaborer avec d'autres utilisateurs et de partager du contenu et des idées.
- Fonctionnalités de certification : Ces fonctionnalités permettent aux utilisateurs de démontrer leurs compétences et leur expertise dans un domaine particulier.
- Fonctionnalités de gestion de contenu : Les LXP offrent des fonctionnalités de gestion de contenu qui permettent aux administrateurs de créer, de publier et de mettre à jour du contenu d'apprentissage.

- Chat-bots: Cette LXP doit fournir des chat-bots basés sur l'IA qui seront disponibles pour les utilisateurs 24h/24 et 7j/7. Les chat-bots peuvent aider les utilisateurs dans leur tâche actuelle et faire des recommandations intelligentes. Les utilisateurs interagissent avec les chat-bots en tapant des messages dans une zone de discussion textuelle.

- Intégration des applications tierces: Slack, Discord, Github, etc..

# Migration

Créer le fichier de migration :

- npx prisma migrate dev --create-only --name nom_migration
- npx prisma migrate deploy

Si problème de synchronisation entre le modèle et la base de données :

- npx prisma migrate resolve --applied "nom_complet_de_la_derniere_migration"
- npx prisma migrate dev --create-only --name empty-migration

- exécuter les deux commandes pour créer le fichier de migration
