#!/bin/sh
# Construction Jenkins de l'image LXP avec les identifiants de `/ci`.

set -eu
set +x

: "${REGISTRY_USER:?REGISTRY_USER doit être défini}"
: "${REGISTRY_TOKEN:?REGISTRY_TOKEN doit être défini}"

image="${PIPELINE_LXP_IMAGE:-studiostep/lxp}"
tag="${PIPELINE_LXP_IMAGE_TAG:-latest}"
alias_tag="${PIPELINE_LXP_IMAGE_ALIAS_TAG:-}"

build_runtime_dir="$(mktemp -d "${TMPDIR:-/tmp}/lxp-build.XXXXXX")"
cleanup() {
    status=$?
    trap - 0 1 2 15
    rm -rf "$build_runtime_dir"
    exit "$status"
}
trap cleanup 0 1 2 15

DOCKER_CONFIG="$build_runtime_dir/docker"
export DOCKER_CONFIG
mkdir -p "$DOCKER_CONFIG"
chmod 700 "$DOCKER_CONFIG"

printf '%s' "$REGISTRY_TOKEN" | \
    docker login --username "$REGISTRY_USER" --password-stdin

docker build -t "$image:$tag" .
docker push "$image:$tag"

if [ -n "$alias_tag" ] && [ "$alias_tag" != "$tag" ]; then
    docker tag "$image:$tag" "$image:$alias_tag"
    docker push "$image:$alias_tag"
fi
