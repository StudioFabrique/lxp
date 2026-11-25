#!/usr/bin/env bash
# Démarre les journaux de développement (VictoriaLogs, Vector) après avoir
# vérifié la configuration : OBSERVABILITY_ENABLED=true et OBSERVABILITY_URL
# renseignée, dans Infisical si le mode est actif, sinon dans api/.env.
# Usage : init-scripts/observability-dev.sh
set -eu
cd "$(dirname "$0")/.."
. ./init-scripts/ui.sh
. ./init-scripts/infisical.sh
. ./init-scripts/compose.sh

load_secrets || { fail "Chargement des secrets Infisical"; exit 1; }
load_api_env_file

errors=0
if [ "${OBSERVABILITY_ENABLED:-}" != "true" ]; then
  warn "OBSERVABILITY_ENABLED doit valoir true (valeur actuelle : ${OBSERVABILITY_ENABLED:-absente})"
  errors=$((errors + 1))
fi
if [ -z "${OBSERVABILITY_URL:-}" ]; then
  warn "OBSERVABILITY_URL est absente (exemple : http://localhost:9428)"
  errors=$((errors + 1))
fi
if [ "$errors" -gt 0 ]; then
  fail "Configuration des journaux incomplète"
  info "À définir dans api/.env (ou Infisical si le mode est actif), puis relancer $(cmd "npm run observability:dev")"
  exit 1
fi

exec docker compose -f deployment/observability/dev.compose.yml up -d
