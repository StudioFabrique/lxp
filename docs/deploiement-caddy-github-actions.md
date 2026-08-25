# Déploiement de développement avec GitHub Actions

Le workflow `.github/workflows/deploy-dev.yml` contrôle les pull requests vers
`beta`, puis construit et déploie chaque commit fusionné sur cette branche.

GitHub Actions s'authentifie auprès d'Infisical avec OIDC :

- le job `image` lit `/ci` pour accéder au registre ;
- le job `deploy` lit `/ci` et `/runtime`, puis appelle
  `deployment/deploy.sh` ;
- ce workflow cible toujours l'environnement Infisical `dev` et ne lit aucun
  dossier préfixé ;
- les variables GitHub `INFISICAL_IDENTITY_ID`, `INFISICAL_PROJECT_SLUG` et
  `APP_HOST` ne contiennent pas de secret.

Le workflow calcule le tag `dev-<sha>`, le nom `lxp-dev` et le chemin
`/home/<user>/lxp-dev`. Les clés correspondantes utilisent le préfixe
`PIPELINE_` afin qu'une valeur importée dans Infisical ne puisse pas les
remplacer.

Le runner pilote le démon Docker du VPS par SSH. Le serveur conserve seulement
`data/`, `uploads/` et `logs/`; aucun `.env` ni jeton Infisical n'y est écrit.

La configuration de l'identité OIDC, les contrôles et le retour arrière sont
décrits dans la
[documentation du serveur](https://docs.dev.step.eco/2-deploiement-lxp/1-deployer-avec-github-actions/).
