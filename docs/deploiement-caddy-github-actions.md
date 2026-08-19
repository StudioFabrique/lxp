# Déploiement Caddy avec GitHub Actions

Le workflow [`.github/workflows/deploy-dev.yml`](../.github/workflows/deploy-dev.yml)
construit l'image du commit, la publie sur Docker Hub, puis déploie la stack dans
`/home/martin/lxp-dev`. Un push sur `beta` déclenche le workflow. Un lancement
manuel fonctionne aussi lorsqu'il utilise la branche `beta`.

Le workflow utilise [`deployment/caddy/compose.yml`](../deployment/caddy/compose.yml).
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

Le workflow écrit les métadonnées de déploiement dans `.deploy.env`. Ne pas
ajouter `DEV_APP_HOST`, `DEPLOY_PATH` ni les tags d'image au secret `APP_ENV`.

## Préparer le VPS

Le compte `martin` doit pouvoir lancer Docker sans `sudo`. Le proxy partagé doit
être démarré et le réseau `caddy` doit exister :

```sh
docker network inspect caddy
docker ps --filter name=caddy
```

Le workflow crée `/home/martin/lxp-dev` et ses sous-répertoires persistants. Il
copie le Compose, les scripts SQL, les fichiers initiaux de `api/uploads`, `.env`
et `.deploy.env`. Les deux fichiers d'environnement utilisent le mode `600`.

## Déroulement

Le job `image` publie deux tags :

- `studiostep/lxp:dev-<sha>` pour identifier le commit déployé ;
- `studiostep/lxp:beta` comme pointeur vers le dernier build de `beta`.

Le job `deploy` récupère le tag immuable, démarre les bases, applique les
migrations Prisma et les triggers ANDRIA, provisionne la base IA, puis attend
les healthchecks de `ai` et `app`.

Contrôler le résultat sur le VPS :

```sh
cd /home/martin/lxp-dev
docker compose --env-file .env --env-file .deploy.env \
  -f deployment/caddy/compose.yml ps
docker logs --tail=100 lxp-dev-app
docker logs --tail=100 lxp-dev-ai
```

Tester ensuite `https://lxp.dev.step.eco` depuis une adresse autorisée par
`dev_access`, puis vérifier la carte **LXP** sur `https://dev.step.eco`.

Le dépôt ne contient plus de Caddyfile LXP. Le proxy dans
`/home/martin/caddy-step-http` lit les labels Docker.
