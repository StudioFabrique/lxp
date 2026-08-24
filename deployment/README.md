# Méthodes de déploiement

Le répertoire contient les deux modes de déploiement applicatif disponibles :

```text
deployment/
├── build.sh           construction et publication Jenkins
├── deploy.sh          point d'entrée unique des trois pipelines
├── env.example        contrat Infisical et métadonnées des pipelines
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
(vérification de l'image, attente de `db-ai`, `app.db_provision`).

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

Les deux Jenkinsfile et `.github/workflows/deploy-dev.yml` ne portent plus que
la récupération des secrets et le calcul des métadonnées du déploiement. La
séquence elle-même — synchronisation des contenus, migrations Prisma, triggers
ANDRIA, restauration du jeu de démonstration, provisionnement de la base IA,
démarrage — vit dans `deploy.sh`.

Le script ne lit aucun fichier de secrets : toute la configuration arrive par
l'environnement du processus. Il refuse d'ailleurs de démarrer si un `.env`
traîne à la racine du dépôt, parce que `docker compose` le chargerait
automatiquement et fournirait en silence une variable absente de la source de
vérité.

### Contrat d'entrée

| Variable | Origine | Rôle |
| --- | --- | --- |
| `DEPLOY_MODE` | pipeline, `caddy` (défaut) ou `direct` | choisit `deployment/$DEPLOY_MODE/compose*.yml` |
| `DEPLOY_PATH` | pipeline | répertoire des données persistantes sur le serveur cible |
| `LXP_DEPLOYMENT_NAME` | pipeline | nom de la stack, des conteneurs, des réseaux et des volumes |
| `LXP_IMAGE`, `LXP_IMAGE_TAG` | pipeline | image applicative à déployer |
| `LXP_AI_IMAGE`, `LXP_AI_IMAGE_TAG` | pipeline | image du service IA, hors mode démonstration |
| `APP_HOST` | pipeline | domaine du proxy partagé, exigé en mode `caddy` |
| `DEMO_MODE` | configuration d'exécution | sur `true`, écarte la couche IA et rejoue le jeu de démonstration |
| `REGISTRY_USER`, `REGISTRY_TOKEN` | secrets de transport | `docker login`, sautés si l'un des deux est vide |
| `DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER`, `DEPLOY_SSH_PORT` | secrets de transport | serveur cible ; sans `DEPLOY_SSH_HOST`, le script vise le démon Docker local |
| `DEPLOY_SSH_PRIVATE_KEY` **ou** `DEPLOY_SSH_KEY_FILE` | secrets de transport | clé de déploiement, sous forme de matière ou de fichier déjà posé |
| `COMPOSE_WAIT_TIMEOUT` | pipeline, défaut `240` | attente des healthchecks au démarrage |
| `DEPLOY_PRUNE` | pipeline, défaut `false` | `docker image prune -f` en fin de déploiement |
| `CADDY_NETWORK` | pipeline, défaut `caddy` | réseau externe contrôlé avant de toucher à la stack |
| toutes les autres | configuration d'exécution | interpolées par Compose depuis l'environnement |

Le script valide la présence des variables requises avant tout appel à
`docker`, et adapte la liste au mode : l'instance de démonstration n'exige pas
les réglages de la couche IA, mais exige les deux comptes empruntés par les
visiteurs.

### Injection des secrets

GitHub Actions s'authentifie avec OIDC. L'action Infisical charge `/ci` pour le
build, puis `/ci` et `/runtime` pour le déploiement.

Jenkins conserve un seul credential `INFISICAL_LXP` de type **Username with
password**. Le Client ID Universal Auth tient lieu de nom d'utilisateur et le
Client Secret de mot de passe. `with-infisical.sh` échange ces valeurs contre un
jeton court, charge les deux dossiers, puis lance `deploy.sh`. Le job de build
limite le wrapper à `/ci` avant d'appeler `build.sh`.

Le build Jenkins publie deux tags pour la même image : le SHA Git immuable et
`latest`. Les jobs de déploiement acceptent l'un ou l'autre avec le paramètre
`LXP_IMAGE_TAG`.

Le fichier `env.example` liste chaque clé, son dossier et son propriétaire. Les
variables préfixées par `PIPELINE_` restent sous le contrôle du workflow ;
`deploy.sh` les restaure après l'injection Infisical.

Le plan Cloud gratuit fournit les environnements `dev`, `staging` et `prod`.
La cible de démonstration utilise `dev` avec `INFISICAL_PATH_PREFIX=/demo`, soit
les dossiers `/demo/ci` et `/demo/runtime`, sans créer un quatrième
environnement Infisical.

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
