# ANDRIA LXP

ANDRIA réunit une API Node.js, une interface React et trois bases Docker. Le
service IA vit dans le dépôt privé
[`StudioFabrique/ANDRIA-IA`](https://github.com/StudioFabrique/ANDRIA-IA).

## Démarrer en local

### Prérequis

- Node.js 22.18 ou une version supérieure ;
- npm ;
- Docker avec Docker Compose ;
- Git et un accès aux dépôts privés de `StudioFabrique`.

### Installation

```bash
git clone git@github.com:StudioFabrique/lxp.git
cd lxp
npm run init
npm run dev
```

Ouvrez <http://localhost:5173>. L’API écoute sur
<http://localhost:3000>.

`npm run init` installe les dépendances, crée les fichiers d’environnement,
démarre PostgreSQL, pgvector et MongoDB, puis applique les migrations. La
commande affiche aussi la clé qui permet de créer le premier administrateur.

> `npm run init` supprime les volumes Docker locaux du LXP. Sauvegardez vos
> données avec `npm run dump` avant de réinitialiser un poste déjà utilisé.

| Besoin | Commande |
| --- | --- |
| Partir de bases vides | `npm run init` |
| Restaurer un dump local placé dans `api/dumps/` | `npm run init -- --with-data` |
| Charger l’instance de démonstration | `npm run init:demo` |
| Relancer le front et l’API | `npm run dev` |

Les valeurs locales se trouvent dans `api/.env` et `front/.env`. Consultez le
[tableau des variables d’environnement](docs/variables-environnement.md) avant
de les modifier.

## Ajouter le service IA

Placez les deux dépôts dans le même dossier :

```text
projets/
├── lxp/
└── ANDRIA-IA/
```

Après `npm run init` dans le LXP :

```bash
cd ..
git clone --branch prod git@github.com:StudioFabrique/ANDRIA-IA.git
cd ANDRIA-IA
cp env.example .env
```

Renseignez `ANDRIA-IA/.env` avec les valeurs de développement. Les deux clés
Mistral se trouvent dans Infisical EU, environnement `dev`, chemin `/runtime`.
`SECRET_KEY` doit porter la même valeur que `DOCKER_IA_AUTH_SECRET` dans
`lxp/api/.env`.

```bash
docker compose build
docker compose run --rm ai-service python -m app.db_provision
docker compose up -d
curl http://localhost:8000/health
```

Le premier démarrage télécharge les modèles et peut prendre quelques minutes.
Les démarrages suivants demandent seulement `docker compose up -d`.

Le guide [Démarrer ANDRIA-IA en développement](docs/developpement-ia.md)
contient la configuration à copier et les contrôles du watcher.

## Déployer

Les pipelines chargent les secrets depuis le coffre Infisical de l’entreprise.
Aucun fichier `.env` ne doit rester sur le serveur.

| Cible | Méthode | Déclenchement |
| --- | --- | --- |
| Développement partagé | GitHub Actions | Fusion dans `beta` |
| Production avec proxy partagé | Jenkins Caddy | Job basé sur `deployment/caddy/Jenkinsfile` |
| Serveur dédié sans Caddy | Jenkins direct | Job basé sur `deployment/direct/Jenkinsfile` |
| Diagnostic opérateur | `deployment/deploy.sh` | Environnement complet déjà injecté |

Pour une nouvelle cible, créez ses dossiers dans Infisical, contrôlez les
variables, puis lancez le job Jenkins correspondant. Le guide
[Déployer ANDRIA](deployment/README.md) donne la procédure et les paramètres de
chaque méthode. Le
[tableau de production](docs/variables-environnement.md#production) montre la
répartition entre `/ci`, `<préfixe>/ci`, `<préfixe>/runtime` et
`<préfixe>/backup`.

## Documentation

### Premiers pas

- [Variables d’environnement](docs/variables-environnement.md)
- [Service IA en développement](docs/developpement-ia.md)
- [Structure du code](docs/structure-et-architecture.md)

### Exploitation

- [Méthodes de déploiement](deployment/README.md)
- [Sauvegardes et restauration](docs/sauvegardes.md)
- [Mode démonstration](docs/mode-demo.md)

La [documentation du serveur](https://docs.dev.step.eco/) couvre la norme
Infisical et les prérequis communs des serveurs de l’entreprise.
