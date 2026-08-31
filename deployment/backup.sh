#!/usr/bin/env bash
# Sauvegarde 3-2-1 de PostgreSQL, MongoDB et des fichiers televerses.

set -euo pipefail
set +x

script_dir="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
# shellcheck source=deployment/backup-common.sh
source "$script_dir/backup-common.sh"

backup_restore_pipeline_metadata
backup_require LXP_DEPLOYMENT_NAME
backup_validate_stack_name

BACKUP_REASON="${BACKUP_REASON:-scheduled}"
case "$BACKUP_REASON" in
    scheduled | pre-deploy | post-deploy | manual) ;;
    *) backup_die "BACKUP_REASON doit valoir scheduled, pre-deploy, post-deploy ou manual." ;;
esac

cleanup_status=0
lock_container=''
staging_volume=''
cleanup() {
    cleanup_status=$?
    trap - EXIT INT TERM
    if [[ -n "$staging_volume" ]]; then
        docker volume rm -f "$staging_volume" >/dev/null 2>&1 || true
    fi
    if [[ -n "$lock_container" ]]; then
        docker rm -f "$lock_container" >/dev/null 2>&1 || true
    fi
    backup_cleanup_target_docker
    exit "$cleanup_status"
}
trap cleanup EXIT INT TERM

backup_setup_target_docker
backup_resolve_deploy_path

postgres_container="$LXP_DEPLOYMENT_NAME-db-pg"
mongo_container="$LXP_DEPLOYMENT_NAME-db-mongo"
app_container="$LXP_DEPLOYMENT_NAME-app"

postgres_exists=false
mongo_exists=false
docker container inspect "$postgres_container" >/dev/null 2>&1 && postgres_exists=true
docker container inspect "$mongo_container" >/dev/null 2>&1 && mongo_exists=true

if [[ "$postgres_exists" == false && "$mongo_exists" == false ]]; then
    if [[ "${BACKUP_ALLOW_UNINITIALIZED:-false}" == true ]]; then
        persisted_data=false
        docker volume inspect "${LXP_DEPLOYMENT_NAME}_pg" >/dev/null 2>&1 && persisted_data=true
        docker volume inspect "${LXP_DEPLOYMENT_NAME}_mongo" >/dev/null 2>&1 && persisted_data=true
        if backup_target_sh "test -d '$DEPLOY_PATH/uploads' && find '$DEPLOY_PATH/uploads' -mindepth 1 -print -quit | grep -q ."; then
            persisted_data=true
        fi
        [[ "$persisted_data" == false ]] \
            || backup_die "Les conteneurs sont absents, mais la cible contient encore des volumes ou des fichiers persistants."
        printf 'Cible non initialisee : aucune donnee active a sauvegarder avant le premier deploiement.\n'
        exit 0
    fi
    backup_die "Les conteneurs PostgreSQL et MongoDB de la stack sont absents."
fi
[[ "$postgres_exists" == true && "$mongo_exists" == true ]] \
    || backup_die "La cible est partiellement initialisee : un seul des deux conteneurs de base existe."

[[ -d "$DEPLOY_PATH" || "${BACKUP_REMOTE:-false}" == true ]] || backup_die "DEPLOY_PATH n'existe pas."
backup_validate_repositories
backup_validate_upload_mount "$app_container"
backup_export_restic_environment
backup_pull_tools

requested_lock_container="$LXP_DEPLOYMENT_NAME-backup-lock"
if ! docker create \
    --name "$requested_lock_container" \
    --label "eco.step.lxp.backup-lock=true" \
    --label "eco.step.lxp.stack=$LXP_DEPLOYMENT_NAME" \
    "$BACKUP_HELPER_IMAGE" sleep 86400 >/dev/null; then
    backup_die "Une sauvegarde ou restauration est deja en cours pour $LXP_DEPLOYMENT_NAME."
fi
lock_container="$requested_lock_container"

backup_set_id="$(date -u +'%Y%m%dT%H%M%SZ')-$(printf '%06d' "$$")"
backup_tag="backup-set=$backup_set_id"
staging_volume="${LXP_DEPLOYMENT_NAME}_backup_${backup_set_id//[^A-Za-z0-9]/_}"
docker volume create "$staging_volume" >/dev/null

