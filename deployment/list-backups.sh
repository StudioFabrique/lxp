#!/usr/bin/env bash
# Liste les snapshots Restic disponibles dans les depots local et S3.

set -euo pipefail
set +x

script_dir="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
# shellcheck source=deployment/backup-common.sh
source "$script_dir/backup-common.sh"

backup_restore_pipeline_metadata
backup_require LXP_DEPLOYMENT_NAME
backup_validate_stack_name

cleanup_status=0
cleanup() {
    cleanup_status=$?
    trap - EXIT INT TERM
    backup_cleanup_target_docker
    exit "$cleanup_status"
}
trap cleanup EXIT INT TERM

backup_setup_target_docker
backup_validate_local_repository
backup_validate_s3_repository
backup_export_restic_environment

printf 'Preparation de Restic...\n'
docker pull "$BACKUP_RESTIC_IMAGE" >/dev/null

printf '\nSnapshots du depot local :\n'
backup_restic_local snapshots --host "$LXP_DEPLOYMENT_NAME"

printf '\nSnapshots du depot S3 :\n'
backup_restic_s3 snapshots --host "$LXP_DEPLOYMENT_NAME"
