#!/usr/bin/env bash
# Compose de développement local. Il réutilise les fichiers de déploiement
# (deployment/) et ajoute `local.compose.yml`, qui publie les ports des
# bases pour l'API lancée sur la machine. À sourcer depuis la racine du projet.

LXP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
. "$LXP_ROOT/deployment/database-urls.sh"

LXP_LOCAL_NAME="lxp-local"
LXP_COMPOSE_PROJECT="$LXP_LOCAL_NAME"

# Ports publiés par local.compose.yml.
LXP_LOCAL_POSTGRES_PORT=5500
LXP_LOCAL_MONGO_PORT=27000

# Image du service IA publiée sur Docker Hub. Elle remplace le build manuel
# d'ANDRIA-IA : `docker compose pull` suffit.
: "${LXP_AI_IMAGE:=studiostep/lxp-ai}"
: "${LXP_AI_IMAGE_TAG:=latest}"

# Exporte les identifiants lus dans api/.env pour ceux que l'environnement
# (Infisical compris) ne fournit pas. L'environnement existant garde la priorité.
load_api_env_file() {
  [ -f "$LXP_ROOT/api/.env" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    key=${line%%=*}
    case "$key" in
      ''|*[!A-Za-z0-9_]*|'#'*) continue ;;
    esac
    [ -n "${!key+x}" ] && continue
    value=${line#*=}
    value=${value#\"}; value=${value%\"}
    export "$key=$value"
  done < "$LXP_ROOT/api/.env"
}

# Valeurs par défaut des bases : identiques à celles de api/env.example.
apply_local_defaults() {
  : "${POSTGRES_USER:=postgres}" "${POSTGRES_PASSWORD:=postgres}" "${POSTGRES_DB:=lxp}"
  : "${MONGO_ADMIN_USERNAME:=root}" "${MONGO_ADMIN_PASSWORD:=root}" "${MONGO_DATABASE:=lxp}"
  : "${ANDRIA_POSTGRES_USER:=andria}" "${ANDRIA_POSTGRES_PASSWORD:=andria}" "${ANDRIA_POSTGRES_DB:=lxp_ai}"
  export POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB \
    MONGO_ADMIN_USERNAME MONGO_ADMIN_PASSWORD MONGO_DATABASE \
    ANDRIA_POSTGRES_USER ANDRIA_POSTGRES_PASSWORD ANDRIA_POSTGRES_DB
}

# Vrai si le service IA doit tourner : fonctions IA actives et clés Mistral.
# Sous-shell : doit être évalué avant les valeurs neutres de prepare_compose_env.
ai_requested() (
  load_api_env_file
  [ "${DISABLE_AI_FEATURES:-false}" != "true" ] \
    && [ -n "${MISTRAL_STUDENT_API_KEY:-}" ] \
    && [ -n "${MISTRAL_CONTENT_API_KEY:-}" ]
)

# Prépare l'environnement du processus courant pour `docker compose`.
# Les variables sans effet en local (celles de `app`) reçoivent une valeur
# neutre : Compose interpole tous les services, même ceux qu'on ne démarre pas.
prepare_compose_env() {
  load_api_env_file
  apply_local_defaults
  mkdir -p "$LXP_ROOT/api/uploads/activities" "$LXP_ROOT/api/data" "$LXP_ROOT/api/logs"

  export LXP_DEPLOYMENT_NAME="$LXP_LOCAL_NAME"
  export DEPLOY_PATH="$LXP_ROOT/api"
  export LXP_AI_IMAGE LXP_AI_IMAGE_TAG
  : "${SECRET:=local-unused}" "${REGISTER_SECRET:=local-unused}" "${PORT:=3000}"
  : "${ENVIRONMENT:=development}" "${FRONT_URL:=http://localhost:5173/}"
  : "${DOCKER_IA_AUTH_SECRET:=secret-key}"
  : "${LXP_PUBLIC_BASE:=http://localhost:$PORT}"
  : "${UNSPLASH_ACCESS_KEY:=}"
  : "${MISTRAL_STUDENT_API_KEY:=unset}" "${MISTRAL_CONTENT_API_KEY:=unset}"
  export SECRET REGISTER_SECRET PORT ENVIRONMENT FRONT_URL \
    DOCKER_IA_AUTH_SECRET LXP_PUBLIC_BASE \
    UNSPLASH_ACCESS_KEY MISTRAL_STUDENT_API_KEY MISTRAL_CONTENT_API_KEY
}

# lxp_compose <arguments docker compose> : exécute Compose dans un sous-shell,
# avec des URL internes (noms de services). L'environnement de l'appelant n'est
# pas modifié.
lxp_compose() (
  prepare_compose_env
  # Dans le réseau Compose, les services se joignent par leur nom.
  database_build_urls db-pg 5432 db-mongo 27017 db-ai 5432
  docker compose \
    --project-directory "$LXP_ROOT/deployment" \
    -p "$LXP_COMPOSE_PROJECT" \
    -f "$LXP_ROOT/deployment/compose.yml" \
    -f "$LXP_ROOT/deployment/ai.compose.yml" \
    -f "$LXP_ROOT/deployment/local.compose.yml" \
    "$@"
)

# Variables de l'API sur la machine : bases publiées sur localhost. À appeler
# après le chargement éventuel d'Infisical.
export_host_database_env() {
  load_api_env_file
  apply_local_defaults
  database_build_urls localhost "$LXP_LOCAL_POSTGRES_PORT" localhost "$LXP_LOCAL_MONGO_PORT"
}

# Démarre les bases, puis le service IA si l'image et les clés sont disponibles.
# Retourne 0 même sans IA : elle reste facultative en développement.
start_local_services() {
  lxp_compose --progress plain up -d --wait db-pg db-mongo db-ai || return 1

  # Un mot de passe modifié dans Infisical ou api/.env ne change pas celui d'un
  # volume existant : on l'aligne plutôt que d'exiger un `npm run clean`.
  compose() { lxp_compose "$@"; }
  . "$LXP_ROOT/deployment/database-passwords.sh"
  align_database_passwords ai || { warn "Alignement des mots de passe des bases en échec"; return 1; }

  if ! ai_requested; then
    info "Service IA non démarré (DISABLE_AI_FEATURES=true ou clés Mistral absentes)"
    return 0
  fi
  if ! lxp_compose --progress plain pull ai; then
    warn "Image $LXP_AI_IMAGE:$LXP_AI_IMAGE_TAG indisponible (docker login requis ?), service IA ignoré"
    return 0
  fi
  lxp_compose --progress plain run --rm ai python -m app.db_provision \
    || { warn "Provisionnement de la base IA en échec, service IA ignoré"; return 0; }
  lxp_compose --progress plain up -d ai || warn "Démarrage du service IA en échec"
}
