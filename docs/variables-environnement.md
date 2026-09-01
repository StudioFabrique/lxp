# Variables d’environnement

Cette page liste les variables à connaître pour démarrer ou déployer ANDRIA.
Les fichiers `env.example` restent les modèles à copier :

- `api/env.example` pour l’API en développement ;
- `front/env.example` pour le front en développement ;
- `deployment/env.example` pour Infisical et les pipelines.

Ne placez pas de secret réel dans un fichier suivi par Git. Les variables
`VITE_*` sont visibles dans le navigateur et ne doivent jamais contenir de
secret.

## Développement local

La commande `npm run init` copie les deux fichiers d’exemple. Vous pouvez
démarrer le projet sans modifier leurs valeurs.

### API : variables nécessaires

Fichier : `api/.env`

| Variable | Valeur locale | Rôle |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5500/lxp` | Connexion de l’API à PostgreSQL. |
| `MONGO_LOCAL_URL` | `mongodb://root:root@localhost:27000/lxp?authSource=admin` | Connexion de l’API à MongoDB. |
| `SECRET` | une valeur locale longue | Signe les sessions. |
| `REGISTER_SECRET` | une autre valeur locale longue | Signe les liens de création de compte. |
| `ENVIRONMENT` | `development` | Active le comportement de développement. |
| `PORT` | `3000` | Port de l’API. |

`NODE_ENV` n’a pas besoin d’être ajouté au fichier. Les commandes npm le
définissent pour le développement, les tests et la production.

### Bases Docker locales

Ces variables configurent les trois bases lancées par
`api/docker-compose.yml`. Docker Compose utilise les valeurs du tableau si une
variable manque.

| Variable | Valeur par défaut | Rôle |
| --- | --- | --- |
| `POSTGRES_USER` | `postgres` | Compte PostgreSQL du LXP. |
| `POSTGRES_PASSWORD` | `postgres` | Mot de passe PostgreSQL du LXP. |
| `POSTGRES_DB` | `lxp` | Nom de la base PostgreSQL du LXP. |
| `MONGO_ADMIN_USERNAME` | `root` | Compte administrateur MongoDB. |
| `MONGO_ADMIN_PASSWORD` | `root` | Mot de passe MongoDB. |
| `MONGO_DATABASE` | `lxp` | Nom de la base MongoDB. |
| `ANDRIA_POSTGRES_USER` | `andria` | Compte de la base IA. |
| `ANDRIA_POSTGRES_PASSWORD` | `andria` | Mot de passe de la base IA. |
| `ANDRIA_POSTGRES_DB` | `lxp_ai` | Nom de la base IA. |

Si vous changez un identifiant, mettez aussi à jour l’URL de connexion qui
l’utilise.

### Front

Fichier : `front/.env`

| Variable | Valeur locale | Rôle |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3000/` | Adresse de l’API. |
| `VITE_CSV_DOWNLOAD_URL` | `http://localhost:3000` | Adresse utilisée pour les exports CSV. |
| `VITE_ENVIRONMENT` | `development` | Nom de l’environnement affiché par le front. |

Vite lit ces variables au démarrage. Relancez `npm run dev` après une
modification.

### Fonctions facultatives en développement

Ces variables peuvent rester vides si vous n’utilisez pas la fonction
associée.

