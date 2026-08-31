# Méthodes de déploiement

Le répertoire contient les deux modes de déploiement applicatif disponibles :

```text
deployment/
├── backup-common.sh  accès commun à la cible et aux dépôts Restic
├── backup.sh         export et copie PostgreSQL, MongoDB et uploads
├── backup.Jenkinsfile job planifié, à instancier une fois par cible
├── build.sh           construction et publication Jenkins
├── deploy.sh          point d'entrée unique des trois pipelines
├── env.example        contrat Infisical et métadonnées des pipelines
├── restore.sh         vérification et restauration d'un snapshot
├── with-infisical.sh  authentification Universal Auth de Jenkins
├── direct/
│   ├── Jenkinsfile
│   ├── compose.yml
│   └── compose.ai.yml
└── caddy/
    ├── Jenkinsfile
    ├── compose.yml
    └── compose.ai.yml
```

- `direct` publie le port HTTP de l'application directement sur le port 80 du
  VPS ;
- `caddy` raccorde l'application au proxy Caddy partagé avec des labels Docker.
  Le VPS conserve le Caddyfile central et le réseau externe `caddy`.

## Socle et couche IA

Dans les deux modes, `compose.yml` porte le **socle** — `app`, `db-pg`,
`db-mongo` — et `compose.ai.yml` y **superpose** la couche IA : le service `ai`,
sa base `db-ai` (pgvector), le cache de modèles `hf_cache`, et le
`depends_on` correspondant sur `app`.

```sh
# Instance ordinaire
docker compose -f compose.yml -f compose.ai.yml up -d app

# Instance de démonstration
docker compose -f compose.yml up -d app
```

