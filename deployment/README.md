# Déployer ANDRIA

Les pipelines construisent les images, lisent les secrets dans Infisical et
pilotent Docker sur le serveur cible. Le serveur conserve seulement les bases,
les fichiers envoyés par les utilisateurs et les journaux.

Consultez la [liste des variables](../docs/variables-environnement.md#déploiement)
avant de préparer une nouvelle instance.

## Choisir le mode de déploiement

| Mode | Fichier | Usage |
| --- | --- | --- |
| `caddy` | `deployment/caddy/Jenkinsfile` | Le serveur utilise un proxy Caddy partagé. |
| `direct` | `deployment/direct/Jenkinsfile` | Le LXP publie lui-même le port 80 du serveur. |
| développement partagé | `.github/workflows/deploy-dev.yml` | Une fusion dans `beta` déploie l’instance de développement. |

Le mode `caddy` demande un réseau Docker externe nommé `caddy` par défaut. Le
mode `direct` ne demande pas de proxy.

## Services déployés

Le fichier `compose.yml` démarre :

- l’application `app` ;
- PostgreSQL `db-pg` ;
- MongoDB `db-mongo`.

Le fichier `compose.ai.yml` ajoute le service `ai`, sa base `db-ai` et le cache
des modèles. Les pipelines chargent ce second fichier quand
`DEMO_MODE=false`.

Une instance de démonstration utilise seulement `compose.yml`. Elle ne démarre
pas le service IA.

## Préparer un serveur

Le serveur doit fournir :

- Docker avec le module Compose ;
- un compte SSH autorisé à utiliser Docker ;
- `rsync` ;
- le réseau Caddy pour un déploiement en mode `caddy` ;
- assez d’espace pour les bases, les fichiers et les images Docker.

Le pipeline crée ces dossiers sous `DEPLOY_PATH` :

```text
DEPLOY_PATH/
├── data/
├── logs/
└── uploads/
```

Le pipeline ne copie aucun secret, fichier Compose ou script sur le serveur.
Il utilise Docker à distance avec SSH.

## Préparer Infisical

### Instance de développement

Le workflow GitHub Actions lit :

```text
/ci       accès au registre Docker
/runtime  application et accès SSH
/backup   sauvegardes
```

Il utilise toujours l’environnement Infisical `dev`.

### Instance de production

Un job Jenkins lit :

```text
/ci                    accès commun au registre Docker
<préfixe>/ci           accès SSH de la cible
<préfixe>/runtime      application
<préfixe>/backup       sauvegardes
```

Exemples de préfixes :

- `/demo` pour l’instance de démonstration ;
- `/clients/acme` pour une instance cliente.

Chaque cible doit avoir ses propres dossiers `ci`, `runtime` et `backup`. Le
dossier `/ci` reste commun et contient seulement `REGISTRY_USER` et
`REGISTRY_TOKEN`.

Le fichier [`deployment/env.example`](env.example) fournit un modèle sans
secret. La page
[Variables d’environnement](../docs/variables-environnement.md#répartition-dans-infisical)
explique où placer chaque valeur.

## Déployer avec Jenkins

### 1. Créer le credential Infisical

Créez un credential Jenkins de type « Username with password » :

- le nom d’utilisateur contient le Client ID Universal Auth ;
- le mot de passe contient le Client Secret Universal Auth.

Le nom proposé par les Jenkinsfiles est `INFISICAL_CREDENTIALS`. Vous pouvez le
changer avec le paramètre `INFISICAL_CREDENTIAL_ID`.

### 2. Créer les jobs

| Job | Script Path |
| --- | --- |
| Construire l’image LXP | `build.Jenkinsfile` |
| Déployer avec Caddy | `deployment/caddy/Jenkinsfile` |
| Déployer sans Caddy | `deployment/direct/Jenkinsfile` |
| Sauvegarder une cible | `deployment/backup.Jenkinsfile` |

### 3. Renseigner les paramètres

Vérifiez au minimum :

- `INFISICAL_PROJECT_ID` ;
- `INFISICAL_ENVIRONMENT` ;
- `INFISICAL_PATH_PREFIX` pour une cible hors développement ;
- `LXP_DEPLOYMENT_NAME` ;
- `APP_HOST` en mode Caddy ;
- les tags des images.

Gardez le même `LXP_DEPLOYMENT_NAME` pendant toute la vie d’une instance. Un
nouveau nom crée de nouveaux volumes Docker et donne l’impression que les
données ont disparu.

### 4. Lancer le job

Le job effectue une sauvegarde, déploie l’application, puis crée une seconde
sauvegarde. Aucune sauvegarde n’est créée si les trois variables
`BACKUP_*_ENABLED` valent `false`.

La [documentation des serveurs STEP](https://docs.dev.step.eco/2-deploiement-lxp/0-deployer-avec-jenkins/)
explique la création des jobs et le retour à une ancienne image.

## Déployer le développement avec GitHub Actions

Le workflow `.github/workflows/deploy-dev.yml` effectue deux actions :

- sur une pull request vers `beta`, il lance le lint, les types et les tests ;
- après une fusion dans `beta`, il construit l’image et déploie le serveur de
  développement.

Ajoutez ces variables dans l’environnement GitHub `development` :

- `INFISICAL_IDENTITY_ID` ;
- `INFISICAL_PROJECT_SLUG` ;
- `APP_HOST`.

Le workflow utilise OIDC pour accéder à Infisical. Aucun secret Infisical ne
doit être enregistré dans GitHub.

La [documentation des serveurs STEP](https://docs.dev.step.eco/2-deploiement-lxp/1-deployer-avec-github-actions/)
décrit la configuration de l’identité OIDC.

## Déployer une instance de démonstration

Définissez `DEMO_MODE=true` dans le dossier `runtime` de la cible. Ajoutez aussi
`DEMO_ADMIN_EMAIL` et `DEMO_STUDENT_EMAIL`.

Le pipeline :

1. ignore les variables et l’image IA ;
2. remet les bases dans leur état de démonstration ;
3. charge les données présentes dans `api/dumps/demo/` ;
4. prépare les deux comptes de visite.

N’activez pas `DEMO_MODE` sur une instance qui contient des données à garder.
Le déploiement efface les données de cette instance.

Consultez [Mode démonstration](../docs/mode-demo.md) pour produire les données
et tester le parcours visiteur.

## Déploiement manuel

`deployment/deploy.sh` sert surtout aux pipelines. Vous pouvez aussi le lancer
depuis un agent qui possède Docker, `rsync` et toutes les variables requises.

Sans `DEPLOY_SSH_HOST`, le script utilise le Docker local :

```bash
infisical run --env=dev --path=/ci --path=/runtime -- \
  ./deployment/deploy.sh
```

Le script doit partir de la racine du dépôt. Il refuse de démarrer si un
fichier `.env` est présent à cette racine.

## Sauvegardes

Les déploiements peuvent copier PostgreSQL, MongoDB et `uploads` vers un dépôt
Restic local, un volume externe ou S3. Consultez
[Sauvegarder et restaurer](../docs/sauvegardes.md) pour préparer les dépôts,
contrôler un snapshot ou remplacer les données d’une instance.

## Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| `deployment/deploy.sh` | Valide les variables, applique les migrations et démarre les services. |
| `deployment/with-infisical.sh` | Charge les secrets Infisical pour Jenkins. |
| `deployment/build.sh` | Construit et publie l’image du LXP. |
| `deployment/backup.sh` | Crée une sauvegarde. |
| `deployment/restore.sh` | Contrôle ou restaure une sauvegarde. |
| `deployment/env.example` | Liste les variables avec des exemples sans secret. |
