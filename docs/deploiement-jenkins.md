# Déploiement avec Jenkins

La procédure d'installation et d'exploitation se trouve dans la
[documentation du serveur](https://docs.dev.step.eco/2-deploiement-lxp/0-deployer-avec-jenkins/).
Cette page décrit seulement les fichiers à modifier avec le code.

## Points d'entrée

| Job | Script Path | Commande finale |
| --- | --- | --- |
| image LXP | `build.Jenkinsfile` | `deployment/with-infisical.sh deployment/build.sh` |
| déploiement direct | `deployment/direct/Jenkinsfile` | `deployment/with-infisical.sh deployment/deploy.sh` |
| déploiement Caddy | `deployment/caddy/Jenkinsfile` | `deployment/with-infisical.sh deployment/deploy.sh` |

Les trois jobs utilisent le credential Jenkins `INFISICAL_LXP`, qui contient le
Client ID et le Client Secret Universal Auth de la Machine Identity. Le build
lit `/ci`. Les déploiements lisent `/ci` et `/runtime` car l'agent Jenkins
interpole Compose avant de piloter le démon Docker par SSH.

Les paramètres utilisent les trois environnements inclus dans le plan Cloud
gratuit : `dev`, `staging` et `prod`. Les cibles supplémentaires sont des
préfixes de chemin, pas des environnements : la démonstration vit dans `prod`
avec `INFISICAL_PATH_PREFIX=/demo`, une instance cliente avec
`/clients/<slug>`. Le wrapper lit alors `<préfixe>/ci` et `<préfixe>/runtime`.

`deployment/env.example` constitue le contrat des variables. Ajoutez-y toute
nouvelle clé dans le même changement que le code consommateur et le fichier
Compose concerné. Ne placez aucune valeur réelle dans ce dépôt.

## Répartition du code

- `deployment/build.sh` se connecte au registre, construit l'image et la publie.
- `deployment/deploy.sh` valide la configuration, prépare les volumes, applique
  les migrations et démarre les services.
- `deployment/with-infisical.sh` obtient un jeton court et injecte les secrets
  sans créer de fichier `.env`.

Les Jenkinsfiles ne doivent contenir que les paramètres non sensibles et les
métadonnées calculées par le pipeline.