Le choix se fait sur la seule variable d'environnement `DEMO_MODE` :
sur `true`, l'API coupe déjà l'IA côté applicatif (`isAiDisabled()` dans
`api/src/config/config.ts`), la déployer ne ferait que consommer un conteneur,
un cache de modèles et un accès sortant vers Mistral. Les trois pipelines
(`deployment/*/Jenkinsfile` et `.github/workflows/deploy-dev.yml`) lisent cette
variable et sautent au passage les étapes purement IA
(vérification de l'image, attente de `db-ai`, `app.db_provision`). Le point
d'entrée commun retire également de son environnement toutes les variables de
la couche IA, même si elles sont présentes dans la configuration Infisical
sélectionnée.

`compose.ai.yml` n'est pas autonome : il complète des services et référence des
réseaux déclarés par le socle. Son nom n'est **pas** `compose.override.yml`,
que `docker compose` chargerait automatiquement — un fichier oublié sur
l'instance de démonstration y relancerait l'IA en silence.

Le pipeline de construction de l'image applicative reste à la racine dans
`build.Jenkinsfile`, avec le `Dockerfile` de l'application. Les procédures
d'exploitation se trouvent dans la documentation du serveur :
<https://docs.dev.step.eco/2-deploiement-lxp/0-deployer-avec-jenkins/> et
<https://docs.dev.step.eco/2-deploiement-lxp/1-deployer-avec-github-actions/>.

## `deploy.sh`

Les deux Jenkinsfile et `.github/workflows/deploy-dev.yml` récupèrent les
secrets, calculent les métadonnées et encadrent le déploiement avec les étapes
de sauvegarde. `deploy.sh` garde la séquence applicative : synchronisation des
contenus, migrations Prisma, triggers ANDRIA, restauration du jeu de
démonstration, provisionnement de la base IA et démarrage.

Le script ne lit aucun fichier de secrets : toute la configuration arrive par
l'environnement du processus. Il refuse d'ailleurs de démarrer si un `.env`
traîne à la racine du dépôt, parce que `docker compose` le chargerait
automatiquement et fournirait en silence une variable absente de la source de
vérité.

### Contrat d'entrée

| Variable                                                | Origine                                | Rôle                                                                         |
| ------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| `DEPLOY_MODE`                                           | pipeline, `caddy` (défaut) ou `direct` | choisit `deployment/$DEPLOY_MODE/compose*.yml`                               |
| `DEPLOY_PATH`                                           | pipeline                               | répertoire des données persistantes sur le serveur cible                     |
| `LXP_DEPLOYMENT_NAME`                                   | pipeline                               | nom de la stack, des conteneurs, des réseaux et des volumes                  |
| `LXP_IMAGE`, `LXP_IMAGE_TAG`                            | pipeline                               | image applicative à déployer                                                 |
| `LXP_AI_IMAGE`, `LXP_AI_IMAGE_TAG`                      | pipeline                               | image du service IA, hors mode démonstration                                 |
| `APP_HOST`                                              | pipeline                               | domaine du proxy partagé, exigé en mode `caddy`                              |
| `DEMO_MODE`                                             | configuration d'exécution              | sur `true`, écarte la couche IA et rejoue le jeu de démonstration            |
| `REGISTRY_USER`, `REGISTRY_TOKEN`                       | `/ci`                                  | `docker login`, sautés si l'un des deux est vide                             |
| `DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER`, `DEPLOY_SSH_PORT` | dev `/runtime`, prod `<préfixe>/ci`      | serveur cible ; sans `DEPLOY_SSH_HOST`, le script vise le démon Docker local |
| `DEPLOY_SSH_PRIVATE_KEY` **ou** `DEPLOY_SSH_KEY_FILE`   | dev `/runtime`, prod `<préfixe>/ci`      | clé de déploiement, sous forme de matière ou de fichier déjà posé            |
| `COMPOSE_WAIT_TIMEOUT`                                  | pipeline, défaut `240`                 | attente des healthchecks au démarrage                                        |
| `DEPLOY_PRUNE`                                          | pipeline, défaut `false`               | `docker image prune -f` en fin de déploiement                                |
| `CADDY_NETWORK`                                         | pipeline, défaut `caddy`               | réseau externe contrôlé avant de toucher à la stack                          |
| `BACKUP_LOCAL_REPOSITORY`                               | dossier Infisical `backup` de la cible  | dépôt Restic sur un disque distinct                                          |
| `BACKUP_S3_*`, `BACKUP_RESTIC_PASSWORD`                 | dossier Infisical `backup` de la cible  | dépôt Restic hors site et chiffrement                                        |
| `BACKUP_ENABLED`                                        | dossier `backup`, défaut `false`         | active les sauvegardes avant et après déploiement                            |
| toutes les autres                                       | configuration d'exécution              | interpolées par Compose depuis l'environnement                               |

Le script valide la présence des variables requises avant tout appel à
`docker`, et adapte la liste au mode : l'instance de démonstration n'exige pas
les réglages de la couche IA, mais exige les deux comptes empruntés par les
visiteurs. Le choix du mode ne dépend ni de l'environnement Infisical, ni du
préfixe de dossiers utilisé.

### Injection des secrets

GitHub Actions s'authentifie avec OIDC. L'action Infisical charge `/ci` pour le
build, puis `/ci`, `/runtime` et `/backup` pour le job de déploiement. Ce
workflow utilise toujours l'environnement `dev` et ne consulte aucun dossier
préfixé.

Jenkins conserve un seul credential `INFISICAL_LXP` de type **Username with
password**. Le Client ID Universal Auth tient lieu de nom d'utilisateur et le
Client Secret de mot de passe. `with-infisical.sh` échange ces valeurs contre un
jeton court, choisit les dossiers selon l'environnement, puis lance
`deploy.sh`. `/ci` contient uniquement `REGISTRY_USER` et `REGISTRY_TOKEN` ; il
reste à la racine de l'environnement et ne dépend jamais de la cible. La
sélection est volontairement simple et sans héritage :

- en `dev`, le build charge `/ci`, le déploiement charge `/ci` et `/runtime`,
  et ses étapes de sauvegarde ajoutent `/backup` ; `INFISICAL_PATH_PREFIX` est
  ignoré ;
- en `prod`, le build charge `/ci` sans préfixe. Pour un déploiement,
  `INFISICAL_PATH_PREFIX` est obligatoire et le wrapper charge `/ci`,
  `<préfixe>/ci` puis `<préfixe>/runtime`. Les opérations de sauvegarde
  ajoutent `<préfixe>/backup`.

`DEMO_MODE` est simplement lu dans l'environnement injecté et décide seul de
l'activation du mode démonstration.

Le build Jenkins publie deux tags pour la même image : le SHA Git immuable et
`latest`. Les jobs de déploiement acceptent l'un ou l'autre avec le paramètre
`LXP_IMAGE_TAG`.

Le fichier `env.example` liste chaque clé, son dossier et son propriétaire. Les
variables préfixées par `PIPELINE_` restent sous le contrôle du workflow ;
`deploy.sh` les restaure après l'injection Infisical.

Une cible de démonstration peut utiliser `dev` ou `prod` : seule la valeur
effective de `DEMO_MODE` décide du mode. Pour la cible Jenkins habituelle,
`INFISICAL_ENVIRONMENT=prod` et `INFISICAL_PATH_PREFIX=/demo` sélectionnent
`/ci` pour le registre, `/demo/ci` pour l'accès SSH, `/demo/runtime` pour la
configuration applicative et `/demo/backup` pour la sauvegarde.

## Sauvegarde 3-2-1

`backup.sh` protège les deux bases métier et le répertoire `uploads`. Il crée
un dump PostgreSQL complet au format custom et une archive MongoDB compressée.
Restic chiffre et déduplique ces exports avec les fichiers dans deux dépôts :

- `BACKUP_LOCAL_REPOSITORY`, sur un disque monté distinct de celui qui porte
  `DEPLOY_PATH` ;
- `BACKUP_S3_REPOSITORY`, dans un stockage objet hors du VPS.

Les volumes actifs forment la première copie. Les deux dépôts fournissent les
deux autres copies et le stockage S3 garde une copie hors site. Le script
compare les périphériques qui portent `DEPLOY_PATH` et le dépôt local. Il
s'arrête si les deux chemins utilisent le même système de fichiers.

La sauvegarde s'exécute à chaud. PostgreSQL et MongoDB garantissent chacun la
cohérence de leur export. Une écriture qui touche à la fois une base et un
fichier peut toutefois se trouver entre deux instants de l'opération.

`BACKUP_ENABLED` vaut `false` par défaut. Les étapes de sauvegarde quittent sans
accéder à Docker, au disque ou à S3 tant que la variable ne vaut pas `true`.
Vous pouvez donc déployer une cible qui ne possède aucune configuration Restic.

Avec `BACKUP_ENABLED=true`, chaque déploiement lance une sauvegarde avant les
migrations et une autre après le démarrage. L'échec de la première bloque le
déploiement. Sur une cible neuve, le script accepte l'absence des deux
conteneurs de base et le pipeline crée le premier snapshot après le démarrage.
L'absence d'une seule base signale une cible incomplète et arrête le job.

En développement, `deploy-dev.yml` exécute les sauvegardes avant et après le
déploiement. Aucun workflow de sauvegarde séparé ne tourne sur cette cible.

En production, créez un job par cible à partir de
`deployment/backup.Jenkinsfile`. Lancez une première sauvegarde manuelle avec
le préfixe Infisical, le nom de stack et le chemin de déploiement de la cible.
Le job reprend ces valeurs comme paramètres par défaut pour les passages
suivants. Son cron répartit les départs avec la syntaxe Jenkins
`H H/6 * * *`. Le job échoue si `BACKUP_ENABLED` ne vaut pas `true`, ce qui
évite un résultat vert sans snapshot.

Restic conserve tous les snapshots des sept derniers jours, huit points
hebdomadaires et douze points mensuels. Chaque exécution contrôle les deux
dépôts après l'application de cette rétention. La base `db-ai`, le cache
Hugging Face, `data` et les logs restent exclus. Le déploiement reconstruit la
base IA à partir des données métier.

### Préparer une cible

Montez un disque de sauvegarde, créez le répertoire du dépôt et donnez au démon
Docker le droit d'y écrire. Créez un bucket S3 hors du compte ou du serveur qui
héberge l'application. Ajoutez les variables `BACKUP_*` décrites dans
`env.example` : `/backup` pour la cible de développement, ou
`<préfixe>/backup` pour une cible de production. Ajoutez
`BACKUP_ENABLED=true` après avoir préparé les deux dépôts.

Utilisez un préfixe S3 et un répertoire local propres à chaque cible. Conservez
`BACKUP_RESTIC_PASSWORD` dans un second coffre. Restic ne peut pas ouvrir les
dépôts sans ce mot de passe.

### Vérifier et restaurer

Le mode `verify` lit les données du dépôt, restaure le snapshot dans un volume
temporaire, contrôle les sommes SHA-256 puis injecte les dumps dans des
conteneurs PostgreSQL et MongoDB isolés :

```sh
RESTORE_SOURCE=s3 RESTORE_SNAPSHOT=latest \
  ./deployment/restore.sh verify

RESTORE_SOURCE=local RESTORE_SNAPSHOT=<id-restic> \
  ./deployment/restore.sh verify
```

Le job Jenkins expose ces deux vérifications comme actions manuelles. En
développement, lancez `restore.sh verify` depuis un agent qui charge la
configuration Infisical de la cible. Exécutez aussi un exercice après un
changement de version majeure de PostgreSQL, MongoDB ou Restic.

Le mode `restore` remplace les données de la stack. Il commence par la même
vérification complète, puis exige que `RESTORE_CONFIRM` corresponde au nom de
la stack. Il arrête l'application, remplace PostgreSQL, MongoDB et `uploads`,
reprovisionne ANDRIA si la cible utilise l'IA et contrôle le healthcheck :

```sh
RESTORE_SOURCE=s3 \
RESTORE_SNAPSHOT=<id-restic> \
RESTORE_CONFIRM="$LXP_DEPLOYMENT_NAME" \
  ./deployment/restore.sh restore
```

Lancez cette commande depuis un agent qui charge les mêmes secrets Infisical
que le déploiement. En cas d'échec après l'arrêt, le script laisse
l'application arrêtée pour éviter de servir un état incomplet. Le verrou Docker
`<stack>-backup-lock` empêche les opérations concurrentes. Si l'agent subit un
arrêt brutal, vérifiez qu'aucune opération ne tourne avant de retirer ce
conteneur avec `docker rm -f <stack>-backup-lock`.

### Lancer un déploiement à la main

Sans `DEPLOY_SSH_HOST`, `deploy.sh` s'adresse au démon Docker local — c'est le
mode « je monte la stack sur ma machine » :

```sh
DEPLOY_MODE=caddy \
DEPLOY_PATH="$PWD/tmp/lxp-local" \
LXP_DEPLOYMENT_NAME=lxp-local \
LXP_IMAGE=studiostep/lxp LXP_IMAGE_TAG=beta \
LXP_AI_IMAGE=studiostep/lxp-ai LXP_AI_IMAGE_TAG=latest \
APP_HOST=lxp.dev.step.eco \
  ./deployment/deploy.sh
```

La configuration d'exécution reste à fournir. Elle viendra d'Infisical :

```sh
infisical run --env=dev --path=/ci --path=/runtime -- ./deployment/deploy.sh
```
