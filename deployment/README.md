# Méthodes de déploiement

Le répertoire contient les deux modes de déploiement applicatif disponibles :

```text
deployment/
├── direct/
│   ├── Jenkinsfile
│   └── compose.yml
└── caddy/
    ├── Jenkinsfile
    ├── compose.yml
    ├── Dockerfile
    └── Caddyfile
```

- `direct` publie le port HTTP de l'application directement sur le port 80 du
  VPS ;
- `caddy` publie Caddy sur les ports 80 et 443 et utilise le challenge DNS OVH
  pour gérer le certificat du domaine de l'instance.

Le pipeline de construction de l'image applicative reste à la racine dans
`build.Jenkinsfile`, avec le `Dockerfile` de l'application. Les instructions
détaillées se trouvent dans `docs/deploiement-jenkins.md` et
`docs/deploiement-caddy-jenkins.md`.
