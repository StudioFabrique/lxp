# Méthodes de déploiement

Le répertoire contient les deux modes de déploiement applicatif disponibles :

```text
deployment/
├── direct/
│   ├── Jenkinsfile
│   ├── compose.yml
│   └── compose.ai.yml
└── caddy/
    ├── Jenkinsfile
    ├── compose.yml
    └── compose.ai.yml
```

- `direct` publie le port HTTP de l'application directement sur le port 80 du
  VPS ;
- `caddy` raccorde l'application au proxy Caddy partagé avec des labels Docker.
  Le VPS conserve le Caddyfile central et le réseau externe `caddy`.

## Socle et couche IA

Dans les deux modes, `compose.yml` porte le **socle** — `app`, `db-pg`,
`db-mongo` — et `compose.ai.yml` y **superpose** la couche IA : le service `ai`,
sa base `db-ai` (pgvector), le cache de modèles `hf_cache`, et le
`depends_on` correspondant sur `app`.

```sh
# Instance ordinaire
docker compose -f compose.yml -f compose.ai.yml up -d app

# Instance de démonstration
docker compose -f compose.yml up -d app
```

Le choix se fait sur la seule variable `DEMO_MODE` du fichier d'environnement :
sur `true`, l'API coupe déjà l'IA côté applicatif (`isAiDisabled()` dans
`api/src/config/config.ts`), la déployer ne ferait que consommer un conteneur,
un cache de modèles et un accès sortant vers Mistral. Les trois pipelines
(`deployment/*/Jenkinsfile` et `.github/workflows/deploy-dev.yml`) lisent cette
variable dans le `.env` et sautent au passage les étapes purement IA
(vérification de l'image, attente de `db-ai`, `app.db_provision`).

`compose.ai.yml` n'est pas autonome : il complète des services et référence des
réseaux déclarés par le socle. Son nom n'est **pas** `compose.override.yml`,
que `docker compose` chargerait automatiquement — un fichier oublié sur
l'instance de démonstration y relancerait l'IA en silence.

Le pipeline de construction de l'image applicative reste à la racine dans
`build.Jenkinsfile`, avec le `Dockerfile` de l'application. Les instructions
détaillées se trouvent dans `docs/deploiement-jenkins.md` et
`docs/deploiement-caddy-jenkins.md`. Le déploiement du VPS de développement par
GitHub Actions est décrit dans `docs/deploiement-caddy-github-actions.md`.
