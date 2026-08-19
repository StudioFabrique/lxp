# Méthodes de déploiement

Le répertoire contient les deux modes de déploiement applicatif disponibles :

```text
deployment/
├── direct/
│   ├── Jenkinsfile
│   └── compose.yml
└── caddy/
    ├── Jenkinsfile
    └── compose.yml
```

- `direct` publie le port HTTP de l'application directement sur le port 80 du
  VPS ;
- `caddy` raccorde l'application au proxy Caddy partagé avec des labels Docker.
  Le VPS conserve le Caddyfile central et le réseau externe `caddy`.

Le pipeline de construction de l'image applicative reste à la racine dans
`build.Jenkinsfile`, avec le `Dockerfile` de l'application. Les instructions
détaillées se trouvent dans `docs/deploiement-jenkins.md` et
`docs/deploiement-caddy-jenkins.md`. Le déploiement du VPS de développement par
GitHub Actions est décrit dans `docs/deploiement-caddy-github-actions.md`.
