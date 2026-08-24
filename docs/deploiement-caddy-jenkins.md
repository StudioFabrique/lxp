# Déploiement Jenkins avec le Caddy partagé

La [procédure Jenkins](deploiement-jenkins.md) couvre les credentials Infisical
et le script commun. Le job Caddy utilise
`deployment/caddy/Jenkinsfile` et demande trois paramètres propres à
l'instance :

| Paramètre             | Exemple            | Rôle                                     |
| --------------------- | ------------------ | ---------------------------------------- |
| `DEPLOY_PATH`         | `/home/<user>/lxp` | données persistantes du LXP              |
| `LXP_DEPLOYMENT_NAME` | `lxp`              | préfixe stable des conteneurs et volumes |
| `APP_HOST`            | `lxp.dev.step.eco` | domaine déclaré dans les labels Caddy    |

Le VPS doit déjà fournir le réseau Docker externe `caddy`. Le pipeline ne copie
ni Compose ni secret sur le serveur ; il utilise `DOCKER_HOST=ssh://` depuis
l'agent Jenkins.

La procédure d'exploitation complète reste dans la
[documentation du serveur](https://docs.dev.step.eco/2-deploiement-lxp/0-deployer-avec-jenkins/).
