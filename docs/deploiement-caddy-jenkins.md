# Déploiement Jenkins avec le Caddy partagé

Cette méthode déploie la stack avec
[`deployment/caddy/Jenkinsfile`](../deployment/caddy/Jenkinsfile) et
[`deployment/caddy/compose.yml`](../deployment/caddy/compose.yml). Le VPS fait
tourner Caddy dans une stack séparée. Le dépôt LXP ne construit aucun proxy et
ne contient plus de Caddyfile.

Le conteneur public rejoint le réseau externe `caddy` et porte les labels de
routage. Les bases et le service IA rejoignent le réseau interne de la stack.
Un réseau de sortie donne au service IA l'accès aux API Mistral et Hugging Face
sans publier de port sur l'hôte.

## Préparer le serveur

Le VPS doit fournir le réseau et le proxy partagés :

```sh
docker network inspect caddy
docker ps --filter name=caddy
```

Le Caddyfile central doit déclarer l'import `dev_access`. Le proxy Docker lit
les labels `caddy.*` du conteneur `app`; aucune modification du Caddyfile central
n'est requise pour ajouter le LXP.

## Configurer Jenkins

Conserver les credentials du déploiement direct. Ajouter un credential **Secret
text** avec l'ID `APP_DOMAIN` et un nom DNS sans protocole, par exemple
`lxp.dev.step.eco`.

Le pipeline n'utilise plus les credentials OVH suivants :

- `OVH_ENDPOINT` et `OVH_APPLICATION_KEY` ;
- `OVH_APPLICATION_SECRET` et `OVH_CONSUMER_KEY`.

Le credential `APP_DOMAIN` reste séparé de `APP_ENV`. Le Jenkinsfile l'injecte
comme `DEV_APP_HOST` pour renseigner les labels Caddy et Homepage.

Pour une instance accessible sur `https://lxp.dev.step.eco`, adapter les URL du
fichier `APP_ENV` :

```dotenv
PORT=3000
FRONT_URL=https://lxp.dev.step.eco/
LXP_PUBLIC_BASE=https://lxp.dev.step.eco
```

## Créer le job

Créer un job **Pipeline script from SCM** avec ces paramètres :

| Paramètre | Valeur |
| --- | --- |
| Dépôt | dépôt Git LXP |
| Branche | branche à déployer |
| Script Path | `deployment/caddy/Jenkinsfile` |

Le pipeline vérifie le réseau `caddy`, récupère les images, applique les
migrations Prisma et les triggers ANDRIA, provisionne la base IA, puis démarre
`app` et `ai`. Docker Compose attend leurs healthchecks et retire le conteneur
Caddy hérité de l'ancienne stack s'il existe. Les anciens volumes Caddy restent
sur le serveur.

## Vérifier le déploiement

Le log Jenkins affiche `docker compose ps` et les cent dernières lignes des
services applicatifs. Sur le VPS, contrôler les conteneurs et l'accès public :

```sh
docker ps --filter name=lxp
curl --fail --head https://lxp.dev.step.eco
```

Caddy et Homepage détectent les labels du conteneur public. Pour une erreur
`502`, contrôlez le healthcheck, le port `PORT` et le raccordement du conteneur
au réseau `caddy`.
