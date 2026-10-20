<img src="docs/assets/andria-logo-readme.svg" alt="ANDRIA" width="880">

<p align="center">
  <strong>Apprentissage Numérique &amp; Développement Renforcé par Intelligence Artificielle</strong>
</p>

<p align="center">
  <a href="#présentation">Présentation</a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="#démarrage-rapide">Démarrage rapide</a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="#commandes-courantes">Commandes courantes</a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="#variables-denvironnement">Variables d'environnement</a>
</p>

<p align="center">
  <a href="#ajouter-le-service-ia-en-local">Ajouter le service IA en local</a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="#déployer-le-lxp">Déployer le LXP</a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="#documentation">Documentation</a>
</p>

---

## Présentation

<p align="center">Ce dépôt contient les trois briques du LXP :</p>

<div align="center">

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Dossier&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Rôle&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Technologies&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                              `api/`                                                                                                               |                                                                                                                                                                                        **API** de la plateforme                                                                                                                                                                                        |                                                                                                                                  Node.js                                                                                                                                   |
|                                                                                                             `front/`                                                                                                              |                                                                                                                                                                                       **Interface** utilisateur                                                                                                                                                                                        |                                                                                                                                   React                                                                                                                                    |
|                                                                                                           `deployment/`                                                                                                           |                                                                                                                                                                                      **Fichiers de déploiement**                                                                                                                                                                                       |                                                                                                                               Caddy, Jenkins                                                                                                                               |

</div>

&nbsp;

