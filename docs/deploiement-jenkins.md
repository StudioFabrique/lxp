# Déploiement direct avec Jenkins

Jenkins construit l'image du LXP, la publie sur Docker Hub, puis déploie
l'application sur un serveur Docker distant. Le déploiement utilise les fichiers
[`build.Jenkinsfile`](../build.Jenkinsfile),
[`deployment/direct/Jenkinsfile`](../deployment/direct/Jenkinsfile) et
[`deployment/direct/compose.yml`](../deployment/direct/compose.yml).

## Chaîne de déploiement

```text
Dépôt lxp                         Dépôt ANDRIA-IA
    │                                  │
    ▼                                  ▼
Jenkins: Docker Image Deploy      GitHub Actions
    │                                  │
    ▼                                  ▼
studiostep/lxp:latest             studiostep/lxp-ai:latest
              │                    │
              └─────────┬──────────┘
                        ▼
       Jenkins: demo/pull images and deploy app
                        │  Docker via SSH
                        ▼
                  Serveur de démo
```

Le pipeline de déploiement attend les deux images sur Docker Hub. Le dépôt IA
publie `studiostep/lxp-ai:latest` avec son workflow GitHub Actions lors d'un push
sur sa branche principale.

Ce document décrit le déploiement HTTP direct. Pour raccorder une instance au
proxy Caddy partagé d'un VPS, consulter
[`deploiement-caddy-jenkins.md`](deploiement-caddy-jenkins.md). Les deux méthodes
coexistent sous `deployment/direct` et `deployment/caddy`.

## 1. Préparer Jenkins

Installer les plugins suivants :

- Pipeline et Git ;
- Docker Pipeline et Credentials Binding ;
- SSH Credentials ;
- NodeJS.

Dans **Administrer Jenkins > Tools**, déclarer une installation Node.js nommée
`NodeJS-24`. Le nom doit correspondre à celui de `build.Jenkinsfile`.

L'agent qui exécute les jobs doit disposer de ces commandes :

```bash
git --version
docker version
docker compose version
ssh -V
rsync --version
```

Le compte système de l'agent doit pouvoir lancer Docker et ouvrir une connexion
SSH vers le serveur cible.

## 2. Préparer le serveur cible

Installer Docker avec le plugin Compose. Créer un compte de déploiement qui :

- se connecte par clé SSH ;
- exécute Docker sans `sudo` ;
- écrit dans `/home/<SSH_USER>/<SSH_TARGET>` ;
- dispose du port TCP 80 pour l'application.

Le pipeline crée les sous-répertoires `data`, `uploads` et `logs`. Il synchronise
ensuite le contenu de `api/uploads/` vers le serveur.

Tester l'accès depuis l'agent Jenkins :

```bash
ssh -p <SSH_PORT> <SSH_USER>@<APP_SSH_HOST> docker version
```

## 3. Créer les identifiants Jenkins

Créer le dossier Jenkins `demo`, puis ouvrir **demo > Identifiants > Global
credentials (unrestricted)**. Les captures Jenkins correspondent à cette
organisation : `APP_ENV` et `APP_SSH_HOST` appartiennent au dossier `demo`; les
autres identifiants peuvent rester globaux s'ils servent à plusieurs
environnements.

| ID Jenkins        | Type                          | Contenu                                                    | Pipeline                        |
| ----------------- | ----------------------------- | ---------------------------------------------------------- | ------------------------------- |
| `APP_ENV`         | Secret file                   | fichier `.env` de production                               | déploiement                     |
| `APP_SSH_HOST`    | Secret text                   | nom DNS ou IP du serveur                                   | déploiement                     |
| `GITHUB-LXP`      | Username with password        | compte GitHub et jeton d'accès                             | configuration SCM des deux jobs |
| `DOCKER_REGISTRY` | Username with password        | compte Docker Hub et jeton d'accès                         | construction et déploiement     |
| `SSH_USER`        | Secret text                   | compte Linux du serveur                                    | déploiement                     |
| `SSH_PORT`        | Secret text                   | port SSH, par exemple `22`                                 | déploiement                     |
| `SSH_TARGET`      | Secret text                   | répertoire sous `/home/<SSH_USER>`, par exemple `lxp-demo` | déploiement                     |
| `SSH_CREDENTIALS` | SSH Username with private key | clé privée du compte de déploiement                        | déploiement                     |

Les IDs doivent respecter la casse du tableau. Les deux Jenkinsfiles les
référencent sans paramètre de remplacement.

### Contenu du fichier `APP_ENV`

