#!/usr/bin/env bash

set -euo pipefail

repository_root="$(CDPATH='' cd -- "$(dirname -- "$0")/../.." && pwd)"
common_script="$repository_root/deployment/backup-common.sh"
backup_script="$repository_root/deployment/backup.sh"
restore_script="$repository_root/deployment/restore.sh"
list_script="$repository_root/deployment/list-backups.sh"
infisical_wrapper="$repository_root/deployment/with-infisical.sh"
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
    "$list_script" \
    "$repository_root/deployment/restore.sh"
sh -n "$infisical_wrapper"
[[ -x "$list_script" ]] || fail "le script de liste n'est pas executable"

grep -q "INFISICAL_ENVIRONMENT = 'prod'" "$repository_root/deployment/backup.Jenkinsfile" \
    || fail "le job Jenkins planifie n'est pas limite a la production"

grep -Fq "choices: ['backup', 'list-backup', 'verify-backup', 'stop-backup']" \
    "$repository_root/deployment/backup.Jenkinsfile" \
    || fail "les operations Jenkins de sauvegarde sont incompletes"

grep -Fq 'disableConcurrentBuilds()' \
    "$repository_root/deployment/backup.Jenkinsfile" \
    || fail "le job Jenkins autorise des operations concurrentes"

if grep -Fq 'abortPrevious: true' "$repository_root/deployment/backup.Jenkinsfile"; then
    fail "stop-backup interrompt encore le build precedent"
fi

grep -Fq 'properties([pipelineTriggers([])])' \
    "$repository_root/deployment/backup.Jenkinsfile" \
    || fail "stop-backup ne desactive pas le cron Jenkins"

grep -Fq "cron('H H/6 * * *')" \
    "$repository_root/deployment/backup.Jenkinsfile" \
    || fail "backup ne reactive pas le cron Jenkins"

if grep -Fq 'currentBuild.rawBuild' "$repository_root/deployment/backup.Jenkinsfile"; then
    fail "la gestion du cron depend encore d'une approbation Groovy interne"
fi

if grep -Eq 'verify-(s3|local)' "$repository_root/deployment/backup.Jenkinsfile"; then
    fail "les anciennes operations verify-s3 ou verify-local sont encore exposees"
fi

grep -Fq 'RESTORE_SOURCE=local ./deployment/restore.sh verify' \
    "$repository_root/deployment/backup.Jenkinsfile" \
    || fail "verify-backup ne controle pas le depot local"

grep -Fq 'RESTORE_SOURCE=s3 ./deployment/restore.sh verify' \
    "$repository_root/deployment/backup.Jenkinsfile" \
    || fail "verify-backup ne controle pas le depot S3"

mkdir -p "$temporary_dir/infisical-bin"
cat >"$temporary_dir/infisical-bin/infisical" <<'EOF'
#!/bin/sh
case "$1" in
    login) printf 'test-token\n' ;;
    run) printf '%s\n' "$@" ;;
    *) exit 2 ;;
esac
EOF
chmod +x "$temporary_dir/infisical-bin/infisical"

dev_paths_output="$(
    env -i \
        PATH="$temporary_dir/infisical-bin:/usr/bin:/bin" \
        INFISICAL_UNIVERSAL_AUTH_CLIENT_ID=test \
        INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET=test \
        INFISICAL_PROJECT_ID=test \
        INFISICAL_ENVIRONMENT=dev \
        INFISICAL_SECRET_PATHS='/ci /runtime /backup' \
        "$infisical_wrapper" true
)"
[[ "$dev_paths_output" == *"--path=/backup"* ]] \
    || fail "le wrapper Infisical ne charge pas /backup en dev"

prod_paths_output="$(
    env -i \
        PATH="$temporary_dir/infisical-bin:/usr/bin:/bin" \
        INFISICAL_UNIVERSAL_AUTH_CLIENT_ID=test \
        INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET=test \
        INFISICAL_PROJECT_ID=test \
        INFISICAL_ENVIRONMENT=prod \
        INFISICAL_PATH_PREFIX=/demo \
        INFISICAL_SECRET_PATHS='/ci /runtime /backup' \
        "$infisical_wrapper" true
)"
[[ "$prod_paths_output" == *"--path=/demo/backup"* ]] \
    || fail "le wrapper Infisical ne charge pas le dossier backup prefixe en prod"

disabled_output="$(
    env -i PATH="/usr/bin:/bin" HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        "$backup_script"
)"
[[ "$disabled_output" == *"Sauvegarde desactivee"* ]] \
    || fail "la sauvegarde n'est pas desactivee par defaut"

expect_failure "une valeur BACKUP_ENABLED invalide a ete acceptee" \
    env -i PATH="/usr/bin:/bin" HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        BACKUP_ENABLED=invalid "$backup_script"

expect_failure "le job planifie a accepte une sauvegarde desactivee" \
    env -i PATH="/usr/bin:/bin" HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        BACKUP_REQUIRE_ENABLED=true "$backup_script"

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
if [[ -n "${MOCK_DOCKER_LOG:-}" ]]; then
    printf '%s\n' "$*" >> "$MOCK_DOCKER_LOG"
fi
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

list_output="$(
    env -i \
        PATH="$temporary_dir/bin:/usr/bin:/bin" \
        HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        MOCK_DOCKER_LOG="$temporary_dir/docker-list.log" \
        LXP_DEPLOYMENT_NAME=lxp-test \
        BACKUP_LOCAL_REPOSITORY="$temporary_dir/local-backup" \
        BACKUP_S3_REPOSITORY='s3:https://example.test/bucket/lxp-test' \
        BACKUP_S3_ACCESS_KEY=test \
        BACKUP_S3_SECRET_KEY=test \
        BACKUP_RESTIC_PASSWORD=test \
        "$list_script"
)"
[[ "$list_output" == *"Snapshots du depot local"* ]] \
    || fail "list-backup n'affiche pas le depot local"
[[ "$list_output" == *"Snapshots du depot S3"* ]] \
    || fail "list-backup n'affiche pas le depot S3"
[[ "$(grep -c ' snapshots --host lxp-test$' "$temporary_dir/docker-list.log")" -eq 2 ]] \
    || fail "list-backup n'interroge pas les deux depots Restic"

fresh_output="$(
    env -i \
        PATH="$temporary_dir/bin:/usr/bin:/bin" \
        HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        LXP_DEPLOYMENT_NAME=lxp-test \
        DEPLOY_PATH="$temporary_dir/data" \
        BACKUP_ENABLED=true \
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
        BACKUP_ENABLED=true \
        BACKUP_ALLOW_UNINITIALIZED=true \
        "$backup_script"

expect_failure "une cible partiellement initialisee a ete acceptee" \
    env -i \
        PATH="$temporary_dir/bin:/usr/bin:/bin" \
        HOME="$temporary_dir" TMPDIR="$temporary_dir" \
        MOCK_POSTGRES_EXISTS=0 MOCK_MONGO_EXISTS=1 \
        LXP_DEPLOYMENT_NAME=lxp-test \
        DEPLOY_PATH="$temporary_dir/data" \
        BACKUP_ENABLED=true \
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
