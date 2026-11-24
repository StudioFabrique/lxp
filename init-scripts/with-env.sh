#!/usr/bin/env bash
# Exécute une commande avec l'environnement de développement : secrets
# Infisical si le mode est actif, api/.env sinon (chargé par l'API elle-même).
# Usage : init-scripts/with-env.sh <commande> [arguments...]
set -eu
cd "$(dirname "$0")/.."
. ./init-scripts/infisical.sh
. ./init-scripts/compose.sh

[ "$#" -gt 0 ] || { echo "Usage : init-scripts/with-env.sh <commande> [arguments...]" >&2; exit 1; }
load_secrets
exec "$@"