| Variable | Rôle |
| --- | --- |
| `FRONT_URL` | Adresse utilisée dans les liens envoyés par courriel. |
| `EMAIL` | Compte de connexion au serveur SMTP. |
| `PASSWORD` | Mot de passe du compte SMTP. |
| `SMTP` | Nom du serveur SMTP. |
| `SMTP_EMAIL` | Adresse utilisée pour les messages de développement. |
| `SMTP_PORT` | Port du serveur SMTP. |
| `FROM` | Nom et adresse de l’expéditeur. |
| `UNSPLASH_ACCESS_KEY` | Clé utilisée pour les images de connexion. |
| `DOCKER_IA_API_BASE_URL` | Adresse du service IA, en général `http://localhost:8000`. |
| `DOCKER_IA_AUTH_SECRET` | Secret partagé avec `SECRET_KEY` dans ANDRIA-IA. |
| `DISABLE_AI_FEATURES` | `true` coupe les fonctions IA. La valeur par défaut est `false`. |
| `DEMO_MODE` | `true` active le mode de démonstration. La valeur par défaut est `false`. |
| `DEMO_URL` | Adresse de l’instance de démonstration annoncée aux utilisateurs. |
| `DEMO_EXIT_URL` | Adresse ouverte quand un visiteur quitte la démonstration. |
| `ALTCHA_HMAC_KEY` | Signe le contrôle anti-robot. L’API utilise `SECRET` si cette valeur manque. |
| `DEMO_ADMIN_EMAIL` | Compte administrateur utilisé par la démonstration. |
| `DEMO_STUDENT_EMAIL` | Compte apprenant utilisé par la démonstration. |

`DEMO_ADMIN_EMAIL` et `DEMO_STUDENT_EMAIL` deviennent obligatoires quand
`DEMO_MODE=true`.

## ANDRIA-IA en développement

Le service IA est présent dans un dépôt séparé. Copiez son fichier
`env.example` vers `.env`, puis renseignez les variables suivantes.

| Variable | Obligatoire | Valeur ou rôle |
| --- | --- | --- |
| `MISTRAL_STUDENT_API_KEY` | oui | Clé Mistral pour les fonctions apprenant. |
| `MISTRAL_CONTENT_API_KEY` | oui | Clé Mistral pour la création de contenu. |
| `DATABASE_URL` | oui | `postgresql://andria:andria@lxp-ai-postgres:5432/lxp_ai` |
| `ANDRIA_AI_DB_URL` | oui | Même valeur que `DATABASE_URL`. |
| `LXP_DB_URL` | oui | `postgresql://postgres:postgres@lxp-prisma:5432/lxp` |
| `LXP_MONGO_URL` | oui | `mongodb://root:root@lxp-mongo:27017/lxp?authSource=admin` |
| `LXP_UPLOADS_DIR` | oui | `/lxp/api/uploads/activities` |
| `LXP_PUBLIC_BASE` | oui | `http://localhost:3000` |
| `SECRET_KEY` | oui | Même valeur que `DOCKER_IA_AUTH_SECRET` dans `api/.env`. |
| `MISTRAL_MODEL` | non | `mistral-small-latest` |
| `DB_INGEST_MIN_WORDS` | non | Nombre minimal de mots à indexer. Valeur courante : `20`. |
| `DB_WATCH_RECONNECT_DELAY` | non | Délai de reconnexion du watcher. Valeur courante : `5`. |
| `DEV_BYPASS_AUTH` | non | Gardez `false` pour utiliser l’authentification normale. |

Les clés Mistral de développement se trouvent dans Infisical EU, projet LXP,
environnement `dev`, dossier `/runtime`. Le guide
[Développement avec ANDRIA-IA](developpement-ia.md) donne les commandes de
démarrage et de contrôle.

## Déploiement

Le script `deployment/deploy.sh` lit ses variables depuis le processus. Les
pipelines les chargent depuis Infisical et ajoutent les valeurs liées au job.
Aucun fichier `.env` ne doit être présent à la racine du dépôt pendant un
déploiement.

Le front de production utilise `front/.env.production`. Ses trois variables
`VITE_*` valent `/`, `/` et `production`. Le build les place dans les fichiers
du front. Elles ne viennent pas d’Infisical.

### Variables requises pour toutes les instances

Ces variables vont dans le dossier `runtime` de la cible, sauf indication dans
la colonne « Source ».

