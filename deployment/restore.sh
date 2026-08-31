#!/usr/bin/env bash
# Verifie ou restaure une sauvegarde Restic du LXP.

set -euo pipefail
set +x

script_dir="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
# shellcheck source=deployment/backup-common.sh
source "$script_dir/backup-common.sh"

usage() {
    printf '%s\n' \
        "Usage : deployment/restore.sh verify|restore" \
        "  verify  controle et restaure le snapshot dans des conteneurs temporaires" \
        "  restore remplace les donnees de la stack apres confirmation explicite"
}

[[ $# -eq 1 ]] || { usage >&2; exit 2; }
operation="$1"
case "$operation" in verify | restore) ;; *) usage >&2; exit 2 ;; esac

backup_restore_pipeline_metadata
backup_require LXP_DEPLOYMENT_NAME
backup_validate_stack_name

cleanup_status=0
lock_container=''
restore_volume=''
verify_pg=''
verify_mongo=''
cleanup() {
    cleanup_status=$?
    trap - EXIT INT TERM
    [[ -z "$verify_pg" ]] || docker rm -f "$verify_pg" >/dev/null 2>&1 || true
    [[ -z "$verify_mongo" ]] || docker rm -f "$verify_mongo" >/dev/null 2>&1 || true
    [[ -z "$restore_volume" ]] || docker volume rm -f "$restore_volume" >/dev/null 2>&1 || true
    [[ -z "$lock_container" ]] || docker rm -f "$lock_container" >/dev/null 2>&1 || true
    backup_cleanup_target_docker
    exit "$cleanup_status"
}
trap cleanup EXIT INT TERM

backup_setup_target_docker
backup_resolve_deploy_path

RESTORE_SOURCE="${RESTORE_SOURCE:-s3}"
RESTORE_SNAPSHOT="${RESTORE_SNAPSHOT:-latest}"
case "$RESTORE_SOURCE" in local | s3) ;; *) backup_die "RESTORE_SOURCE doit valoir local ou s3." ;; esac
[[ "$RESTORE_SNAPSHOT" =~ ^(latest|[a-f0-9]{8,64})$ ]] \
    || backup_die "RESTORE_SNAPSHOT doit valoir latest ou un identifiant hexadecimal Restic."
if [[ "$operation" == restore && "$RESTORE_SNAPSHOT" == latest ]]; then
    backup_die "Une restauration destructive exige un identifiant Restic immuable, pas latest."
fi
if [[ "$RESTORE_SOURCE" == local ]]; then
    backup_validate_local_repository
else
    backup_validate_s3_repository
fi
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

restore_volume="${LXP_DEPLOYMENT_NAME}_restore_$(date -u +'%Y%m%dT%H%M%S')_$$"
docker volume create "$restore_volume" >/dev/null

restic_selected() {
    local docker_args=(--rm -e RESTIC_PASSWORD -v "$restore_volume:/restore")
    local repository
    if [[ "$RESTORE_SOURCE" == local ]]; then
        docker_args+=(-v "$BACKUP_LOCAL_REPOSITORY:/repository")
        repository=/repository
    else
        docker_args+=(-e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION)
        repository="$BACKUP_S3_REPOSITORY"
    fi
    docker run "${docker_args[@]}" "$BACKUP_RESTIC_IMAGE" -r "$repository" "$@"
}

printf 'Verification integrale du depot %s...\n' "$RESTORE_SOURCE"
restic_selected check --read-data
restic_selected restore "$RESTORE_SNAPSHOT" \
    --host "$LXP_DEPLOYMENT_NAME" --target /restore

database_path=/restore/source/databases
uploads_path=/restore/source/uploads
docker run --rm -v "$restore_volume:/restore:ro" "$BACKUP_HELPER_IMAGE" \
    sh -eu -c "
        test -s '$database_path/postgresql.dump'
        test -s '$database_path/mongodb.archive.gz'
        test -s '$database_path/manifest.txt'
        test -d '$uploads_path'
        cd '$database_path'
        tail -n 2 manifest.txt > /tmp/checksums
        sha256sum -c /tmp/checksums
    "

printf 'Restauration de controle dans PostgreSQL et MongoDB temporaires...\n'
docker pull "$BACKUP_POSTGRES_IMAGE" >/dev/null
docker pull "$BACKUP_MONGO_IMAGE" >/dev/null
verify_pg="$LXP_DEPLOYMENT_NAME-verify-pg-$$"
verify_mongo="$LXP_DEPLOYMENT_NAME-verify-mongo-$$"
docker run -d --name "$verify_pg" \
    -e POSTGRES_PASSWORD=verify -e POSTGRES_DB=verify \
    "$BACKUP_POSTGRES_IMAGE" >/dev/null
