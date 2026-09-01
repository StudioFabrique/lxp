# ANDRIA LXP

ANDRIA est une plateforme de formation. Ce dépôt contient :

- une API Node.js dans `api/` ;
- une interface React dans `front/` ;
- les fichiers de déploiement dans `deployment/`.

####

Le service IA est présent dans le dépôt privé du studio
[`StudioFabrique/ANDRIA-IA`](https://github.com/StudioFabrique/ANDRIA-IA).

## Démarrer le projet en local

### Prérequis

- Node.js 22.18 ou une version plus récente ;
- npm ;
- Docker avec Docker Compose ;
- Git ;

### Première installation

```bash
git clone git@github.com:StudioFabrique/lxp.git
cd lxp
npm run init
npm run dev
```

Ouvrez <http://localhost:5173>. L’API répond sur
<http://localhost:3000>.

`npm run init` effectue les actions suivantes :

1. installe les dépendances ;
2. copie `api/env.example` vers `api/.env` ;
3. copie `front/env.example` vers `front/.env` ;
4. démarre PostgreSQL, pgvector et MongoDB ;
5. applique les migrations et affiche la clé de création du premier compte
   administrateur.

> `npm run init` supprime les volumes Docker locaux du LXP. Lancez
> `npm run dump` avant cette commande si le projet initialisé contient des données à
> conserver.

### Commandes courantes

| Action                                    | Commande                                         |
| ----------------------------------------- | ------------------------------------------------ |
| Initialiser des bases vides               | `npm run init`                                   |
| Restaurer un dump placé dans `api/dumps/` | `npm run init:data`                              |
| Charger les données de démonstration      | `npm run init:demo`                              |
| Démarrer l’API et le front                | `npm run dev`                                    |
| Démarrer les bases sans les réinitialiser | `docker compose -f api/docker-compose.yml up -d` |
| Sauvegarder les données locales           | `npm run dump`                                   |
| Lancer les tests de l’API                 | `npm test`                                       |

## Variables d’environnement

Le projet utilise deux fichiers en développement :

- `api/.env` pour l’API et les bases Docker ;
- `front/.env` pour l’interface.

`npm run init` crée ces fichiers à partir des fichiers `env.example`. Les
valeurs fournies permettent de démarrer le LXP en local.

La page [Variables d’environnement](docs/variables-environnement.md) indique :

- les variables obligatoires en développement ;
- les variables du service IA ;
- les variables requises pour chaque type de déploiement ;
- le dossier Infisical de chaque variable.

Ne placez aucune clé ou aucun mot de passe réel dans Git.

## Ajouter le service IA en local

Placez les deux dépôts dans le même dossier :

```text
projets/
├── lxp/
└── ANDRIA-IA/
```

Initialisez d’abord le LXP, puis suivez le guide
[Démarrer ANDRIA-IA en développement](docs/developpement-ia.md). Le guide
explique où trouver les clés Mistral, quelles variables renseigner et comment
contrôler le service.

Vous pouvez travailler sans le service IA. Définissez alors cette valeur dans
`api/.env` :

```dotenv
DISABLE_AI_FEATURES=true
```

## Déployer le LXP

Trois chemins sont disponibles :

| Cible                               | Méthode                                      |
| ----------------------------------- | -------------------------------------------- |
| Serveur de développement partagé    | GitHub Actions après une fusion dans `beta`  |
| Serveur avec un proxy Caddy partagé | Jenkins avec `deployment/caddy/Jenkinsfile`  |
| Serveur dédié sans Caddy            | Jenkins avec `deployment/direct/Jenkinsfile` |

Les pipelines lisent les secrets dans Infisical. Ils ne déposent pas de
fichier `.env` sur le serveur.

Consultez le guide [Déployer ANDRIA](deployment/README.md) pour choisir une
méthode et préparer le serveur. Consultez aussi la
[liste des variables de production](docs/variables-environnement.md#déploiement)
avant le premier lancement.

## Documentation

| Besoin                                      | Page                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| Installer le projet et régler les variables | [Variables d’environnement](docs/variables-environnement.md) |
| Comprendre le code                          | [Structure du projet](docs/structure-et-architecture.md)     |
| Démarrer le service IA                      | [Développement avec ANDRIA-IA](docs/developpement-ia.md)     |
| Déployer une instance                       | [Guide de déploiement](deployment/README.md)                 |
| Sauvegarder ou restaurer une instance       | [Sauvegardes](docs/sauvegardes.md)                           |
| Gérer l’instance de démonstration           | [Mode démonstration](docs/mode-demo.md)                      |

La [documentation des serveurs STEP](https://docs.dev.step.eco/) décrit la
configuration commune de Jenkins, Infisical et Caddy.
