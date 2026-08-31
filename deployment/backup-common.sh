#!/usr/bin/env bash
# Fonctions communes aux sauvegardes et restaurations. Ce fichier est source
# par backup.sh et restore.sh ; il ne doit pas etre execute directement.

set -euo pipefail
set +x

backup_die() {
    printf '%s\n' "$*" >&2
    exit 1
}

backup_require() {
    local name value missing=''
    for name in "$@"; do
        value="${!name-}"
        [[ -n "$value" ]] || missing="$missing $name"
    done
    [[ -z "$missing" ]] || backup_die "Variables d'environnement manquantes :$missing"
}

backup_restore_pipeline_metadata() {
    local name pipeline_name
    for name in DEPLOY_PATH LXP_DEPLOYMENT_NAME; do
        pipeline_name="PIPELINE_$name"
        if printenv "$pipeline_name" >/dev/null 2>&1; then
            printf -v "$name" '%s' "${!pipeline_name}"
            export "$name"
        fi
    done
}

backup_validate_stack_name() {
    [[ "${LXP_DEPLOYMENT_NAME:-}" =~ ^[A-Za-z0-9][A-Za-z0-9_.-]*$ ]] \
        || backup_die "LXP_DEPLOYMENT_NAME contient des caracteres interdits."
}

backup_validate_host_path() {
    local name="$1" value="${!1-}"
    [[ "$value" == /* ]] || backup_die "$name doit etre un chemin absolu."
    [[ "$value" =~ ^/[A-Za-z0-9._/-]+$ ]] \
        || backup_die "$name ne peut contenir que des lettres, chiffres, points, tirets, underscores et barres obliques."
    [[ "/$value/" != *'/../'* && "/$value/" != *'/./'* ]] \
        || backup_die "$name ne doit contenir ni . ni ..."
}

backup_validate_destination_flags() {
    local name value
    [[ "${BACKUP_ENABLED+x}" != x ]] \
        || backup_die "BACKUP_ENABLED n'est plus pris en charge ; utilisez les trois variables BACKUP_*_ENABLED."
    for name in \
        BACKUP_LOCAL_ENABLED \
        BACKUP_EXTERNAL_VOLUME_ENABLED \
        BACKUP_S3_ENABLED; do
        value="${!name:-false}"
        [[ "$value" == true || "$value" == false ]] \
            || backup_die "$name doit valoir true ou false."
    done
}

backup_has_enabled_destination() {
    [[ "${BACKUP_LOCAL_ENABLED:-false}" == true \
        || "${BACKUP_EXTERNAL_VOLUME_ENABLED:-false}" == true \
        || "${BACKUP_S3_ENABLED:-false}" == true ]]
}

backup_require_enabled_destination() {
    backup_has_enabled_destination \
        || backup_die "Au moins une destination de sauvegarde doit etre activee : BACKUP_LOCAL_ENABLED, BACKUP_EXTERNAL_VOLUME_ENABLED ou BACKUP_S3_ENABLED."
}

backup_runtime_dir=''
backup_started_ssh_agent=false
backup_real_home=''

backup_setup_target_docker() {
    backup_runtime_dir="$(mktemp -d "${TMPDIR:-/tmp}/lxp-backup.XXXXXX")"
    backup_real_home="$HOME"

    if [[ -z "${DEPLOY_SSH_HOST:-}" ]]; then
        BACKUP_REMOTE=false
        export BACKUP_REMOTE
        return
    fi

    backup_require DEPLOY_SSH_USER
    local ssh_port="${DEPLOY_SSH_PORT:-22}"
    local ssh_target="${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}"
    local key_file

    if [[ -n "${DEPLOY_SSH_KEY_FILE:-}" ]]; then
        [[ -r "$DEPLOY_SSH_KEY_FILE" ]] \
            || backup_die "DEPLOY_SSH_KEY_FILE est introuvable ou illisible."
        key_file="$DEPLOY_SSH_KEY_FILE"
    else
        backup_require DEPLOY_SSH_PRIVATE_KEY
        key_file="$backup_runtime_dir/deploy-key"
        printf '%s\n' "$DEPLOY_SSH_PRIVATE_KEY" > "$key_file"
        chmod 600 "$key_file"
    fi

    # Un agent propre au processus evite d'ajouter la cle de deploiement a un
    # agent persistant partage par plusieurs jobs Jenkins.
    eval "$(ssh-agent -s)" >/dev/null
    backup_started_ssh_agent=true
    ssh-add "$key_file" >/dev/null 2>&1 \
        || backup_die "ssh-add refuse la cle de deploiement."

    mkdir -p "$backup_real_home/.ssh"
    chmod 700 "$backup_real_home/.ssh"
    ssh-keyscan -p "$ssh_port" -H "$DEPLOY_SSH_HOST" \
        >> "$backup_real_home/.ssh/known_hosts" 2>/dev/null || true
    sort -u -o "$backup_real_home/.ssh/known_hosts" "$backup_real_home/.ssh/known_hosts"

    BACKUP_SSH_PORT="$ssh_port"
    BACKUP_SSH_TARGET="$ssh_target"
    BACKUP_REMOTE=true
    DOCKER_HOST="ssh://${ssh_target}:${ssh_port}"
    export BACKUP_SSH_PORT BACKUP_SSH_TARGET BACKUP_REMOTE DOCKER_HOST
}

backup_cleanup_target_docker() {
    if [[ "$backup_started_ssh_agent" == true && -n "${SSH_AGENT_PID:-}" ]]; then
        kill "$SSH_AGENT_PID" 2>/dev/null || true
    fi
    if [[ -n "$backup_runtime_dir" && -d "$backup_runtime_dir" ]]; then
        rm -rf -- "$backup_runtime_dir"
    fi
}

backup_target_sh() {
    if [[ "${BACKUP_REMOTE:-false}" == true ]]; then
        ssh -p "$BACKUP_SSH_PORT" "$BACKUP_SSH_TARGET" "$1"
    else
        sh -c "$1"
    fi
}

backup_resolve_deploy_path() {
    if [[ -z "${DEPLOY_PATH:-}" ]]; then
        local deploy_home
        deploy_home="$(backup_target_sh 'printf %s "$HOME"')"
        [[ -n "$deploy_home" ]] \
            || backup_die "Impossible de determiner le repertoire du compte de deploiement."
        DEPLOY_PATH="$deploy_home/$LXP_DEPLOYMENT_NAME"
        export DEPLOY_PATH
        printf 'Chemin de deploiement deduit : %s\n' "$DEPLOY_PATH"
    fi
    backup_validate_host_path DEPLOY_PATH
}

backup_validate_local_repository() {
    backup_require BACKUP_LOCAL_REPOSITORY BACKUP_RESTIC_PASSWORD
    backup_validate_host_path BACKUP_LOCAL_REPOSITORY
    backup_target_sh "test -d '$BACKUP_LOCAL_REPOSITORY'" \
        || backup_die "BACKUP_LOCAL_REPOSITORY doit etre cree avant la sauvegarde : $BACKUP_LOCAL_REPOSITORY"
}

backup_validate_external_volume_repository() {
    backup_require BACKUP_EXTERNAL_VOLUME_REPOSITORY BACKUP_RESTIC_PASSWORD
    backup_validate_host_path BACKUP_EXTERNAL_VOLUME_REPOSITORY
    backup_target_sh "test -d '$BACKUP_EXTERNAL_VOLUME_REPOSITORY'" \
        || backup_die "BACKUP_EXTERNAL_VOLUME_REPOSITORY doit etre cree et monte avant la sauvegarde : $BACKUP_EXTERNAL_VOLUME_REPOSITORY"
}

backup_validate_s3_repository() {
    backup_require \
        BACKUP_S3_REPOSITORY \
        BACKUP_S3_ACCESS_KEY \
        BACKUP_S3_SECRET_KEY \
        BACKUP_RESTIC_PASSWORD
    [[ "$BACKUP_S3_REPOSITORY" == s3:* ]] \
        || backup_die "BACKUP_S3_REPOSITORY doit etre une URL Restic commencant par s3:."
}

backup_validate_repositories() {
    backup_validate_destination_flags
    backup_require_enabled_destination
    [[ "${BACKUP_LOCAL_ENABLED:-false}" != true ]] \
        || backup_validate_local_repository
    [[ "${BACKUP_EXTERNAL_VOLUME_ENABLED:-false}" != true ]] \
        || backup_validate_external_volume_repository
    [[ "${BACKUP_S3_ENABLED:-false}" != true ]] \
        || backup_validate_s3_repository
    backup_target_sh "test -d '$DEPLOY_PATH'" \
        || backup_die "DEPLOY_PATH n'existe pas sur la cible : $DEPLOY_PATH"

    if [[ "${BACKUP_LOCAL_ENABLED:-false}" == true \
        && "${BACKUP_LOCAL_REPOSITORY:-}" == "$DEPLOY_PATH"/* ]]; then
        backup_die "BACKUP_LOCAL_REPOSITORY doit etre place hors de DEPLOY_PATH."
    fi

    [[ "${BACKUP_EXTERNAL_VOLUME_ENABLED:-false}" != true ]] && return

    local deploy_device backup_device
    deploy_device="$(backup_target_sh "findmnt -n -o SOURCE --target '$DEPLOY_PATH' 2>/dev/null || df -P '$DEPLOY_PATH' | awk 'END { print \$1 }'")"
    backup_device="$(backup_target_sh "findmnt -n -o SOURCE --target '$BACKUP_EXTERNAL_VOLUME_REPOSITORY' 2>/dev/null || df -P '$BACKUP_EXTERNAL_VOLUME_REPOSITORY' | awk 'END { print \$1 }'")"
    [[ -n "$deploy_device" && -n "$backup_device" ]] \
        || backup_die "Impossible d'identifier les systemes de fichiers des donnees et de la sauvegarde locale."
    [[ "$deploy_device" != "$backup_device" ]] \
        || backup_die "BACKUP_EXTERNAL_VOLUME_REPOSITORY et DEPLOY_PATH utilisent le meme systeme de fichiers ($deploy_device)."
}

backup_validate_upload_mount() {
    local app_container="$1" upload_source
    docker container inspect "$app_container" >/dev/null 2>&1 \
        || backup_die "Le conteneur applicatif $app_container est absent."
    upload_source="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/app/api/dist/uploads"}}{{.Source}}{{end}}{{end}}' "$app_container")"
    [[ "$upload_source" == "$DEPLOY_PATH/uploads" ]] \
        || backup_die "DEPLOY_PATH ne correspond pas au montage uploads de $app_container ($upload_source)."
    backup_target_sh "test -d '$DEPLOY_PATH/uploads'" \
        || backup_die "Le repertoire uploads de la cible est absent : $DEPLOY_PATH/uploads"
}

BACKUP_RESTIC_IMAGE="${BACKUP_RESTIC_IMAGE:-ghcr.io/restic/restic:0.19.1}"
BACKUP_HELPER_IMAGE="${BACKUP_HELPER_IMAGE:-busybox:1.37.0}"
BACKUP_POSTGRES_IMAGE="${BACKUP_POSTGRES_IMAGE:-postgres:18-alpine}"
BACKUP_MONGO_IMAGE="${BACKUP_MONGO_IMAGE:-mongo:8.2}"

backup_pull_tools() {
    printf 'Preparation des outils de sauvegarde...\n'
    docker pull "$BACKUP_RESTIC_IMAGE" >/dev/null
    docker pull "$BACKUP_HELPER_IMAGE" >/dev/null
}

backup_restic_local() {
    docker run --rm \
        -e RESTIC_PASSWORD \
        -v "$BACKUP_LOCAL_REPOSITORY:/repository" \
        "$BACKUP_RESTIC_IMAGE" -r /repository "$@"
}

backup_restic_external_volume() {
    docker run --rm \
        -e RESTIC_PASSWORD \
        -v "$BACKUP_EXTERNAL_VOLUME_REPOSITORY:/repository" \
        "$BACKUP_RESTIC_IMAGE" -r /repository "$@"
}

backup_restic_s3() {
    docker run --rm \
        -e RESTIC_PASSWORD \
        -e AWS_ACCESS_KEY_ID \
        -e AWS_SECRET_ACCESS_KEY \
        -e AWS_DEFAULT_REGION \
        "$BACKUP_RESTIC_IMAGE" -r "$BACKUP_S3_REPOSITORY" "$@"
}

backup_export_restic_environment() {
    RESTIC_PASSWORD="$BACKUP_RESTIC_PASSWORD"
    AWS_ACCESS_KEY_ID="${BACKUP_S3_ACCESS_KEY:-}"
    AWS_SECRET_ACCESS_KEY="${BACKUP_S3_SECRET_KEY:-}"
    AWS_DEFAULT_REGION="${BACKUP_S3_REGION:-us-east-1}"
    export RESTIC_PASSWORD AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_DEFAULT_REGION
}

backup_ensure_repository() {
    local repository="$1"
    if "$repository" snapshots >/dev/null 2>&1; then
        return
    fi
    printf 'Initialisation du depot Restic...\n'
    "$repository" init
}

backup_snapshot_exists() {
    local repository="$1" tag="$2" snapshots
    snapshots="$("$repository" snapshots --tag "$tag" --json)"
    [[ "$snapshots" == *"$tag"* ]] \
        || backup_die "Le depot ne contient pas le jeu de sauvegarde $tag."
}

backup_wait_for_healthy() {
    local container="$1" attempts="${2:-60}" health
    while (( attempts > 0 )); do
        health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container" 2>/dev/null || true)"
        [[ "$health" == healthy || "$health" == running ]] && return 0
        sleep 2
        ((attempts -= 1))
    done
    return 1
}
