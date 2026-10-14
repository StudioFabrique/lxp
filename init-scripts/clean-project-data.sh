#!/usr/bin/env bash
. ./init-scripts/ui.sh

# Seul, le script demande confirmation ; appelé par `npm run init`, la question
# a déjà été posée et l'en-tête de l'étape est déjà affiché.
if [ -z "$ANDRIA_INIT" ]; then
    box "$c_cyan$c_bold" "ANDRIA  Nettoyage des données" "Conteneurs, volumes Docker, fichiers d'activités"
  show_inline_cancel_hint
  if [ -t 0 ] && has_project_volumes; then
    echo
    if [ -f ./api/dumps/dump-pgsql.sql ] || [ -d ./api/dumps/dump-mongo ]; then
      info "Une sauvegarde est disponible dans api/dumps"
    else
      warn "Aucune sauvegarde réalisée (npm run dump)"
    fi
    read -r -p "Supprimer toutes les données du projet ? [y/N] : " confirm_clean
    if [[ ! "$confirm_clean" =~ ^[Yy]$ ]]; then
      echo "Nettoyage annulé, aucune donnée supprimée."
      exit 0
    fi
  fi
  step "Nettoyage des données existantes"
fi

cd api || { fail "Dossier api introuvable"; exit 1; }

info "Suppression des conteneurs et volumes Docker"
# Supprime uniquement les conteneurs, réseaux et volumes déclarés par le
# Compose de développement lxp-api. L'option -v évite les erreurs lorsque les
# volumes n'existent pas encore et inclut la base pgvector `pg_ai`.
docker compose --progress plain down --volumes --remove-orphans || { fail "Nettoyage des volumes Docker"; exit 1; }

info "Suppression des fichiers d'activités"
rm ./uploads/activities/* 2> /dev/null
rm ./uploads/activities/files/* 2> /dev/null
rm ./uploads/activities/images/* 2> /dev/null
rm ./uploads/activities/videos/* 2> /dev/null

# Ces fichiers survivent à la suppression des volumes Docker. Les conserver
# ferait croire à une nouvelle instance que l'onboarding root est déjà terminé.
info "Réinitialisation de la personnalisation de l'instance"
rm -f ./uploads/instance/instance-settings.json \
  ./uploads/instance/instance-logo.jpeg \
  ./uploads/instance/instance-color.txt

ok "Données nettoyées"