| Variable | Source | Rôle |
| --- | --- | --- |
| `DEMO_MODE` | `runtime` | `false` pour une instance normale, `true` pour la démonstration. La valeur doit être écrite. |
| `PORT` | `runtime` | Port interne de l’API, en général `3000`. |
| `ENVIRONMENT` | `runtime` | `production`. |
| `FRONT_URL` | `runtime` | Adresse publique avec `https://` et un `/` final. |
| `REGISTER_SECRET` | `runtime` | Secret long pour les liens de création de compte. |
| `SECRET` | `runtime` | Secret long et différent pour les sessions. |
| `POSTGRES_USER` | `runtime` | Compte PostgreSQL du LXP. |
| `POSTGRES_PASSWORD` | `runtime` | Mot de passe PostgreSQL du LXP. |
| `POSTGRES_DB` | `runtime` | Nom de la base PostgreSQL du LXP. |
| `DATABASE_URL` | `runtime` | URL complète vers `db-pg:5432`. |
| `MONGO_ADMIN_USERNAME` | `runtime` | Compte administrateur MongoDB. |
| `MONGO_ADMIN_PASSWORD` | `runtime` | Mot de passe MongoDB. |
| `MONGO_DATABASE` | `runtime` | Nom de la base MongoDB. |
| `MONGO_LOCAL_URL` | `runtime` | URL complète vers `db-mongo:27017` avec `authSource=admin`. |
| `EMAIL` | `runtime` | Compte de connexion SMTP. |
| `PASSWORD` | `runtime` | Mot de passe SMTP. |
| `SMTP` | `runtime` | Nom du serveur SMTP. |
| `SMTP_EMAIL` | `runtime` | Adresse utilisée par l’application. |
| `SMTP_PORT` | `runtime` | Port SMTP. |
| `FROM` | `runtime` | Nom et adresse de l’expéditeur. |
| `UNSPLASH_ACCESS_KEY` | `runtime` | Clé Unsplash. L’API l’exige en production. |
| `LXP_IMAGE` | pipeline | Nom de l’image du LXP. |
| `LXP_IMAGE_TAG` | pipeline | Tag de l’image du LXP. Utilisez un tag fixe pour pouvoir revenir en arrière. |
| `LXP_DEPLOYMENT_NAME` | pipeline | Nom stable de la stack, des conteneurs et des volumes. |

### Variables requises avec l’IA

Le script déploie la couche IA quand `DEMO_MODE=false`. Il exige alors toutes
les variables de ce tableau, même si `DISABLE_AI_FEATURES=true`.

| Variable | Rôle |
| --- | --- |
| `ANDRIA_POSTGRES_USER` | Compte PostgreSQL du service IA. |
| `ANDRIA_POSTGRES_PASSWORD` | Mot de passe PostgreSQL du service IA. |
| `ANDRIA_POSTGRES_DB` | Nom de la base IA. |
| `ANDRIA_AI_DB_URL` | URL complète vers `db-ai:5432`. |
| `LXP_DB_URL` | URL de la base LXP lue par le service IA. Un compte en lecture seule est conseillé. |
| `DOCKER_IA_API_BASE_URL` | Adresse interne `http://ai:8000`. |
| `DOCKER_IA_AUTH_SECRET` | Secret partagé avec `SECRET_KEY`. |
| `SECRET_KEY` | Même valeur que `DOCKER_IA_AUTH_SECRET`. |
| `MISTRAL_STUDENT_API_KEY` | Clé Mistral pour les fonctions apprenant. |
| `MISTRAL_CONTENT_API_KEY` | Clé Mistral pour la création de contenu. |
| `LXP_PUBLIC_BASE` | Adresse publique du LXP, sans `/` final. |
| `LXP_AI_IMAGE` | Nom de l’image ANDRIA-IA, fourni par le pipeline. |
| `LXP_AI_IMAGE_TAG` | Tag de l’image ANDRIA-IA, fourni par le pipeline. |

Réglages facultatifs de la couche IA :

| Variable | Valeur par défaut |
| --- | --- |
| `MISTRAL_MODEL` | `mistral-small-latest` |
| `QUIZ_TEMPERATURE` | `0.5` |
| `QUIZ_MAX_TOKENS` | `1200` |
| `QUIZ_MAX_ATTEMPTS` | `3` |
| `QUIZ_PARALLEL_SLOTS` | `3` |
| `QUIZ_MIN_PROMPT_LEN` | `12` |
| `QUIZ_MIN_EXPLANATION_LEN` | `10` |
| `DB_INGEST_MIN_WORDS` | `20` |
| `DISABLE_AI_FEATURES` | `false` |

