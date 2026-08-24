#!/bin/sh
# Point d'entrée unique des pipelines de déploiement du LXP.
#
# Le script ne lit aucun fichier de secrets : toute la configuration arrive par
# l'environnement du processus, typiquement via
#
#   infisical run --env=dev --path=/ci --path=/runtime -- ./deployment/deploy.sh
#
# Il pilote le démon Docker du serveur cible par `DOCKER_HOST=ssh://` lorsque
# `DEPLOY_SSH_HOST` est renseigné, et le démon local sinon. Le serveur cible
# n'héberge que les données persistantes : ni `.env`, ni fichier Compose, ni
# script SQL n'y sont déposés.
#
# Voir `deployment/README.md` pour le contrat d'entrée complet.

set -eu

# Jamais de `set -x` : `ssh`, `rsync` et `docker` héritent de tout
# l'environnement, jeton Infisical compris.
set +x

die() {
    printf '%s\n' "$*" >&2
    exit 1
}

# Accumule les variables manquantes plutôt que d'échouer sur la première : un
# déploiement mal configuré se corrige en une passe.
require() {
    missing=''
    for name in $1; do
        eval "value=\${$name-}"
        [ -n "${value}" ] || missing="$missing $name"
    done
    [ -z "$missing" ] || die "Variables d'environnement manquantes :$missing"
}

# Les pipelines placent leurs métadonnées sous le préfixe `PIPELINE_` avant
# l'injection Infisical. Elles reprennent ici la priorité sur les variables de
# même nom. Un ancien APP_ENV importé par erreur dans `/runtime` ne peut donc
# pas changer l'image, la stack ou la cible décidée par le pipeline.
restore_pipeline_metadata() {
    for name in \
        DEPLOY_MODE DEPLOY_PATH LXP_DEPLOYMENT_NAME \
        LXP_IMAGE LXP_IMAGE_TAG LXP_AI_IMAGE LXP_AI_IMAGE_TAG \
        APP_HOST COMPOSE_WAIT_TIMEOUT DEPLOY_PRUNE CADDY_NETWORK
    do
        eval "is_set=\${PIPELINE_$name+x}"
        if [ "$is_set" = x ]; then
            eval "value=\${PIPELINE_$name}"
            export "$name=$value"
        fi
    done
}

restore_pipeline_metadata

# Isole la configuration SSH et le jeton Docker de ce déploiement. Un agent
# Jenkins persistant conserve ainsi son ~/.ssh/config et son ~/.docker/config.
deploy_runtime_dir="$(mktemp -d "${TMPDIR:-/tmp}/lxp-deploy.XXXXXX")"
cleanup() {
    status=$?
    trap - 0 1 2 15
    rm -rf "$deploy_runtime_dir"
    exit "$status"
}
trap cleanup 0 1 2 15

HOME="$deploy_runtime_dir/home"
DOCKER_CONFIG="$deploy_runtime_dir/docker"
export HOME DOCKER_CONFIG
mkdir -p "$HOME/.ssh" "$DOCKER_CONFIG"
chmod 700 "$HOME/.ssh" "$DOCKER_CONFIG"

# `docker compose` charge automatiquement un `.env` présent dans le répertoire
# du projet. L'environnement du processus reste prioritaire, mais un fichier
# oublié fournirait silencieusement une variable absente d'Infisical et
# masquerait une erreur de configuration.
[ ! -f .env ] || die "Un fichier .env se trouve à la racine du dépôt : le supprimer avant de déployer."

# --------------------------------------------------------------------------
# Mode de déploiement
# --------------------------------------------------------------------------

DEPLOY_MODE="${DEPLOY_MODE:-caddy}"
case "$DEPLOY_MODE" in
    caddy | direct) ;;
    *) die "DEPLOY_MODE doit valoir caddy ou direct, pas « $DEPLOY_MODE »." ;;
esac

BASE_COMPOSE_FILE="deployment/$DEPLOY_MODE/compose.yml"
AI_COMPOSE_FILE="deployment/$DEPLOY_MODE/compose.ai.yml"

