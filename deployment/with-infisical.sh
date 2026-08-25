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
secret_paths="${INFISICAL_SECRET_PATHS:-/ci /runtime}"

# Aucun héritage entre dossiers : `dev` lit les dossiers racine, `prod` ceux
# de la cible désignée par INFISICAL_PATH_PREFIX.
case "$INFISICAL_ENVIRONMENT" in
    dev)
        selected_path_prefix=""
        ;;
    prod)
        [ -n "$infisical_path_prefix" ] \
            || die "INFISICAL_PATH_PREFIX est obligatoire dans l'environnement prod."
        case "$infisical_path_prefix" in
            */) die "INFISICAL_PATH_PREFIX ne doit pas se terminer par /." ;;
            /*) ;;
            *) die "INFISICAL_PATH_PREFIX doit commencer par /." ;;
        esac
        selected_path_prefix="$infisical_path_prefix"
        ;;
    *) die "INFISICAL_ENVIRONMENT doit valoir dev ou prod." ;;
esac

ci_path="${selected_path_prefix}/ci"
runtime_path="${selected_path_prefix}/runtime"

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
# SSH. Les chemins ont déjà été choisis uniquement à partir de l'environnement.
case "$secret_paths" in
    /ci)
        printf 'Chargement Infisical : environnement=%s, chemin=%s.\n' \
            "$INFISICAL_ENVIRONMENT" "$ci_path"
        exec infisical run \
            --domain="$infisical_domain" \
            --projectId="$INFISICAL_PROJECT_ID" \
            --env="$INFISICAL_ENVIRONMENT" \
            --path="$ci_path" \
            -- "$@"
        ;;
    "/ci /runtime")
        printf 'Chargement Infisical : environnement=%s, chemins=%s et %s.\n' \
            "$INFISICAL_ENVIRONMENT" "$ci_path" "$runtime_path"
        exec infisical run \
            --domain="$infisical_domain" \
            --projectId="$INFISICAL_PROJECT_ID" \
            --env="$INFISICAL_ENVIRONMENT" \
            --path="$ci_path" \
            --path="$runtime_path" \
            -- "$@"
        ;;
    *)
        die "INFISICAL_SECRET_PATHS doit valoir /ci ou /ci /runtime."
        ;;
esac
