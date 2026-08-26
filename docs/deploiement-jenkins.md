# Déploiement avec Jenkins

La procédure d'installation et d'exploitation se trouve dans la
[documentation du serveur](https://docs.dev.step.eco/2-deploiement-lxp/0-deployer-avec-jenkins/).
Cette page décrit seulement les fichiers à modifier avec le code.

## Points d'entrée

| Job                | Script Path                     | Commande finale                                     |
| ------------------ | ------------------------------- | --------------------------------------------------- |
| image LXP          | `build.Jenkinsfile`             | `deployment/with-infisical.sh deployment/build.sh`  |
| déploiement direct | `deployment/direct/Jenkinsfile` | `deployment/with-infisical.sh deployment/deploy.sh` |
| déploiement Caddy  | `deployment/caddy/Jenkinsfile`  | `deployment/with-infisical.sh deployment/deploy.sh` |

Les trois jobs utilisent le credential Jenkins `INFISICAL_LXP`, qui contient le
Client ID et le Client Secret Universal Auth de la Machine Identity. Le build
lit `/ci`, qui contient uniquement `REGISTRY_USER` et `REGISTRY_TOKEN`. Les
déploiements lisent également les dossiers de leur cible pour obtenir la
configuration applicative et l'accès SSH.

La sélection des dossiers est exclusive et ne réalise aucun héritage :

- en `dev`, le build lit `/ci` et les déploiements lisent `/ci` et `/runtime` ;
  `INFISICAL_PATH_PREFIX` est ignoré ;
- en `prod` et `pre-prod`, le build lit toujours `/ci`, sans préfixe. Pour un déploiement,
  `INFISICAL_PATH_PREFIX` est obligatoire : le wrapper lit `/ci`,
  `<préfixe>/ci` puis `<préfixe>/runtime`.

La démonstration utilise par exemple `prod` avec
`INFISICAL_PATH_PREFIX=/demo`, et une instance cliente
`INFISICAL_PATH_PREFIX=/clients/<slug>`. Chaque cible doit contenir toute sa
configuration de déploiement dans son dossier `runtime`, y compris ses secrets
applicatifs. Ses secrets SSH vivent dans `<préfixe>/ci`. Seule la valeur
injectée de `DEMO_MODE` décide si la couche IA est déployée.

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