[ -f "$BASE_COMPOSE_FILE" ] || die "Fichier Compose introuvable : $BASE_COMPOSE_FILE (le script se lance depuis la racine du dépôt)."

# La couche IA est superposée au socle sauf en mode démonstration, où
# `DEMO_MODE=true` la coupe déjà côté applicatif : la déployer ne ferait que
# consommer un conteneur, un cache de modèles et un accès sortant.
#
# La valeur se lit dans l'environnement, plus par `grep` sur un fichier.
if [ "${DEMO_MODE:-false}" = "true" ]; then
    DEMO_ENABLED=true
    AI_ENABLED=false
    COMPOSE_FILES="-f $BASE_COMPOSE_FILE"
    LOG_SERVICES="app"
    echo "Mode démonstration : la couche IA n'est pas déployée."
else
    DEMO_ENABLED=false
    AI_ENABLED=true
    COMPOSE_FILES="-f $BASE_COMPOSE_FILE -f $AI_COMPOSE_FILE"
    LOG_SERVICES="app ai"
fi

# --------------------------------------------------------------------------
# Validation de la configuration
# --------------------------------------------------------------------------

settings="
PORT ENVIRONMENT FRONT_URL REGISTER_SECRET SECRET
POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB DATABASE_URL
MONGO_ADMIN_USERNAME MONGO_ADMIN_PASSWORD MONGO_DATABASE MONGO_LOCAL_URL
EMAIL PASSWORD SMTP SMTP_EMAIL SMTP_PORT FROM UNSPLASH_ACCESS_KEY
DEPLOY_PATH LXP_IMAGE LXP_IMAGE_TAG LXP_DEPLOYMENT_NAME
"

# Le mode Caddy publie l'application par les labels du proxy partagé ; le mode
# direct publie le port 80 de l'hôte et n'a pas besoin d'un domaine.
if [ "$DEPLOY_MODE" = "caddy" ]; then
    settings="$settings APP_HOST"
fi

if [ "$DEMO_ENABLED" = "true" ]; then
    # Les deux comptes empruntés par les visiteurs, sans lesquels /demo répond
    # « La démonstration n'est pas configurée sur cette instance ».
    settings="$settings DEMO_ADMIN_EMAIL DEMO_STUDENT_EMAIL"
else
    settings="$settings
    ANDRIA_POSTGRES_USER ANDRIA_POSTGRES_PASSWORD ANDRIA_POSTGRES_DB
    ANDRIA_AI_DB_URL LXP_DB_URL
    DOCKER_IA_API_BASE_URL DOCKER_IA_AUTH_SECRET SECRET_KEY
    MISTRAL_STUDENT_API_KEY MISTRAL_CONTENT_API_KEY LXP_PUBLIC_BASE
    LXP_AI_IMAGE LXP_AI_IMAGE_TAG
    "
fi

require "$settings"

if [ "$DEPLOY_MODE" = "caddy" ]; then
    # `APP_HOST` alimente les labels du proxy partagé : un nom mal formé y
    # injecterait une directive Caddy.
    if ! printf '%s' "$APP_HOST" | grep -Eq '^[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?$'; then
        die "APP_HOST doit être un nom DNS sans protocole, chemin ni joker."
    fi

    if printf '%s' "$APP_HOST" | grep -Fq '..'; then
        die "APP_HOST contient deux points consécutifs."
    fi
fi

# --------------------------------------------------------------------------
# Accès au démon Docker cible
# --------------------------------------------------------------------------

