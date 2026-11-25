#!/usr/bin/env bash
# Exécute une commande avec l'environnement de développement : secrets
# Infisical si le mode est actif, api/.env sinon (chargé par l'API elle-même).
# Usage : init-scripts/with-env.sh <commande> [arguments...]
set -eu
cd "$(dirname "$0")/.."
. ./init-scripts/infisical.sh
. ./init-scripts/compose.sh

[[ "$#" -gt 0 ]] || { echo "Usage : init-scripts/with-env.sh <commande> [arguments...]" >&2; exit 1; }
load_secrets
# Le service IA local est publié sur l'hôte (deployment/local.compose.yml). Le
# dossier Infisical ne fournit que l'adresse interne des déploiements : sans
# valeur, l'API refuse de démarrer.
if infisical_enabled && [[ "${DISABLE_AI_FEATURES:-false}" != "true" ]]; then
  export DOCKER_IA_API_BASE_URL="${DOCKER_IA_API_BASE_URL:-http://127.0.0.1:8000}"
fi
exec "$@"