### Variables du mode démonstration

Définissez `DEMO_MODE=true`. Le déploiement ignore alors toutes les variables
IA et demande ces deux comptes :

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `DEMO_ADMIN_EMAIL` | oui | Compte administrateur ouvert aux visiteurs. |
| `DEMO_STUDENT_EMAIL` | oui | Compte apprenant ouvert aux visiteurs. |
| `DEMO_EXIT_URL` | non | Adresse ouverte à la sortie de la démonstration. |
| `ALTCHA_HMAC_KEY` | non | Clé du contrôle anti-robot. `SECRET` sert de valeur de secours. |

`DEMO_URL` se renseigne sur les autres instances pour afficher un lien vers la
démonstration.

### Variables liées à la cible

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `DEPLOY_MODE` | non | `caddy` par défaut, ou `direct`. Le pipeline la définit. |
| `DEPLOY_PATH` | non | Dossier des données sur le serveur. Par défaut : dossier personnel du compte suivi du nom de la stack. |
| `APP_HOST` | en mode `caddy` | Domaine sans protocole ni chemin. |
| `COMPOSE_WAIT_TIMEOUT` | non | Délai maximal de démarrage, `240` secondes par défaut. |
| `DEPLOY_PRUNE` | non | `true` supprime les images Docker inutilisées après le déploiement. |
| `CADDY_NETWORK` | non | Réseau Docker du proxy, `caddy` par défaut. |

### Accès au registre et au serveur

| Variable | Obligatoire | Dossier Infisical | Rôle |
| --- | --- | --- | --- |
| `REGISTRY_USER` | si le registre est privé | `/ci` | Compte du registre Docker. |
| `REGISTRY_TOKEN` | si le registre est privé | `/ci` | Jeton du registre Docker. |
| `DEPLOY_SSH_HOST` | pour un serveur distant | `dev:/runtime`, production:`<préfixe>/ci` | Nom ou adresse du serveur. |
| `DEPLOY_SSH_USER` | avec `DEPLOY_SSH_HOST` | même dossier | Compte SSH. |
| `DEPLOY_SSH_PORT` | non | même dossier | Port SSH, `22` par défaut. |
| `DEPLOY_SSH_PRIVATE_KEY` | avec `DEPLOY_SSH_HOST` | même dossier | Clé privée complète. |

`DEPLOY_SSH_KEY_FILE` remplace `DEPLOY_SSH_PRIVATE_KEY` quand un agent écrit la
clé dans un fichier temporaire. Ne placez pas `DEPLOY_SSH_KEY_FILE` dans
Infisical : le chemin change à chaque exécution.

Sans `DEPLOY_SSH_HOST`, les scripts utilisent le Docker local.

### Variables Infisical des pipelines

Jenkins demande les valeurs suivantes :

| Variable ou paramètre | Rôle |
| --- | --- |
| `INFISICAL_UNIVERSAL_AUTH_CLIENT_ID` | Identifiant de la Machine Identity, fourni par le credential Jenkins. |
| `INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET` | Secret de la Machine Identity, fourni par le credential Jenkins. |
| `INFISICAL_PROJECT_ID` | Identifiant du projet LXP. |
| `INFISICAL_ENVIRONMENT` | `dev` ou `prod`. |
| `INFISICAL_PATH_PREFIX` | Préfixe d’une cible hors développement, par exemple `/demo` ou `/clients/acme`. |
| `INFISICAL_DOMAIN` | `https://eu.infisical.com` par défaut. |
| `INFISICAL_CREDENTIAL_ID` | Nom du credential Jenkins. La valeur proposée est `INFISICAL_CREDENTIALS`. |

GitHub Actions demande trois variables dans l’environnement GitHub
`development` :

| Variable GitHub | Rôle |
| --- | --- |
| `INFISICAL_IDENTITY_ID` | Identité OIDC autorisée à lire les secrets. |
| `INFISICAL_PROJECT_SLUG` | Nom du projet Infisical. |
| `APP_HOST` | Domaine du LXP de développement. Le workflow utilise `lxp.dev.step.eco` si la variable manque. |

