# ANDRIA LXP

Application web ANDRIA avec une API Node.js et un frontend React.

## Prérequis

- Node.js 24 ou une version supérieure ;
- npm ;
- Docker avec Docker Compose ;
- Git.

## Démarrer en développement

```bash
git clone git@github.com:StudioFabrique/lxp.git
cd lxp
npm run init
npm run dev
```

`npm run init` supprime les éventuelles données locales, installe les
dépendances, crée les fichiers `.env`, démarre les bases Docker et applique les
migrations afin de commencer avec une application vide. La commande affiche la
clé d'activation nécessaire à la création du premier administrateur.

Pour initialiser l'application avec les données de démonstration :

```bash
npm run init -- --with-data
```

Les comptes de démonstration ci-dessous sont uniquement créés avec cette
option.

Ouvrir <http://localhost:5173>.

| Compte         | Identifiant            | Mot de passe    |
| -------------- | ---------------------- | --------------- |
| Administrateur | `admin@studio.eco`     | `Abcdef@123456` |
| Apprenant      | `apprenant@studio.eco` | `Abcdef@123456` |

## Documentation

- [Service IA et synchronisation en développement](docs/developpement-ia.md)
- [Déploiement complet avec Jenkins](docs/deploiement-jenkins.md)
- [Structure et architecture](docs/1.%20structure-et-architecture.md)
- [Schéma relationnel PostgreSQL](docs/lxp-postgres-erdiagram.mmd)
