#!/usr/bin/env bash
# Démarre ou arrête les conteneurs de développement (bases, service IA).
# Usage : init-scripts/services.sh up | down
set -eu
cd "$(dirname "$0")/.."
. ./init-scripts/ui.sh
. ./init-scripts/infisical.sh
. ./init-scripts/compose.sh

case "${1:-}" in
  up)
    load_secrets
    start_local_services
    ;;
  down)
    load_secrets
    lxp_compose --progress plain down --remove-orphans
    ;;
  *) echo "Usage : init-scripts/services.sh up | down" >&2; exit 1 ;;
esac
