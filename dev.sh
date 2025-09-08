#!/usr/bin/env bash
set -euo pipefail

# Lancement API-IA (Python)
(
  cd ./api-ia
  source venv/bin/activate
  ./start-dev.sh
) &

# Lancement API (Node.js)
(
  cd ./api
  npm run start:dev
) &

# Lancement Front (Node.js)
(
  cd ./front
  npm run dev
) &

# Attend que tous les jobs enfants se terminent
wait