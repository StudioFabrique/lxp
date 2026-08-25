#!/bin/sh
# Authentifie un agent Jenkins avec sa Machine Identity, puis exécute une
# commande avec les secrets LXP de l'environnement choisi.

set -eu

# Un `set -x` hérité du job afficherait le Client Secret et le jeton court.
set +x

die() {
    printf '%s\n' "$*" >&2
    exit 1
}

require() {
    for name in "$@"; do
        eval "value=\${$name-}"
        [ -n "$value" ] || die "Variable d'environnement manquante : $name"
    done
}

[ "$#" -gt 0 ] || die "Usage : deployment/with-infisical.sh <commande> [arguments...]"
command -v infisical >/dev/null 2>&1 || die "La CLI Infisical n'est pas installée sur l'agent."

require \
    INFISICAL_UNIVERSAL_AUTH_CLIENT_ID \
    INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET \
    INFISICAL_PROJECT_ID \
    INFISICAL_ENVIRONMENT

# L'organisation est hébergée dans la région EU. La CLI vise par défaut
# l'instance US, où les identités n'existent pas : le login y répond 401
# « Invalid credentials » avec des identifiants pourtant valides.
infisical_domain="${INFISICAL_DOMAIN:-https://eu.infisical.com}"
infisical_path_prefix="${INFISICAL_PATH_PREFIX:-}"

case "$infisical_path_prefix" in
    "") ;;
    /*)
        case "$infisical_path_prefix" in
            */) die "INFISICAL_PATH_PREFIX ne doit pas se terminer par /." ;;
        esac
        ;;
    *) die "INFISICAL_PATH_PREFIX doit être vide ou commencer par /." ;;
esac

# La fusion de plusieurs `--path` n'est disponible que depuis la CLI 0.43.82.
# Les versions antérieures acceptent néanmoins plusieurs occurrences sans les
# fusionner correctement : `/runtime` peut alors remplacer silencieusement
# `/demo/runtime`, comme si DEMO_MODE était resté à false.
secret_paths="${INFISICAL_SECRET_PATHS:-/ci /runtime}"
needs_multiple_paths=false
if [ "$secret_paths" = "/ci /runtime" ] || [ -n "$infisical_path_prefix" ]; then
    needs_multiple_paths=true
fi

if [ "$needs_multiple_paths" = "true" ]; then
    infisical_version="$(
        infisical --version \
            | awk '{ for (i = 1; i <= NF; i++) if ($i ~ /^v?[0-9]+\.[0-9]+\.[0-9]+/) { sub(/^v/, "", $i); print $i; exit } }'
    )"
    [ -n "$infisical_version" ] \
        || die "Impossible de déterminer la version de la CLI Infisical. Version minimale requise : 0.43.82."

    if ! awk -v current="$infisical_version" -v required="0.43.82" 'BEGIN {
        split(current, c, "."); split(required, r, ".")
        for (i = 1; i <= 3; i++) {
            if (c[i] + 0 > r[i] + 0) exit 0
            if (c[i] + 0 < r[i] + 0) exit 1
        }
        exit 0
    }'; then
        die "CLI Infisical $infisical_version trop ancienne : la fusion des chemins exige au minimum 0.43.82.
Mettez à jour la CLI Jenkins.
    fi
fi

common_ci_path="/ci"
common_runtime_path="/runtime"
specific_ci_path="${infisical_path_prefix}/ci"
specific_runtime_path="${infisical_path_prefix}/runtime"

# La CLI reconnaît les deux variables Universal Auth. Elles ne passent donc
# pas dans les arguments du processus, visibles par les autres utilisateurs de
# l'agent avec `ps`.
export INFISICAL_UNIVERSAL_AUTH_CLIENT_ID
export INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET

INFISICAL_TOKEN="$(
    infisical login \
        --method=universal-auth \
        --domain="$infisical_domain" \
        --plain \
        --silent
)"
[ -n "$INFISICAL_TOKEN" ] || die "Infisical n'a renvoyé aucun jeton."

export INFISICAL_TOKEN
export INFISICAL_DISABLE_UPDATE_CHECK=true
unset INFISICAL_UNIVERSAL_AUTH_CLIENT_ID INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET

# Le job de build se limite aux secrets `/ci`. Le déploiement interpole Compose
# sur l'agent Jenkins et charge aussi `/runtime` avant de piloter Docker par
# SSH. Avec plusieurs `--path`, Infisical donne priorité au premier chemin :
# les dossiers spécifiques précèdent donc les dossiers communs qu'ils
# surchargent. Sans préfixe, chaque dossier commun n'est chargé qu'une fois.
case "$secret_paths" in
    /ci)
        if [ -n "$infisical_path_prefix" ]; then
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$specific_ci_path" \
                --path="$common_ci_path" \
                -- "$@"
        else
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$common_ci_path" \
                -- "$@"
        fi
        ;;
    "/ci /runtime")
        if [ -n "$infisical_path_prefix" ]; then
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$specific_ci_path" \
                --path="$specific_runtime_path" \
                --path="$common_ci_path" \
                --path="$common_runtime_path" \
                -- "$@"
        else
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$common_ci_path" \
                --path="$common_runtime_path" \
                -- "$@"
        fi
        ;;
    *)
        die "INFISICAL_SECRET_PATHS doit valoir /ci ou /ci /runtime."
        ;;
esac
