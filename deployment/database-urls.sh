#!/bin/sh
# Fonctions POSIX partagées par le déploiement et l'initialisation locale.
# Ce fichier doit être sourcé : il ne conserve ni n'affiche aucun secret.

# Encode une valeur selon RFC 3986. Les identifiants générés par un gestionnaire
# de secrets contiennent souvent @, :, / ou %, qui doivent être encodés dans
# les sections user/password d'une URL de base de données.
database_urlencode() (
    LC_ALL=C
    database_value=$1
    database_encoded=''

    while [ -n "$database_value" ]; do
        database_rest=${database_value#?}
        database_char=${database_value%"$database_rest"}
        database_value=$database_rest

        case "$database_char" in
            [A-Za-z0-9._~-]) database_encoded="${database_encoded}${database_char}" ;;
            *)
                database_hex="$(printf '%s' "$database_char" | od -An -tx1 | tr -d ' \n')"
                database_encoded="${database_encoded}%${database_hex}"
                ;;
        esac
    done

    printf '%s' "$database_encoded"
)

# Construit les URL internes sans demander de les stocker dans Infisical ou
# dans un .env. Arguments : hôte/port PostgreSQL, hôte/port MongoDB et,
# facultativement, hôte/port PostgreSQL de l'IA.
database_build_urls() {
    database_postgres_host=$1
    database_postgres_port=$2
    database_mongo_host=$3
    database_mongo_port=$4
    database_andria_host=${5:-}
    database_andria_port=${6:-5432}

    POSTGRES_DB=${POSTGRES_DB:-lxp}
    MONGO_DATABASE=${MONGO_DATABASE:-lxp}

    DATABASE_URL="postgresql://$(database_urlencode "$POSTGRES_USER"):$(database_urlencode "$POSTGRES_PASSWORD")@${database_postgres_host}:${database_postgres_port}/$(database_urlencode "$POSTGRES_DB")"
    MONGO_LOCAL_URL="mongodb://$(database_urlencode "$MONGO_ADMIN_USERNAME"):$(database_urlencode "$MONGO_ADMIN_PASSWORD")@${database_mongo_host}:${database_mongo_port}/$(database_urlencode "$MONGO_DATABASE")?authSource=admin"

    export POSTGRES_DB MONGO_DATABASE DATABASE_URL MONGO_LOCAL_URL

    if [ -n "$database_andria_host" ]; then
        ANDRIA_POSTGRES_DB=${ANDRIA_POSTGRES_DB:-lxp_ai}
        ANDRIA_AI_DB_URL="postgresql://$(database_urlencode "$ANDRIA_POSTGRES_USER"):$(database_urlencode "$ANDRIA_POSTGRES_PASSWORD")@${database_andria_host}:${database_andria_port}/$(database_urlencode "$ANDRIA_POSTGRES_DB")"
        database_lxp_user=${LXP_DB_USER:-$POSTGRES_USER}
        database_lxp_password=${LXP_DB_PASSWORD:-$POSTGRES_PASSWORD}
        LXP_DB_URL="postgresql://$(database_urlencode "$database_lxp_user"):$(database_urlencode "$database_lxp_password")@${database_postgres_host}:${database_postgres_port}/$(database_urlencode "$POSTGRES_DB")"
        export ANDRIA_POSTGRES_DB ANDRIA_AI_DB_URL LXP_DB_URL
    fi
}
