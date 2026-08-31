#!/usr/bin/env bash

set -euo pipefail

repository_root="$(CDPATH='' cd -- "$(dirname -- "$0")/../.." && pwd)"
common_script="$repository_root/deployment/backup-common.sh"
backup_script="$repository_root/deployment/backup.sh"
restore_script="$repository_root/deployment/restore.sh"
temporary_dir="$(mktemp -d "${TMPDIR:-/tmp}/lxp-backup-tests.XXXXXX")"
trap 'rm -rf -- "$temporary_dir"' EXIT

fail() {
    printf 'ECHEC: %s\n' "$*" >&2
    exit 1
}

expect_failure() {
    local description="$1"
    shift
    if "$@" >"$temporary_dir/output" 2>&1; then
        fail "$description"
    fi
}

bash -n \
    "$repository_root/deployment/backup-common.sh" \
    "$repository_root/deployment/backup.sh" \
    "$repository_root/deployment/restore.sh"

if grep -q '^[[:space:]]*schedule:' "$repository_root/.github/workflows/backup-dev.yml"; then
    fail "le workflow de developpement contient encore une planification"
fi
grep -q "INFISICAL_ENVIRONMENT = 'prod'" "$repository_root/deployment/backup.Jenkinsfile" \
    || fail "le job Jenkins planifie n'est pas limite a la production"

expect_failure "un nom de stack dangereux a ete accepte" \
    bash -c "source '$common_script'; LXP_DEPLOYMENT_NAME='lxp;false'; backup_validate_stack_name"

expect_failure "un chemin relatif a ete accepte" \
    bash -c "source '$common_script'; BAD_PATH='../backup'; backup_validate_host_path BAD_PATH"

expect_failure "une restauration destructive a accepte le snapshot latest" \
    env -i \
        PATH="/usr/bin:/bin" HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        LXP_DEPLOYMENT_NAME=lxp-test DEPLOY_PATH="$temporary_dir/data" \
        RESTORE_SNAPSHOT=latest "$restore_script" restore

mkdir -p "$temporary_dir/bin" "$temporary_dir/data" "$temporary_dir/local-backup"
cat >"$temporary_dir/bin/docker" <<'EOF'
#!/usr/bin/env bash
if [[ "$*" == *"container inspect lxp-test-db-pg"* ]]; then
    exit "${MOCK_POSTGRES_EXISTS:-1}"
fi
if [[ "$*" == *"container inspect lxp-test-db-mongo"* ]]; then
    exit "${MOCK_MONGO_EXISTS:-1}"
fi
if [[ "$*" == *"volume inspect lxp-test_pg"* ]]; then
    exit "${MOCK_POSTGRES_VOLUME_EXISTS:-1}"
fi
if [[ "$*" == *"volume inspect lxp-test_mongo"* ]]; then
    exit "${MOCK_MONGO_VOLUME_EXISTS:-1}"
fi
exit 0
EOF
chmod +x "$temporary_dir/bin/docker"

fresh_output="$(
    env -i \
        PATH="$temporary_dir/bin:/usr/bin:/bin" \
        HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        LXP_DEPLOYMENT_NAME=lxp-test \
        DEPLOY_PATH="$temporary_dir/data" \
        BACKUP_ALLOW_UNINITIALIZED=true \
        "$backup_script"
)"
[[ "$fresh_output" == *"Cible non initialisee"* ]] \
    || fail "la premiere installation n'a pas ete reconnue"

expect_failure "des volumes orphelins ont ete confondus avec une cible neuve" \
    env -i \
        PATH="$temporary_dir/bin:/usr/bin:/bin" \
        HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        MOCK_POSTGRES_VOLUME_EXISTS=0 \
        LXP_DEPLOYMENT_NAME=lxp-test \
        DEPLOY_PATH="$temporary_dir/data" \
        BACKUP_ALLOW_UNINITIALIZED=true \
        "$backup_script"

expect_failure "une cible partiellement initialisee a ete acceptee" \
    env -i \
        PATH="$temporary_dir/bin:/usr/bin:/bin" \
        HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        MOCK_POSTGRES_EXISTS=0 MOCK_MONGO_EXISTS=1 \
        LXP_DEPLOYMENT_NAME=lxp-test \
        DEPLOY_PATH="$temporary_dir/data" \
        BACKUP_ALLOW_UNINITIALIZED=true \
        "$backup_script"

expect_failure "le depot local place sur le disque de production a ete accepte" \
    bash -c "
        source '$common_script'
        DEPLOY_PATH='$temporary_dir/data'
        BACKUP_LOCAL_REPOSITORY='$temporary_dir/local-backup'
        BACKUP_S3_REPOSITORY='s3:https://example.test/bucket/lxp-test'
        BACKUP_S3_ACCESS_KEY='test'
        BACKUP_S3_SECRET_KEY='test'
        BACKUP_RESTIC_PASSWORD='test'
        BACKUP_REMOTE=false
        backup_validate_repositories
    "

printf 'Tests des scripts de sauvegarde: OK\n'
