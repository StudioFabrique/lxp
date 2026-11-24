#!/usr/bin/env bash
# Installe les triggers qui signalent les changements de contenu au service IA.
set -eu
cd "$(dirname "$0")/.."
. ./init-scripts/infisical.sh
. ./init-scripts/compose.sh

load_secrets
lxp_compose exec -T db-pg sh -c \
  'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
  < api/src/scripts/andria_notify_triggers.sql