> [!NOTE]
> **Bon à savoir**
>
> Le **service IA** n'est pas dans ce dépôt. Il se trouve dans le dépôt privé
> du studio
> [`StudioFabrique/ANDRIA-IA`](https://github.com/StudioFabrique/ANDRIA-IA).

## Démarrage rapide

### Prérequis

- **Node.js 22.18** ou une version plus récente
- **npm**
- **Docker** avec Docker Compose
- **Git**

### Lancer l'application

```bash
git clone git@github.com:StudioFabrique/lxp.git
cd lxp
npm run init
```

1. `git clone` clone le dépôt dans un dossier local nommé `lxp`.
2. `cd lxp` se place dans ce dossier.
3. `npm run init` prépare et lance le projet.

&nbsp;

> [!NOTE]
> **Prêt en moins de 2 minutes**
>
> Avec une connexion internet stable, l'application est lancée en mode
> développement en **moins de 2 minutes**, du clonage du dépôt à l'ouverture de
> l'interface.

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Service&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Adresse&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                                                                                             **Interface**                                                                                                                                                                             |                                                                                                                                                                                                                                                                                                                                                                  <http://localhost:5173>                                                                                                                                                                                                                                                                                                                                                                  |
|                                                                                                                                                                                **API**                                                                                                                                                                                |                                                                                                                                                                                                                                                                                                                                                                  <http://localhost:3000>                                                                                                                                                                                                                                                                                                                                                                  |

### Ce que fait `npm run init`

1. Installe les dépendances.
2. Copie `api/env.example` vers `api/.env`.
3. Copie `front/env.example` vers `front/.env`.
4. Démarre PostgreSQL, pgvector et MongoDB.
5. Applique les migrations.

Pour créer le premier compte administrateur, lancez ensuite
`npm run generate-activation-key` : la commande crée les rôles et permissions
système puis affiche la **clé de création du premier compte administrateur**.

&nbsp;

> [!IMPORTANT]
> **À ne pas oublier**
>
> Saisissez cette clé dans `/init`. Un lien est alors envoyé à l'adresse
> indiquée. Le compte root reste **inactif** tant que ce lien n'a pas été
> ouvert.

Lors des initialisations suivantes, `npm run init` vérifie et réutilise chaque
dossier `node_modules` déjà à jour au lieu de relancer inutilement `npm ci`.
Les dépendances manquantes ou invalides sont réinstallées automatiquement.

## Commandes courantes

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Action&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Commande&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                             Initialiser des bases vides                                                                                              |                                                                                                                 `npm run init`                                                                                                                 |
|                                                                                      Restaurer un dump placé dans `api/dumps/`                                                                                       |                                                                                                              `npm run init:data`                                                                                                               |
|                                                                                         Charger les données de démonstration                                                                                         |                                                                                                              `npm run init:demo`                                                                                                               |
|                                                                                            **Démarrer l'API et le front**                                                                                            |                                                                                                                 `npm run dev`                                                                                                                  |
|                                                                                      Démarrer les bases sans les réinitialiser                                                                                       |                                                                                                `docker compose -f api/docker-compose.yml up -d`                                                                                                |
|                                                                                           Sauvegarder les données locales                                                                                            |                                                                                                                 `npm run dump`                                                                                                                 |
|                                                                                              Lancer les tests de l'API                                                                                               |                                                                                                                   `npm test`                                                                                                                   |

## Variables d'environnement

Le projet utilise deux fichiers en développement :

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Fichier&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Usage&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                                                                                                                                  `api/.env`                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                                                                                 API et bases Docker                                                                                                                                                                                                                                                                                                                                                 |
|                                                                                                                                                                                                                 `front/.env`                                                                                                                                                                                                                  |                                                                                                                                                                                                                                                                                                                                                      Interface                                                                                                                                                                                                                                                                                                                                                      |

`npm run init` crée ces fichiers à partir des fichiers `env.example`. Les
valeurs fournies permettent de **démarrer le LXP en local sans rien modifier**.

Lors de la première création de `api/.env` en développement, un questionnaire
interactif demande les accès **Unsplash** et **SMTP**. Les saisies sensibles ne
sont pas affichées. Tant que le mailer est désactivé, chaque `npm run init`
propose de le configurer.

La page [Variables d'environnement](docs/variables-environnement.md) indique :

- les variables obligatoires en développement ;
- les variables du service IA ;
- les variables requises pour chaque type de déploiement ;
- le dossier Infisical de chaque variable.

&nbsp;

> [!IMPORTANT]
> **Aucun secret dans Git**
>
> Ne placez **aucune clé ni aucun mot de passe réel** dans Git.

## Ajouter le service IA en local

Placez les deux dépôts dans le même dossier :

```text
projets/
├── lxp/
└── ANDRIA-IA/
```

**Initialisez d'abord le LXP**, puis suivez le guide
[Démarrer ANDRIA-IA en développement](docs/developpement-ia.md). Il explique où
trouver les clés Mistral, quelles variables renseigner et comment contrôler le
service.

> [!NOTE]
> **Fonctionner sans le service IA**
>
> Vous pouvez travailler **sans le service IA**. Définissez alors cette valeur
> dans `api/.env` :
>
> ```dotenv
> DISABLE_AI_FEATURES=true
> ```

## Déployer le LXP

Trois chemins sont disponibles :

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Cible&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Méthode&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                                  Serveur de développement partagé                                                                                                                   |                                                                                                                                      GitHub Actions après une fusion dans `beta`                                                                                                                                      |
|                                                                                                                 Serveur avec un proxy Caddy partagé                                                                                                                 |                                                                                                                                      Jenkins avec `deployment/caddy/Jenkinsfile`                                                                                                                                      |
|                                                                                                                      Serveur dédié sans Caddy                                                                                                                       |                                                                                                                                     Jenkins avec `deployment/direct/Jenkinsfile`                                                                                                                                      |

Les pipelines lisent les secrets dans **Infisical**. Ils ne déposent aucun
fichier `.env` sur le serveur.

Consultez le guide [Déployer ANDRIA](deployment/README.md) pour choisir une
méthode et préparer le serveur. Consultez aussi la
[liste des variables de production](docs/variables-environnement.md#déploiement)
avant le premier lancement.

## Documentation

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Besoin&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8288;Page&#8288;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                                                                                         Installer le projet et régler les variables                                                                                                                                                                          |                                                                                                    [Variables d'environnement](docs/variables-environnement.md)                                                                                                    |
|                                                                                                                                                                                      Comprendre le code                                                                                                                                                                                      |                                                                                                      [Structure du projet](docs/structure-et-architecture.md)                                                                                                      |
|                                                                                                                                                                                    Démarrer le service IA                                                                                                                                                                                    |                                                                                                      [Développement avec ANDRIA-IA](docs/developpement-ia.md)                                                                                                      |
|                                                                                                                                                                                    Déployer une instance                                                                                                                                                                                     |                                                                                                            [Guide de déploiement](deployment/README.md)                                                                                                            |
|                                                                                                                                                                            Sauvegarder ou restaurer une instance                                                                                                                                                                             |                                                                                                                 [Sauvegardes](docs/sauvegardes.md)                                                                                                                 |
|                                                                                                                                                                              Gérer l'instance de démonstration                                                                                                                                                                               |                                                                                                              [Mode démonstration](docs/mode-demo.md)                                                                                                               |
|                                                                                                                                                                                Préparer les notes d'un patch                                                                                                                                                                                 |                                                                                                            [Notes de version](docs/notes-de-version.md)                                                                                                            |

---

<p align="center">
  <strong>ANDRIA LXP</strong> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Développé par StudioFabrique
</p>

&nbsp;

&nbsp;

&nbsp;