if [ -n "${DEPLOY_SSH_HOST:-}" ]; then
    require "DEPLOY_SSH_USER"

    if [ -n "${DEPLOY_SSH_KEY_FILE:-}" ]; then
        # Clé déjà posée sur le disque par l'agent, par exemple le
        # `sshUserPrivateKey` de Jenkins.
        deploy_key_file="$DEPLOY_SSH_KEY_FILE"
    else
        require "DEPLOY_SSH_PRIVATE_KEY"
        deploy_key_file="$deploy_runtime_dir/deploy-key"
        printf '%s\n' "$DEPLOY_SSH_PRIVATE_KEY" > "$deploy_key_file"
        chmod 600 "$deploy_key_file"
    fi

    {
        printf 'Host deploy-target\n'
        printf '  HostName %s\n' "$DEPLOY_SSH_HOST"
        printf '  User %s\n' "$DEPLOY_SSH_USER"
        printf '  Port %s\n' "${DEPLOY_SSH_PORT:-22}"
        printf '  IdentityFile %s\n' "$deploy_key_file"
        printf '  IdentitiesOnly yes\n'
        printf '  StrictHostKeyChecking accept-new\n'
    } > "$HOME/.ssh/config"
    chmod 600 "$HOME/.ssh/config"

    DOCKER_HOST="ssh://deploy-target"
    export DOCKER_HOST
    REMOTE=true
else
    # Démon local : le script sert alors à monter la stack sur un poste de
    # développement.
    REMOTE=false
fi

# Découpage en mots volontaire : `COMPOSE_FILES` porte plusieurs arguments.
compose() {
    docker compose $COMPOSE_FILES "$@"
}

target_sh() {
    if [ "$REMOTE" = "true" ]; then
        ssh deploy-target "$1"
    else
        sh -c "$1"
    fi
}

# Préfixe un chemin de destination pour `rsync` selon la cible.
target_path() {
    if [ "$REMOTE" = "true" ]; then
        printf 'deploy-target:%s' "$1"
    else
        printf '%s' "$1"
    fi
}

# --------------------------------------------------------------------------
# Préparation du serveur cible
# --------------------------------------------------------------------------

# `:?` plutôt que `$DEPLOY_PATH` nu : un chemin vide ferait retomber le `cd`
# distant sur le répertoire personnel, et le `rm -rf` qui suit s'y appliquerait.
: "${DEPLOY_PATH:?DEPLOY_PATH doit être défini}"

