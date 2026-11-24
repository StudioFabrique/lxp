#!/bin/sh
# Aligne les mots de passe des bases sur les valeurs courantes d'Infisical.
# À sourcer après avoir défini une fonction `compose` (docker compose avec les
# fichiers du déploiement ou du développement local).
#
# Pourquoi : PostgreSQL et MongoDB n'appliquent POSTGRES_PASSWORD et
# MONGO_INITDB_ROOT_PASSWORD qu'à la création du volume. Changer la valeur dans
# Infisical ne change donc pas le mot de passe réel, et l'application cesserait
# de se connecter au déploiement suivant. Ces fonctions réalisent le changement
# dans la base elle-même. Elles ne renomment pas un compte : seul le mot de
# passe est aligné. Aucun mot de passe ne passe dans les arguments d'une
# commande de l'hôte : les conteneurs lisent leur propre environnement.

# PostgreSQL : le socket local du conteneur n'exige pas de mot de passe, ce qui
# permet de corriger un compte dont le mot de passe a déjà changé côté Infisical.
align_postgres_password() {
    postgres_service=$1
    postgres_sql="ALTER ROLE :\"role\" WITH PASSWORD :'secret';"

    printf '%s\n' "$postgres_sql" | compose exec -T "$postgres_service" sh -c '
        psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
            -v "role=$POSTGRES_USER" -v "secret=$POSTGRES_PASSWORD"
    ' || return 1
}

# MongoDB : changer un mot de passe exige d'être authentifié. Si le mot de passe
# courant est refusé, l'ancien doit être fourni dans MONGO_ADMIN_PASSWORD_PREVIOUS
# (variable d'environnement du job, à ne pas enregistrer dans Infisical).
align_mongo_password() {
    export MONGO_ADMIN_PASSWORD_PREVIOUS="${MONGO_ADMIN_PASSWORD_PREVIOUS:-}"

    compose exec -T -e MONGO_ADMIN_PASSWORD_PREVIOUS db-mongo sh -c '
        check() {
            mongosh --quiet --norc -u "$MONGO_INITDB_ROOT_USERNAME" -p "$1" \
                --authenticationDatabase admin --eval \
                "if (db.runCommand({connectionStatus: 1}).authInfo.authenticatedUsers.length === 0) quit(1)" \
                > /dev/null 2>&1
        }

        tries=0
        until mongosh --quiet --norc --eval "db.adminCommand(\"ping\").ok" > /dev/null 2>&1; do
            tries=$((tries + 1)); [ "$tries" -lt 30 ] || { echo "MongoDB ne répond pas." >&2; exit 1; }
            sleep 2
        done

        check "$MONGO_INITDB_ROOT_PASSWORD" && exit 0

        if [ -z "$MONGO_ADMIN_PASSWORD_PREVIOUS" ]; then
            echo "Le mot de passe MongoDB d Infisical est refusé. Fournissez l ancien dans MONGO_ADMIN_PASSWORD_PREVIOUS pour l aligner." >&2
            exit 3
        fi
        check "$MONGO_ADMIN_PASSWORD_PREVIOUS" || { echo "MONGO_ADMIN_PASSWORD_PREVIOUS est refusé par MongoDB." >&2; exit 4; }

        mongosh --quiet --norc -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_ADMIN_PASSWORD_PREVIOUS" \
            --authenticationDatabase admin --eval \
            "db.getSiblingDB(\"admin\").changeUserPassword(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD)" \
            > /dev/null
    ' || return 1
    echo "Mot de passe MongoDB conforme à Infisical."
}

# align_database_passwords [ai] : `ai` ajoute la base pgvector du service IA.
align_database_passwords() {
    echo "Alignement des mots de passe des bases..."
    align_postgres_password db-pg || return 1
    [ "${1:-}" != "ai" ] || align_postgres_password db-ai || return 1
    align_mongo_password
}