Créer un fichier local, par exemple `env.demo`, puis l'ajouter à Jenkins comme
**Secret file** avec l'ID `APP_ENV`. Ne pas ajouter ce fichier au dépôt.

```dotenv
# Application
PORT=3000
ENVIRONMENT=production
FRONT_URL=http://lxp.example.com/
REGISTER_SECRET=<secret-activation>
SECRET=<secret-session>

# PostgreSQL LXP
POSTGRES_USER=lxp
POSTGRES_PASSWORD=<mot-de-passe-postgres>
POSTGRES_DB=lxp
DATABASE_URL=postgresql://lxp:<mot-de-passe-postgres-encode-pour-une-url>@db-pg:5432/lxp

# PostgreSQL IA / pgvector
ANDRIA_POSTGRES_USER=andria
ANDRIA_POSTGRES_PASSWORD=<mot-de-passe-postgres-ia>
ANDRIA_POSTGRES_DB=lxp_ai
ANDRIA_AI_DB_URL=postgresql://andria:<mot-de-passe-postgres-ia-encode-pour-une-url>@db-ai:5432/lxp_ai
LXP_DB_URL=postgresql://lxp:<mot-de-passe-postgres-encode-pour-une-url>@db-pg:5432/lxp

# MongoDB
MONGO_ADMIN_USERNAME=lxp
MONGO_ADMIN_PASSWORD=<mot-de-passe-mongo>
MONGO_DATABASE=lxp
MONGO_LOCAL_URL=mongodb://lxp:<mot-de-passe-mongo-encode-pour-une-url>@db-mongo:27017/lxp?authSource=admin

# Communication LXP vers IA
DOCKER_IA_API_BASE_URL=http://ai:8000
DOCKER_IA_AUTH_SECRET=<secret-commun-lxp-ia>

# Service IA
SECRET_KEY=<secret-commun-lxp-ia>
MISTRAL_STUDENT_API_KEY=<cle-mistral-student>
MISTRAL_CONTENT_API_KEY=<cle-mistral-content>
MISTRAL_MODEL=mistral-small-latest
LXP_PUBLIC_BASE=http://lxp.example.com

# Courriel
EMAIL=contact@example.com
PASSWORD=<mot-de-passe-smtp>
SMTP=smtp.example.com
SMTP_EMAIL=contact@example.com
SMTP_PORT=587
FROM="ANDRIA <contact@example.com>"

# Images Unsplash
UNSPLASH_ACCESS_KEY=<cle-unsplash>
```

Utiliser deux clés Mistral en production. `DOCKER_IA_AUTH_SECRET` et `SECRET_KEY`
doivent partager la même valeur.

Le Compose publie l'application en HTTP sur le port 80. Un répartiteur de charge
ou un proxy externe peut gérer TLS. Dans ce cas, remplacer les deux URL publiques
par leur version `https://`.

Si un mot de passe contient `@`, `:`, `/`, `?`, `#` ou `%`, encoder ces
caractères dans les URL de connexion. Garder la valeur brute dans les variables
`*_PASSWORD`.

## 4. Créer le job de construction du LXP

Depuis l'accueil Jenkins :

1. Cliquer sur **Nouveau Item**.
2. Nommer le job `Docker Image Deploy`.
3. Choisir **Pipeline**.
4. Dans **Pipeline**, choisir **Pipeline script from SCM**.
5. Sélectionner **Git** et saisir l'URL du dépôt LXP.
6. Choisir l'identifiant `GITHUB-LXP`.
7. Indiquer la branche `*/main`.
8. Saisir `build.Jenkinsfile` dans **Script Path**.
9. Enregistrer puis lancer **Build Now**.

Le job construit et publie `studiostep/lxp:latest`. Le log doit se terminer
après le `docker push`.

Un webhook GitHub peut déclencher ce job à chaque changement de la branche de
production. Sans webhook, lancer le job avant le déploiement.

## 5. Publier l'image IA

Le dépôt `ANDRIA-IA` contient
`.github/workflows/deploy-docker-hub.yml`. Un push sur sa branche principale
construit et publie `studiostep/lxp-ai:latest`.

Configurer ces secrets dans l'environnement GitHub `production` du dépôt IA :

| Secret GitHub    | Valeur                                                  |
| ---------------- | ------------------------------------------------------- |
| `REGISTRY_USER`  | compte Docker Hub                                       |
| `REGISTRY_TOKEN` | jeton Docker Hub autorisé à publier `studiostep/lxp-ai` |

Avant un déploiement qui modifie l'IA, attendre la fin du workflow GitHub
Actions et contrôler la présence du tag `latest` sur Docker Hub.

## 6. Créer le job de déploiement

