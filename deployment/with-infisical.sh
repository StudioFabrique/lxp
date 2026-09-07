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

require INFISICAL_PROJECT_ID INFISICAL_ENVIRONMENT

# L'organisation est hébergée dans la région EU. La CLI vise par défaut
# l'instance US, où les identités n'existent pas : le login y répond 401
# « Invalid credentials » avec des identifiants pourtant valides.
infisical_domain="${INFISICAL_DOMAIN:-https://eu.infisical.com}"
infisical_path_prefix="${INFISICAL_PATH_PREFIX:-}"
secret_paths="${INFISICAL_SECRET_PATHS:-/ci /runtime /mailer}"

# En développement, les dossiers restent à la racine. En prod et pre-prod,
# chaque instance porte ses dossiers `ci`, `runtime` et `backup`. Le dossier
# `mailer` est lui aussi propre à l'instance en prod, mais reste global dans les
# autres environnements.
ci_path="/ci"
runtime_path="/runtime"
backup_path="/backup"
mailer_path="/mailer"

case "$secret_paths" in
    /ci | "/ci /runtime /mailer" | "/ci /runtime /backup" | "/ci /runtime /mailer /backup") ;;
    *) die "INFISICAL_SECRET_PATHS doit valoir /ci, /ci /runtime /mailer, /ci /runtime /backup ou /ci /runtime /mailer /backup." ;;
esac

case "$INFISICAL_ENVIRONMENT" in
    dev) ;;
    prod | pre-prod)
        [ -n "$infisical_path_prefix" ] \
            || die "INFISICAL_PATH_PREFIX est obligatoire dans l'environnement $INFISICAL_ENVIRONMENT."
        case "$infisical_path_prefix" in
            /?*) ;;
            *) die "INFISICAL_PATH_PREFIX doit commencer par / et contenir le nom de l'instance." ;;
        esac
        instance_slug="${infisical_path_prefix#/}"
        case "$instance_slug" in
            */*) die "INFISICAL_PATH_PREFIX doit placer l'instance au premier niveau, par exemple /client-a." ;;
            . | ..) die "INFISICAL_PATH_PREFIX contient un nom d'instance interdit." ;;
            *[!A-Za-z0-9._-]*) die "INFISICAL_PATH_PREFIX ne peut contenir que des lettres, chiffres, points, tirets et underscores." ;;
        esac
        ci_path="${infisical_path_prefix}/ci"
        runtime_path="${infisical_path_prefix}/runtime"
        backup_path="${infisical_path_prefix}/backup"
        if [ "$INFISICAL_ENVIRONMENT" = "prod" ]; then
            mailer_path="${infisical_path_prefix}/mailer"
        fi
        ;;
    *) die "INFISICAL_ENVIRONMENT doit valoir dev, pre-prod ou prod." ;;
esac

# Le wrapper charge en deux temps les chemins qui comprennent `mailer`.
# `runtime` fournit DEMO_MODE au premier passage. Le second charge `mailer`
# pour une instance normale. Le wrapper retire son marqueur interne avant de
# lancer la commande demandée.
if [ "${LXP_INFISICAL_RUNTIME_LOADED:-false}" = "true" ]; then
    unset LXP_INFISICAL_RUNTIME_LOADED

    case "${DEMO_MODE-}" in
        true)
            unset \
                MAILER_EMAIL MAILER_PASSWORD MAILER_SMTP \
                MAILER_DEV_RECIPIENT MAILER_SMTP_PORT MAILER_FROM
            printf 'Mode démonstration : le wrapper ne charge pas la configuration Infisical du mailer.\n'
            exec "$@"
            ;;
        false)
            printf 'Chargement Infisical : environnement=%s, chemin=%s.\n' \
                "$INFISICAL_ENVIRONMENT" "$mailer_path"
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$mailer_path" \
                -- "$@"
            ;;
        *) die "DEMO_MODE doit valoir true ou false dans le dossier runtime." ;;
    esac
fi

require \
    INFISICAL_UNIVERSAL_AUTH_CLIENT_ID \
    INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET

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

# Le job de build se limite au dossier `ci`. En production, même ce chemin est
# propre à l'instance : aucun `/ci` global n'est consulté. Pour un déploiement,
# le wrapper charge `ci` et `runtime` avant `mailer`, qu'il omet en mode démo.
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
    "/ci /runtime /mailer")
        printf 'Chargement Infisical : environnement=%s, chemins=%s et %s.\n' \
            "$INFISICAL_ENVIRONMENT" "$ci_path" "$runtime_path"
        LXP_INFISICAL_RUNTIME_LOADED=true
        export LXP_INFISICAL_RUNTIME_LOADED
        exec infisical run \
            --domain="$infisical_domain" \
            --projectId="$INFISICAL_PROJECT_ID" \
            --env="$INFISICAL_ENVIRONMENT" \
            --path="$ci_path" \
            --path="$runtime_path" \
            -- "$0" "$@"
        ;;
    "/ci /runtime /backup")
        printf 'Chargement Infisical : environnement=%s, chemins=%s, %s et %s.\n' \
            "$INFISICAL_ENVIRONMENT" "$ci_path" "$runtime_path" "$backup_path"
        exec infisical run \
            --domain="$infisical_domain" \
            --projectId="$INFISICAL_PROJECT_ID" \
            --env="$INFISICAL_ENVIRONMENT" \
            --path="$ci_path" \
            --path="$runtime_path" \
            --path="$backup_path" \
            -- "$@"
        ;;
    "/ci /runtime /mailer /backup")
        printf 'Chargement Infisical : environnement=%s, chemins=%s, %s et %s.\n' \
            "$INFISICAL_ENVIRONMENT" "$ci_path" "$runtime_path" "$backup_path"
        LXP_INFISICAL_RUNTIME_LOADED=true
        export LXP_INFISICAL_RUNTIME_LOADED
        exec infisical run \
            --domain="$infisical_domain" \
            --projectId="$INFISICAL_PROJECT_ID" \
            --env="$INFISICAL_ENVIRONMENT" \
            --path="$ci_path" \
            --path="$runtime_path" \
            --path="$backup_path" \
            -- "$0" "$@"
        ;;
esac
