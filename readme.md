# ANDRIA LXP

Application web ANDRIA avec une API Node.js et un frontend React.

## Prérequis

- Node.js 22.18 ou une version supérieure ;
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

`npm run init` installe les dépendances, crée les fichiers `.env`, démarre les
bases Docker, applique les migrations et charge les données de démonstration.

Ouvrir <http://localhost:5173>.

| Compte | Identifiant | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin@studio.eco` | `Abcdef@123456` |
| Apprenant | `apprenant@studio.eco` | `Abcdef@123456` |

## Documentation

- [Service IA et synchronisation en développement](docs/developpement-ia.md)
- [Déploiement complet avec Jenkins](docs/deploiement-jenkins.md)
- [Structure et architecture](docs/1.%20structure-et-architecture.md)
- [Schéma relationnel PostgreSQL](docs/lxp-postgres-erdiagram.mmd)