docker run -d --name "$verify_mongo" "$BACKUP_MONGO_IMAGE" >/dev/null
for _ in $(seq 1 90); do
    docker exec "$verify_pg" pg_isready -U postgres -d verify >/dev/null 2>&1 && break
    sleep 2
done
docker exec "$verify_pg" pg_isready -U postgres -d verify >/dev/null 2>&1 \
    || backup_die "Le PostgreSQL temporaire n'est pas devenu disponible."
for _ in $(seq 1 90); do
    docker exec "$verify_mongo" mongosh --quiet --eval 'quit(db.adminCommand("ping").ok ? 0 : 1)' >/dev/null 2>&1 && break
    sleep 2
done
docker exec "$verify_mongo" mongosh --quiet --eval 'quit(db.adminCommand("ping").ok ? 0 : 1)' >/dev/null 2>&1 \
    || backup_die "Le MongoDB temporaire n'est pas devenu disponible."

docker run --rm --network "container:$verify_pg" \
    -e PGPASSWORD=verify -v "$restore_volume:/restore:ro" \
    "$BACKUP_POSTGRES_IMAGE" pg_restore \
        --no-owner --no-privileges -h 127.0.0.1 -U postgres -d verify \
        "$database_path/postgresql.dump"
docker run --rm --network "container:$verify_mongo" \
    -v "$restore_volume:/restore:ro" "$BACKUP_MONGO_IMAGE" mongorestore \
        --quiet --host 127.0.0.1 --archive="$database_path/mongodb.archive.gz" --gzip

if [[ "$operation" == verify ]]; then
    printf 'Verification terminee : le snapshot %s est restaurable depuis %s.\n' \
        "$RESTORE_SNAPSHOT" "$RESTORE_SOURCE"
    exit 0
fi

[[ "${RESTORE_CONFIRM:-}" == "$LXP_DEPLOYMENT_NAME" ]] \
    || backup_die "Restauration refusee : RESTORE_CONFIRM doit contenir exactement $LXP_DEPLOYMENT_NAME."

postgres_container="$LXP_DEPLOYMENT_NAME-db-pg"
mongo_container="$LXP_DEPLOYMENT_NAME-db-mongo"
app_container="$LXP_DEPLOYMENT_NAME-app"
ai_container="$LXP_DEPLOYMENT_NAME-ai"
docker container inspect "$postgres_container" "$mongo_container" "$app_container" >/dev/null \
    || backup_die "La stack cible doit etre deployee avant une restauration."
backup_validate_upload_mount "$app_container"

printf 'Arret des services applicatifs...\n'
docker stop "$app_container" >/dev/null
if docker container inspect "$ai_container" >/dev/null 2>&1; then
    docker stop "$ai_container" >/dev/null || true
fi

printf 'Remplacement de PostgreSQL...\n'
docker exec "$postgres_container" sh -eu -c \
    'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
        -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"'
docker run --rm -v "$restore_volume:/restore:ro" "$BACKUP_HELPER_IMAGE" \
    cat "$database_path/postgresql.dump" \
    | docker exec -i "$postgres_container" sh -eu -c \
        'pg_restore --exit-on-error --no-owner --no-privileges \
            -U "$POSTGRES_USER" -d "$POSTGRES_DB"'

printf 'Remplacement de MongoDB...\n'
docker run --rm -v "$restore_volume:/restore:ro" "$BACKUP_HELPER_IMAGE" \
    cat "$database_path/mongodb.archive.gz" \
    | docker exec -i "$mongo_container" sh -eu -c \
        'mongorestore --quiet --drop --archive --gzip \
            --username "$MONGO_INITDB_ROOT_USERNAME" \
            --password "$MONGO_INITDB_ROOT_PASSWORD" \
            --authenticationDatabase admin \
            --nsInclude "$MONGO_INITDB_DATABASE.*"'

printf 'Remplacement des fichiers televerses...\n'
docker run --rm \
    -v "$restore_volume:/restore:ro" \
    -v "$DEPLOY_PATH/uploads:/destination" \
    "$BACKUP_HELPER_IMAGE" sh -eu -c "
        find /destination -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
        cp -a '$uploads_path/.' /destination/
    "

if docker container inspect "$ai_container" >/dev/null 2>&1; then
    printf 'Reprovisionnement de la couche IA...\n'
    docker start "$ai_container" >/dev/null
    backup_wait_for_healthy "$ai_container" 120 \
        || backup_die "Le service IA n'est pas redevenu disponible. L'application reste arretee."
    docker exec "$ai_container" python -m app.db_provision
fi

printf 'Redemarrage de l application...\n'
docker start "$app_container" >/dev/null
backup_wait_for_healthy "$app_container" 120 \
    || backup_die "L'application n'est pas redevenue disponible apres restauration."
printf 'Restauration du snapshot %s terminee depuis %s.\n' "$RESTORE_SNAPSHOT" "$RESTORE_SOURCE"