### Répartition dans Infisical

| Cible | Dossiers lus |
| --- | --- |
| Développement | `/ci`, `/runtime` et `/backup` |
| Production | `/ci`, `<préfixe>/ci`, `<préfixe>/runtime` et `<préfixe>/backup` |

- `/ci` contient seulement `REGISTRY_USER` et `REGISTRY_TOKEN` ;
- `runtime` contient la configuration de l’application ;
- le dossier `ci` préfixé contient l’accès SSH de la cible ;
- `backup` contient les variables de sauvegarde.

Les variables calculées par un pipeline utilisent le préfixe `PIPELINE_`. Ne
les ajoutez pas dans Infisical. Les scripts les remettent sous leur nom normal
avant le déploiement.

`INFISICAL_SECRET_PATHS` sert aux scripts Jenkins pour choisir les dossiers à
charger. Les jobs du dépôt la définissent. Vous n’avez pas besoin de l’ajouter
dans Infisical.

Les autres noms créés par les scripts, comme `AI_ENABLED`, `COMPOSE_FILES`,
`DOCKER_CONFIG` ou `INFISICAL_TOKEN`, sont des variables internes. Vous ne
devez pas les configurer.

## Sauvegarde et restauration

Les trois destinations sont désactivées par défaut.

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `BACKUP_LOCAL_ENABLED` | non | Active une copie sur le disque du serveur. La valeur par défaut est `false`. |
| `BACKUP_LOCAL_REPOSITORY` | copie locale active | Dossier Restic situé hors de `DEPLOY_PATH`. |
| `BACKUP_EXTERNAL_VOLUME_ENABLED` | non | Active une copie sur un autre volume. La valeur par défaut est `false`. |
| `BACKUP_EXTERNAL_VOLUME_REPOSITORY` | volume externe actif | Dossier Restic sur un autre système de fichiers. |
| `BACKUP_S3_ENABLED` | non | Active une copie S3. La valeur par défaut est `false`. |
| `BACKUP_S3_REPOSITORY` | S3 actif | URL Restic du dépôt S3. |
| `BACKUP_S3_ACCESS_KEY` | S3 actif | Clé d’accès S3. |
| `BACKUP_S3_SECRET_KEY` | S3 actif | Clé secrète S3. |
| `BACKUP_S3_REGION` | non | Région S3. La valeur par défaut du script est `us-east-1`. |
| `BACKUP_RESTIC_PASSWORD` | une destination active | Mot de passe de chiffrement Restic. |

Variables utilisées lors d’une commande manuelle :

| Variable | Rôle |
| --- | --- |
| `BACKUP_REASON` | `scheduled`, `pre-deploy`, `post-deploy` ou `manual`. |
| `BACKUP_ALLOW_UNINITIALIZED` | Autorise l’absence de bases avant le premier déploiement. |
| `BACKUP_REQUIRE_ENABLED` | Fait échouer la commande si aucune destination n’est active. |
| `RESTORE_SOURCE` | `local`, `external-volume` ou `s3`. |
| `RESTORE_SNAPSHOT` | `latest` pour un contrôle, ou l’identifiant Restic pour une restauration. |
| `RESTORE_CONFIRM` | Nom exact de la stack. Obligatoire pour remplacer les données. |
| `OPERATION` | Action du job Jenkins de sauvegarde : `backup`, `list-backup`, `verify-backup` ou `stop-backup`. |

Les variables `BACKUP_RESTIC_IMAGE`, `BACKUP_HELPER_IMAGE`,
`BACKUP_POSTGRES_IMAGE` et `BACKUP_MONGO_IMAGE` servent seulement à remplacer
les images des outils. Gardez leurs valeurs par défaut hors des tests.

L’ancienne variable `BACKUP_ENABLED` n’est plus utilisée. Retirez-la
d’Infisical. Les scripts arrêtent l’opération s’ils la trouvent.

Le guide [Sauvegarder et restaurer](sauvegardes.md) décrit les commandes.
