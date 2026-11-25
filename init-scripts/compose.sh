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
  [[ -f "$LXP_ROOT/api/.env" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    key=${line%%=*}
    case "$key" in
      ''|*[!A-Za-z0-9_]*|'#'*) continue ;;
      *) ;;
    esac
    [[ -n "${!key+x}" ]] && continue
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

# Vrai si le service IA doit tourner : hors démo, fonctions actives et clés Mistral.
# Sous-shell : doit être évalué avant les valeurs neutres de prepare_compose_env.
ai_requested() (
  load_api_env_file
  [[ "${DEMO_MODE:-false}" != "true" ]] \
    && [[ "${DISABLE_AI_FEATURES:-false}" != "true" ]] \
    && [[ -n "${MISTRAL_STUDENT_API_KEY:-}" ]] \
    && [[ -n "${MISTRAL_CONTENT_API_KEY:-}" ]]
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

# Image IA non téléchargée : explique la cause (accès, architecture ou autre) et
# demande s'il faut poursuivre sans le service IA. Sans terminal interactif, on
# poursuit sans IA. Retourne 1 si l'utilisateur préfère s'arrêter pour corriger.
confirm_continue_without_ai() {
  echo
  case "${1:-other}" in
    access)
      warn "Accès refusé à l'image IA $LXP_AI_IMAGE:$LXP_AI_IMAGE_TAG"
      echo
      echo "    Les identifiants Docker Hub sont probablement incorrects ou absents."
      echo
      echo "    Pour corriger :"
      echo "      1. Connectez-vous avec un compte autorisé : docker login"
      echo "      2. Vérifiez l'image visée :"
      echo "           LXP_AI_IMAGE      = $LXP_AI_IMAGE"
      echo "           LXP_AI_IMAGE_TAG  = $LXP_AI_IMAGE_TAG"
      ;;
    architecture)
      warn "L'image IA $LXP_AI_IMAGE:$LXP_AI_IMAGE_TAG n'existe pas pour l'architecture de cette machine"
      echo
      echo "    Vos identifiants Docker Hub fonctionnent, mais le tag visé n'a pas de variante adaptée."
      echo
      echo "    Pour corriger :"
      echo "      1. Choisissez un tag publié pour votre architecture : LXP_AI_IMAGE_TAG"
      echo "           (actuellement $LXP_AI_IMAGE_TAG)"
      echo "      2. Ou demandez à l'équipe de publier une image multi-architecture"
      ;;
    *)
      warn "Téléchargement de l'image IA $LXP_AI_IMAGE:$LXP_AI_IMAGE_TAG en échec"
      echo
      echo "    Consultez le message Docker ci-dessus (réseau, Docker non démarré, etc.)."
      ;;
  esac
  echo
  echo "    Pour travailler sans IA :"
  echo "      DISABLE_AI_FEATURES=true dans api/.env ou Infisical"
  echo
  if [[ ! -t 0 ]]; then
    warn "Terminal non interactif, poursuite sans service IA"
    return 0
  fi
  local answer
  read -r -p "  Continuer sans le service IA ? [y/N] : " answer
  case "$answer" in
    o|O|oui|Oui|OUI|y|Y|yes|YES)
      warn "Service IA ignoré"
      return 0 ;;
    *)
      info "Corrigez l'accès puis relancez la commande"
      return 1 ;;
  esac
}

# Démarre les bases LXP, puis la base et le service IA si l'image et les clés
# sont disponibles. Une démo ne démarre jamais la couche IA.
# Retourne 0 même sans IA : elle reste facultative en développement.
start_local_services() {
  load_api_env_file
  lxp_compose --progress plain up -d --wait db-pg db-mongo || return 1

  # Un mot de passe modifié dans Infisical ou api/.env ne change pas celui d'un
  # volume existant : on l'aligne plutôt que d'exiger un `npm run clean`.
  compose() { lxp_compose "$@"; }
  . "$LXP_ROOT/deployment/database-passwords.sh"
  align_database_passwords || { warn "Alignement des mots de passe des bases en échec"; return 1; }

  if ! ai_requested; then
    # `up` ne supprime pas les services omis : les arrêter garantit qu'un
    # ancien conteneur IA ne reste pas actif après le passage en mode démo.
    lxp_compose --progress plain stop ai db-ai dropout-worker >/dev/null 2>&1 || true
    info "Service IA non démarré (mode démonstration, désactivation ou clés Mistral absentes)"
    return 0
  fi

  lxp_compose --progress plain up -d --wait db-ai || return 1
  align_postgres_password db-ai \
    || { warn "Alignement du mot de passe de la base IA en échec"; return 1; }

  pull_log=$(mktemp)
  lxp_compose --progress plain pull ai 2>&1 | tee "$pull_log"
  if [[ "${PIPESTATUS[0]}" -ne 0 ]]; then
    if grep -qi "no matching manifest" "$pull_log"; then
      pull_failure=architecture
    elif grep -qiE "denied|unauthorized" "$pull_log"; then
      pull_failure=access
    else
      pull_failure=other
    fi
    rm -f "$pull_log"
    confirm_continue_without_ai "$pull_failure" || exit 1
    return 0
  fi
  rm -f "$pull_log"
  lxp_compose --progress plain run --rm ai python -m app.db_provision \
    || { warn "Provisionnement de la base IA en échec, service IA ignoré"; return 0; }
  lxp_compose --progress plain up -d ai || warn "Démarrage du service IA en échec"
}
