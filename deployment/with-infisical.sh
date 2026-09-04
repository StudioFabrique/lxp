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
secret_paths="${INFISICAL_SECRET_PATHS:-/ci /runtime /mailer}"

# `/ci` à la racine est global dans chaque environnement et contient les accès
# au registre. En prod, le dossier `<préfixe>/ci` contient les accès SSH et les
# secrets CI de la cible ; `<préfixe>/runtime` porte l'application, `/mailer`
# les accès SMTP communs et
# `<préfixe>/backup` porte les secrets de sauvegarde.
registry_ci_path="/ci"
target_ci_path=""
backup_path=""
mailer_path="/mailer"

case "$secret_paths" in
    /ci | "/ci /runtime /mailer" | "/ci /runtime /backup" | "/ci /runtime /mailer /backup") ;;
    *) die "INFISICAL_SECRET_PATHS doit valoir /ci, /ci /runtime /mailer, /ci /runtime /backup ou /ci /runtime /mailer /backup." ;;
esac

case "$INFISICAL_ENVIRONMENT" in
    dev)
        runtime_path="/runtime"
        backup_path="/backup"
        ;;
    prod | pre-prod)
        if [ "$secret_paths" != "/ci" ]; then
            [ -n "$infisical_path_prefix" ] \
                || die "INFISICAL_PATH_PREFIX est obligatoire pour charger les secrets d'une cible dans l'environnement prod."
            case "$infisical_path_prefix" in
                */) die "INFISICAL_PATH_PREFIX ne doit pas se terminer par /." ;;
                /*) ;;
                *) die "INFISICAL_PATH_PREFIX doit commencer par /." ;;
            esac
            target_ci_path="${infisical_path_prefix}/ci"
            runtime_path="${infisical_path_prefix}/runtime"
            backup_path="${infisical_path_prefix}/backup"
        else
            runtime_path=""
        fi
        ;;
    *) die "INFISICAL_ENVIRONMENT doit valoir dev, pre-prod ou prod." ;;
esac

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

# Le job de build se limite aux identifiants de registre de `/ci`. Les
# déploiements ajoutent les accès SSH de la cible et sa configuration runtime.
# Les opérations de sauvegarde demandent explicitement `/backup`, préfixé par
# la cible dans l'environnement prod.
case "$secret_paths" in
    /ci)
        printf 'Chargement Infisical : environnement=%s, chemin=%s.\n' \
            "$INFISICAL_ENVIRONMENT" "$registry_ci_path"
        exec infisical run \
            --domain="$infisical_domain" \
            --projectId="$INFISICAL_PROJECT_ID" \
            --env="$INFISICAL_ENVIRONMENT" \
            --path="$registry_ci_path" \
            -- "$@"
        ;;
    "/ci /runtime /mailer")
        if [ "$INFISICAL_ENVIRONMENT" != "dev" ]; then
            printf 'Chargement Infisical : environnement=%s, chemins=%s, %s, %s et %s.\n' \
                "$INFISICAL_ENVIRONMENT" "$registry_ci_path" "$target_ci_path" "$runtime_path" "$mailer_path"
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$registry_ci_path" \
                --path="$target_ci_path" \
                --path="$runtime_path" \
                --path="$mailer_path" \
                -- "$@"
        else
            printf 'Chargement Infisical : environnement=%s, chemins=%s, %s et %s.\n' \
                "$INFISICAL_ENVIRONMENT" "$registry_ci_path" "$runtime_path" "$mailer_path"
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$registry_ci_path" \
                --path="$runtime_path" \
                --path="$mailer_path" \
                -- "$@"
        fi
        ;;
    "/ci /runtime /backup")
        if [ "$INFISICAL_ENVIRONMENT" != "dev" ]; then
            printf 'Chargement Infisical : environnement=%s, chemins=%s, %s, %s et %s.\n' \
                "$INFISICAL_ENVIRONMENT" "$registry_ci_path" "$target_ci_path" "$runtime_path" "$backup_path"
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$registry_ci_path" \
                --path="$target_ci_path" \
                --path="$runtime_path" \
                --path="$backup_path" \
                -- "$@"
        else
            printf 'Chargement Infisical : environnement=%s, chemins=%s, %s et %s.\n' \
                "$INFISICAL_ENVIRONMENT" "$registry_ci_path" "$runtime_path" "$backup_path"
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$registry_ci_path" \
                --path="$runtime_path" \
                --path="$backup_path" \
                -- "$@"
        fi
        ;;
    "/ci /runtime /mailer /backup")
        if [ "$INFISICAL_ENVIRONMENT" != "dev" ]; then
            printf 'Chargement Infisical : environnement=%s, chemins=%s, %s, %s, %s et %s.\n' \
                "$INFISICAL_ENVIRONMENT" "$registry_ci_path" "$target_ci_path" "$runtime_path" "$mailer_path" "$backup_path"
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$registry_ci_path" \
                --path="$target_ci_path" \
                --path="$runtime_path" \
                --path="$mailer_path" \
                --path="$backup_path" \
                -- "$@"
        else
            printf 'Chargement Infisical : environnement=%s, chemins=%s, %s, %s et %s.\n' \
                "$INFISICAL_ENVIRONMENT" "$registry_ci_path" "$runtime_path" "$mailer_path" "$backup_path"
            exec infisical run \
                --domain="$infisical_domain" \
                --projectId="$INFISICAL_PROJECT_ID" \
                --env="$INFISICAL_ENVIRONMENT" \
                --path="$registry_ci_path" \
                --path="$runtime_path" \
                --path="$mailer_path" \
                --path="$backup_path" \
                -- "$@"
        fi
        ;;
esac