Ouvrir le dossier Jenkins `demo` :

1. Cliquer sur **New Élément**.
2. Nommer le job `pull images and deploy app`.
3. Choisir **Pipeline**.
4. Dans **Pipeline**, choisir **Pipeline script from SCM**.
5. Sélectionner **Git** et saisir l'URL du dépôt LXP.
6. Choisir l'identifiant `GITHUB-LXP`.
7. Indiquer la branche `*/main`.
8. Saisir `deployment/direct/Jenkinsfile` dans **Script Path**.
9. Enregistrer.

Le chemin du job devient `demo/pull images and deploy app`, comme dans les
captures.

Lancer **Build Now** après la publication des deux images. Le pipeline exécute
ces opérations :

1. récupère `deployment/direct/compose.yml`, les scripts SQL et les fichiers à
   synchroniser ;
2. prépare la connexion Docker distante par SSH ;
3. crée les répertoires persistants et synchronise `api/uploads/` ;
4. copie `APP_ENV` dans le workspace Jenkins ;
5. récupère les images LXP et IA ;
6. démarre PostgreSQL, pgvector et MongoDB ;
7. applique les migrations Prisma et les triggers de synchronisation IA ;
8. provisionne les tables `andria_*` ;
9. démarre le LXP et le service IA ;
10. génère la clé d'activation du premier administrateur.

Le provisionnement et les migrations acceptent plusieurs exécutions. Le même
job sert au premier déploiement et aux mises à jour.

## 7. Vérifier le déploiement

La dernière étape Jenkins affiche `docker compose ps`. Les services `app`, `ai`,
`db-pg`, `db-ai` et `db-mongo` doivent être démarrés.

Depuis le serveur cible :

```bash
docker ps
docker logs --tail=100 lxp-app-1
docker logs --tail=100 lxp-ai-1
```

Contrôler l'accès public :

```bash
curl -I http://lxp.example.com
```

Contrôler le service IA depuis le conteneur LXP :

```bash
docker exec lxp-app-1 node -e \
  "fetch('http://ai:8000/health').then(r => r.text()).then(console.log)"
```

La réponse attendue est `{"status":"ok"}`.

Contrôler la synchronisation dans les logs IA :

```bash
docker logs --tail=200 lxp-ai-1
```

Le démarrage doit contenir `Initial reconcile complete`, puis une ligne indiquant
que le watcher écoute le canal `andria_lxp_changes`.

## Mise à jour courante

1. Fusionner les changements LXP sur la branche de production.
2. Lancer ou attendre `Docker Image Deploy`.
3. Si le dépôt IA a changé, attendre son workflow GitHub Actions.
4. Lancer `demo/pull images and deploy app`.
5. Contrôler l'état des services et les logs.

## Diagnostic

### `Credentials ... could not be found`

Créer l'identifiant manquant avec l'ID exact. Vérifier aussi que le job peut lire
la portée choisie. Un job placé dans `demo` peut lire les identifiants de ce
dossier et les identifiants système globaux.

### `docker: permission denied`

Donner au compte Jenkins l'accès au démon Docker de l'agent. Donner au compte
SSH l'accès au démon Docker du serveur, puis rouvrir leurs sessions.

### Échec de `docker compose pull`

Vérifier le jeton `DOCKER_REGISTRY` et la présence des deux tags `latest`. Le
pipeline teste aussi que l'image IA contient le module `app.db_provision`; ce
test bloque une image IA trop ancienne.

### Échec de la connexion SSH

Contrôler `APP_SSH_HOST`, `SSH_USER`, `SSH_PORT` et la clé
`SSH_CREDENTIALS`. Tester la même clé depuis l'agent Jenkins.

### Une base reste en attente

Lire les logs sur le serveur :

```bash
docker logs --tail=100 lxp-db-pg-1
docker logs --tail=100 lxp-db-ai-1
docker logs --tail=100 lxp-db-mongo-1
```

Comparer les variables `POSTGRES_*`, `ANDRIA_POSTGRES_*` et `MONGO_*` avec les
URL présentes dans `APP_ENV`.

## Retour arrière

Les pipelines publient et déploient le tag `latest`. Pour revenir à une version
précédente :

1. reconstruire le commit LXP voulu sous `studiostep/lxp:latest` ;
2. republier le commit IA voulu sous `studiostep/lxp-ai:latest` si nécessaire ;
3. relancer `demo/pull images and deploy app`.

Ce mécanisme remplace l'image précédente sur Docker Hub. Des tags immuables par
commit seront nécessaires pour conserver plusieurs versions prêtes au retour
arrière.
