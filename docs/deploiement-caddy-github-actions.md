# Déploiement Caddy avec GitHub Actions

Le workflow [`.github/workflows/deploy-dev.yml`](../.github/workflows/deploy-dev.yml)
construit l'image du commit, la publie sur Docker Hub, puis déploie la stack dans
`/home/martin/lxp-dev`. Un push sur `beta` déclenche le workflow. Un lancement
manuel fonctionne aussi lorsqu'il utilise la branche `beta`.

Le workflow utilise [`deployment/caddy/compose.yml`](../deployment/caddy/compose.yml)
pour le socle applicatif et
[`deployment/caddy/compose.ai.yml`](../deployment/caddy/compose.ai.yml) pour la
couche IA, superposée au socle sauf lorsque le `.env` porte `DEMO_MODE=true` —
voir [`deployment/README.md`](../deployment/README.md).

Le conteneur `lxp-dev-app` rejoint le réseau externe `caddy`; les bases et le
service IA rejoignent le réseau interne `lxp-dev_backend`. Le service IA utilise
`lxp-dev_egress` pour joindre les API Mistral et Hugging Face. Les labels
du conteneur public configurent le proxy Caddy et Homepage.

## Configurer l'environnement GitHub

Créer l'environnement `development`, puis ajouter ces secrets :

| Secret | Contenu |
| --- | --- |
| `APP_ENV` | contenu du fichier d'environnement applicatif |
| `REGISTRY_USER` | compte Docker Hub autorisé à publier `studiostep/lxp` |
| `REGISTRY_TOKEN` | jeton Docker Hub du compte |
| `VPS_HOST` | adresse IP ou nom SSH du VPS |
| `VPS_USERNAME` | `martin` |
| `VPS_SSH_PRIVATE_KEY` | clé privée du compte de déploiement |
| `VPS_SSH_PORT` | port SSH, ou `22` par défaut |

Créer la variable d'environnement `DEV_APP_HOST` avec la valeur
`lxp.dev.step.eco`. Le workflow utilise cette valeur dans les labels Caddy et
utilise `lxp.dev.step.eco` si la variable n'existe pas.

Le secret `APP_ENV` reprend les variables décrites dans
[`deploiement-jenkins.md`](deploiement-jenkins.md). Utiliser ces URL pour le VPS
de développement :

```dotenv
PORT=3000
ENVIRONMENT=production
FRONT_URL=https://lxp.dev.step.eco/
LXP_PUBLIC_BASE=https://lxp.dev.step.eco
```

Le workflow ajoute les métadonnées de déploiement (`LXP_IMAGE`, `LXP_IMAGE_TAG`,
`LXP_AI_IMAGE`, `LXP_AI_IMAGE_TAG`, `LXP_DEPLOYMENT_NAME`, `DEV_APP_HOST`,
`DEPLOY_PATH`) à la fin du `.env` construit sur le runner. Ne pas ajouter ces clés au
secret `APP_ENV`.

## Préparer le VPS

Le compte `martin` doit pouvoir lancer Docker sans `sudo`. Le proxy partagé doit
être démarré et le réseau `caddy` doit exister :

```sh
docker network inspect caddy
docker ps --filter name=caddy
```

## Ce que le VPS héberge, et ce qu'il n'héberge pas

Le VPS ne reçoit **que les données persistantes** : `/home/martin/lxp-dev/data`,
`uploads` et `logs`. Ni `.env`, ni fichier compose, ni script SQL n'y sont
déposés — aucun secret applicatif n'est écrit sur son disque.

Le workflow pilote le démon Docker distant depuis le runner, par
`DOCKER_HOST=ssh://deploy-target`, exactement comme les pipelines Jenkins. Les
fichiers compose et le `.env` restent sur le runner, dont le disque disparaît
avec le job ; les scripts SQL et les dumps sont poussés dans les conteneurs par
l'entrée standard (`docker compose exec -T … < fichier`) ou par
`docker compose cp`. Le workflow supprime au passage les fichiers laissés sur le
VPS par ses versions précédentes.

Conséquence pratique : `docker compose` n'est pas utilisable depuis le VPS,
faute de fichier compose. Les commandes de diagnostic passent par `docker` :

```sh
docker ps
docker logs --tail=100 lxp-dev-app
docker exec -it lxp-dev-app sh
docker exec -it lxp-dev-db-pg sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'
```

`docker compose -p lxp-dev ps`, `stop`, `start` et `down` fonctionnent aussi
sans fichier : Compose retrouve le projet par les labels des conteneurs. `exec`
et `logs`, eux, exigent le fichier compose — d'où les équivalents `docker`
ci-dessus. Pour redéployer, relancer le workflow.

## Déroulement

Le job `image` publie deux tags :

- `studiostep/lxp:dev-<sha>` pour identifier le commit déployé ;
- `studiostep/lxp:beta` comme pointeur vers le dernier build de `beta`.

Le job `deploy` récupère le tag immuable, démarre les bases, applique les
migrations Prisma et les triggers ANDRIA, provisionne la base IA, puis attend
les healthchecks de `ai` et `app`. En mode démonstration, il valide un jeu de
réglages différent — `ANDRIA_*`, `MISTRAL_*` et `DOCKER_IA_*` ne sont plus
exigées, `DEMO_ADMIN_EMAIL` et `DEMO_STUDENT_EMAIL` le deviennent —, saute les
étapes IA et restaure le jeu de démonstration comme décrit dans
[`mode-demo.md`](mode-demo.md). La sortie de `docker compose ps` que le job
affiche ne liste alors que `app`, `db-pg` et `db-mongo`.

La clé d'activation du premier administrateur est générée par le job lui-même,
hors mode démonstration. Pour la régénérer plus tard, la page `/init` affiche la
commande exacte, `docker exec <conteneur> npm run generate-activation-key`, avec
l'identifiant que l'API tire de son propre `hostname`.

Tester ensuite `https://lxp.dev.step.eco` depuis une adresse autorisée par
`dev_access`, puis vérifier la carte **LXP** sur `https://dev.step.eco`.

Le dépôt ne contient plus de Caddyfile LXP. Le proxy dans
`/home/martin/caddy-step-http` lit les labels Docker.