case "$DEPLOY_PATH" in
    /*) ;;
    *) die "DEPLOY_PATH doit être un chemin absolu." ;;
esac

case "/$DEPLOY_PATH/" in
    */../* | */./*) die "DEPLOY_PATH ne doit contenir ni . ni ..." ;;
esac

echo "Préparation des répertoires persistants..."
target_sh "mkdir -p '$DEPLOY_PATH/data' '$DEPLOY_PATH/uploads' '$DEPLOY_PATH/logs'"

# Retire les fichiers déposés par les versions précédentes des pipelines, qui
# laissaient le `.env` et les Compose sur la machine.
target_sh "cd '$DEPLOY_PATH' && rm -f .env .deploy.env compose.yml compose.ai.yml && rm -rf deployment api"

echo "Synchronisation des contenus initiaux..."
rsync -avz api/uploads/ "$(target_path "$DEPLOY_PATH/uploads/")"

if [ "$DEPLOY_MODE" = "caddy" ]; then
    echo "Vérification du réseau Caddy partagé..."
    docker network inspect "${CADDY_NETWORK:-caddy}" > /dev/null
fi

# `--quiet` est indispensable : sans lui, la commande imprime la configuration
# interpolée, donc les secrets. Pour déboguer, utiliser `config --no-interpolate`.
compose config --quiet

if [ -n "${REGISTRY_USER:-}" ] && [ -n "${REGISTRY_TOKEN:-}" ]; then
    printf '%s' "$REGISTRY_TOKEN" | docker login --username "$REGISTRY_USER" --password-stdin
fi

echo "Récupération des images..."
compose pull

if [ "$AI_ENABLED" = "true" ]; then
    echo "Vérification de l'image IA..."
    compose run --rm --no-deps ai python -c \
        'import app.db_provision; print("Module app.db_provision disponible")'
fi

# --------------------------------------------------------------------------
# Bases de données
# --------------------------------------------------------------------------

echo "Démarrage des bases..."
compose up -d db-pg db-mongo

echo "Attente des bases..."
until compose exec -T db-pg sh -c \
    'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'; do
    sleep 2
done

if [ "$AI_ENABLED" = "true" ]; then
    compose up -d db-ai

    until compose exec -T db-ai sh -c \
        'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'; do
        sleep 2
    done
fi

if [ "$DEMO_ENABLED" = "true" ]; then
    # Le jeu de démonstration est un dump de données seules : il ne se rejoue
    # que sur un schéma vide, et la démonstration doit revenir à l'état
    # versionné à chaque déploiement. L'instance étant en lecture seule, rien
    # d'utile n'y est perdu.
    echo "Remise à zéro de la base de démonstration..."
    compose exec -T db-pg sh -c \
        'psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"'
fi

echo "Migration Prisma..."
compose run --rm --no-deps -w /app/api app npx prisma migrate deploy

if [ "$DEMO_ENABLED" = "true" ]; then
    echo "Restauration du jeu de démonstration..."
    compose exec -T db-pg sh -c \
        'psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
        < api/dumps/demo/dump-pgsql.sql

    compose cp api/dumps/demo/dump-mongo db-mongo:/tmp/dump-mongo
    # `--nsFrom/--nsTo` : le dump est pris sur la base `lxp`, que l'instance
    # peut avoir nommée autrement.
    compose exec -T db-mongo sh -c \
        'mongorestore --quiet --drop \
            --username "$MONGO_INITDB_ROOT_USERNAME" \
            --password "$MONGO_INITDB_ROOT_PASSWORD" \
            --authenticationDatabase admin \
            --nsInclude "lxp.*" --nsFrom "lxp.*" \
            --nsTo "$MONGO_INITDB_DATABASE.*" \
            /tmp/dump-mongo'
    compose exec -T db-mongo rm -rf /tmp/dump-mongo

    echo "Synchronisation des activités de démonstration..."
    rsync -avz --delete api/dumps/demo/activities/ \
        "$(target_path "$DEPLOY_PATH/uploads/activities/")"
fi

# Posés après la restauration : rejouer un dump n'est pas un changement de
# contenu à signaler, et le trigger tournerait une fois par ligne insérée.
# `pg_dump` vide en outre le search_path de sa session, ce que la fonction
# encaisse depuis qu'elle porte sa propre clause SET. Installés dans les deux
# modes, ce sont de simples `pg_notify` sans écouteur, qui gardent le schéma de
# la démonstration identique à celui de la production.
echo "Installation des triggers ANDRIA..."
compose exec -T db-pg sh -c \
    'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
    < api/src/scripts/andria_notify_triggers.sql

if [ "$DEMO_ENABLED" = "true" ]; then
    echo "Préparation des comptes de démonstration..."
    compose run --rm --no-deps app npm run demo:seed
fi

if [ "$AI_ENABLED" = "true" ]; then
    echo "Provisionnement de la base IA..."
    compose run --rm ai python -m app.db_provision
fi

# --------------------------------------------------------------------------
# Démarrage
# --------------------------------------------------------------------------

# `ai` est tiré par le `depends_on` de `app` quand l'overlay est chargé ;
# `--remove-orphans` retire les conteneurs IA d'une stack qui bascule en
# démonstration.
echo "Démarrage des applications..."
compose up -d --remove-orphans --wait --wait-timeout "${COMPOSE_WAIT_TIMEOUT:-240}" app

if [ "$DEMO_ENABLED" = "false" ]; then
    echo "Génération de la clé d'activation..."
    compose exec -T app npm run generate-activation-key
fi

echo "État des services..."
compose ps
compose logs --no-color --tail=100 $LOG_SERVICES

if [ "${DEPLOY_PRUNE:-false}" = "true" ]; then
    echo "Nettoyage des images inutilisées..."
    docker image prune -f
fi

if [ "$DEPLOY_MODE" = "caddy" ]; then
    echo "LXP disponible via le Caddy partagé sur https://$APP_HOST"
else
    echo "LXP disponible sur le port 80 du serveur cible."
fi