printf 'Export coherent de PostgreSQL...\n'
docker exec "$postgres_container" sh -eu -c \
    'pg_dump --format=custom --no-owner --no-privileges -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
    | docker run --rm -i -v "$staging_volume:/staging" "$BACKUP_HELPER_IMAGE" \
        sh -eu -c 'umask 077; cat > /staging/postgresql.dump'
docker run --rm -v "$staging_volume:/staging:ro" "$BACKUP_POSTGRES_IMAGE" \
    pg_restore --list /staging/postgresql.dump >/dev/null

printf 'Export coherent de MongoDB...\n'
docker exec "$mongo_container" sh -eu -c \
    'mongodump --quiet --archive --gzip \
        --username "$MONGO_INITDB_ROOT_USERNAME" \
        --password "$MONGO_INITDB_ROOT_PASSWORD" \
        --authenticationDatabase admin \
        --db "$MONGO_INITDB_DATABASE"' \
    | docker run --rm -i -v "$staging_volume:/staging" "$BACKUP_HELPER_IMAGE" \
        sh -eu -c 'umask 077; cat > /staging/mongodb.archive.gz'
docker run --rm -v "$staging_volume:/staging:ro" "$BACKUP_HELPER_IMAGE" \
    cat /staging/mongodb.archive.gz \
    | docker exec -i "$mongo_container" sh -eu -c \
        'mongorestore --quiet --dryRun --archive --gzip \
            --username "$MONGO_INITDB_ROOT_USERNAME" \
            --password "$MONGO_INITDB_ROOT_PASSWORD" \
            --authenticationDatabase admin' >/dev/null

app_image="$(docker inspect --format '{{.Config.Image}}' "$app_container" 2>/dev/null || printf 'unknown')"
docker run --rm \
    -e BACKUP_SET_ID="$backup_set_id" \
    -e BACKUP_CREATED_AT="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
    -e BACKUP_REASON \
    -e LXP_DEPLOYMENT_NAME \
    -e APP_IMAGE="$app_image" \
    -v "$staging_volume:/staging" \
    "$BACKUP_HELPER_IMAGE" sh -eu -c '
        cd /staging
        {
            printf "backup_set=%s\n" "$BACKUP_SET_ID"
            printf "created_at=%s\n" "$BACKUP_CREATED_AT"
            printf "reason=%s\n" "$BACKUP_REASON"
            printf "stack=%s\n" "$LXP_DEPLOYMENT_NAME"
            printf "app_image=%s\n" "$APP_IMAGE"
            sha256sum postgresql.dump mongodb.archive.gz
        } > manifest.txt
    '

backup_ensure_repository backup_restic_local
backup_ensure_repository backup_restic_s3

backup_sources=(
    -v "$staging_volume:/source/databases:ro"
    -v "$DEPLOY_PATH/uploads:/source/uploads:ro"
)

printf 'Ecriture de la copie locale sur le disque de sauvegarde...\n'
docker run --rm \
    -e RESTIC_PASSWORD \
    -v "$BACKUP_LOCAL_REPOSITORY:/repository" \
    "${backup_sources[@]}" \
    "$BACKUP_RESTIC_IMAGE" -r /repository backup \
        --host "$LXP_DEPLOYMENT_NAME" \
        --tag "$backup_tag" --tag "$BACKUP_REASON" \
        /source/databases /source/uploads

printf 'Ecriture de la copie hors site S3...\n'
docker run --rm \
    -e RESTIC_PASSWORD \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    -e AWS_DEFAULT_REGION \
    "${backup_sources[@]}" \
    "$BACKUP_RESTIC_IMAGE" -r "$BACKUP_S3_REPOSITORY" backup \
        --host "$LXP_DEPLOYMENT_NAME" \
        --tag "$backup_tag" --tag "$BACKUP_REASON" \
        /source/databases /source/uploads

backup_snapshot_exists backup_restic_local "$backup_tag"
backup_snapshot_exists backup_restic_s3 "$backup_tag"

printf 'Application de la retention 7 jours, 8 semaines et 12 mois...\n'
backup_restic_local forget \
    --host "$LXP_DEPLOYMENT_NAME" --keep-within 7d --keep-weekly 8 --keep-monthly 12 --prune
backup_restic_s3 forget \
    --host "$LXP_DEPLOYMENT_NAME" --keep-within 7d --keep-weekly 8 --keep-monthly 12 --prune

backup_restic_local check
backup_restic_s3 check

printf 'Sauvegarde 3-2-1 terminee : %s (%s).\n' "$backup_set_id" "$BACKUP_REASON"
