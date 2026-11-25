#!/usr/bin/env bash
# Secrets de développement via Infisical, facultatif. À sourcer depuis la racine.
#
# Le mode est actif quand `infisical.local.env` existe (fichier ignoré par Git,
# créé par `npm run init`). Sans lui, les variables viennent de api/.env et le
# projet n'a besoin d'aucun compte Infisical.
#
# La CLI Infisical tourne dans le conteneur officiel `infisical/cli` : rien à
# installer sur la machine. Seule l'authentification par Machine Identity
# (Universal Auth) est acceptée : pas de connexion par e-mail et mot de passe.
# Le conteneur ne conserve aucune session.

INFISICAL_LOCAL_CONFIG="./infisical.local.env"
INFISICAL_IMAGE="${INFISICAL_IMAGE:-infisical/cli:0.45.14}"
# Identifiants de la Machine Identity, hors du dépôt, lisibles par vous seul.
# Les variables d'environnement INFISICAL_UNIVERSAL_AUTH_CLIENT_ID et
# INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET, si elles existent, ont priorité.
INFISICAL_CREDENTIALS_FILE="${XDG_CONFIG_HOME:-$HOME/.config}/lxp/infisical-auth"

infisical_enabled() { [ -f "$INFISICAL_LOCAL_CONFIG" ]; }

# Lit le fichier sans l'exécuter : seules les clés connues sont retenues.
infisical_load_config() {
  INFISICAL_DOMAIN="https://eu.infisical.com"
  INFISICAL_ENVIRONMENT="local"
  INFISICAL_SECRET_PATHS="/runtime /mailer"
  INFISICAL_PROJECT_ID=""
  [ -f "$INFISICAL_LOCAL_CONFIG" ] || return 0
  while IFS='=' read -r key value || [ -n "$key" ]; do
    value=${value%\"}; value=${value#\"}
    case "$key" in
      INFISICAL_DOMAIN|INFISICAL_ENVIRONMENT|INFISICAL_SECRET_PATHS|INFISICAL_PROJECT_ID)
        printf -v "$key" '%s' "$value" ;;
    esac
  done < "$INFISICAL_LOCAL_CONFIG"
}

# Lit le fichier d'identifiants sans l'exécuter. L'environnement prime.
infisical_load_credentials() {
  [ -f "$INFISICAL_CREDENTIALS_FILE" ] || return 0
  while IFS='=' read -r key value || [ -n "$key" ]; do
    value=${value%\"}; value=${value#\"}
    case "$key" in
      INFISICAL_UNIVERSAL_AUTH_CLIENT_ID|INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET)
        [ -n "${!key:-}" ] || export "$key=$value" ;;
    esac
  done < "$INFISICAL_CREDENTIALS_FILE"
}

# infisical_cli <arguments> : exécute la CLI dans le conteneur, sans volume.
# Seuls les identifiants de la Machine Identity ou un jeton sont transmis.
infisical_cli() {
  docker run --rm -i \
    -e INFISICAL_TOKEN \
    -e INFISICAL_UNIVERSAL_AUTH_CLIENT_ID \
    -e INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET \
    -e INFISICAL_DISABLE_UPDATE_CHECK=true \
    "$INFISICAL_IMAGE" "$@"
}

# Échange les identifiants de la Machine Identity contre un jeton court.
infisical_token() {
  infisical_cli login --method=universal-auth --domain "$INFISICAL_DOMAIN" \
    --plain --silent
}

# Demande et enregistre les identifiants de la Machine Identity, après avoir
# vérifié qu'ils fonctionnent. Les connexions par compte utilisateur (e-mail,
# mot de passe, SSO) ne sont pas prises en charge.
infisical_login() {
  infisical_load_config
  [ -t 0 ] || { echo "Un terminal interactif est nécessaire." >&2; return 1; }
  echo "Identifiants d'une Machine Identity Infisical (Universal Auth)."
  read -r -p "Client ID : " client_id
  read -r -s -p "Client Secret : " client_secret
  echo
  [ -n "$client_id" ] && [ -n "$client_secret" ] || { echo "Valeur vide." >&2; return 1; }

  (
    export INFISICAL_UNIVERSAL_AUTH_CLIENT_ID="$client_id"
    export INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET="$client_secret"
    [ -n "$(infisical_token)" ]
  ) || { echo "Identifiants refusés par Infisical." >&2; return 1; }

  umask 077
  mkdir -p "$(dirname "$INFISICAL_CREDENTIALS_FILE")"
  {
    printf 'INFISICAL_UNIVERSAL_AUTH_CLIENT_ID="%s"\n' "$client_id"
    printf 'INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET="%s"\n' "$client_secret"
  } > "$INFISICAL_CREDENTIALS_FILE"
  echo "Identifiants enregistrés dans $INFISICAL_CREDENTIALS_FILE"
}

# Écrit la configuration locale et active le mode Infisical.
infisical_write_config() {
  umask 077
  {
    printf 'INFISICAL_DOMAIN="%s"\n' "$1"
    printf 'INFISICAL_PROJECT_ID="%s"\n' "$2"
    printf 'INFISICAL_ENVIRONMENT="%s"\n' "$3"
    printf 'INFISICAL_SECRET_PATHS="%s"\n' "$4"
  } > "$INFISICAL_LOCAL_CONFIG"
}

# Exporte les secrets de chaque dossier dans le processus courant, dans l'ordre
# de INFISICAL_SECRET_PATHS (`/runtime /mailer` par défaut) : une variable d'un
# dossier ultérieur remplace la même variable d'un dossier précédent. Les
# valeurs ne sont jamais écrites sur disque.
infisical_export_secrets() {
  infisical_load_config
  [ -n "$INFISICAL_PROJECT_ID" ] || { echo "INFISICAL_PROJECT_ID manquant dans $INFISICAL_LOCAL_CONFIG" >&2; return 1; }

  infisical_load_credentials
  if [ -z "${INFISICAL_TOKEN:-}" ]; then
    [ -n "${INFISICAL_UNIVERSAL_AUTH_CLIENT_ID:-}" ] && [ -n "${INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET:-}" ] \
      || { echo "Identifiants de Machine Identity absents." >&2; return 1; }
    INFISICAL_TOKEN=$(infisical_token) && [ -n "$INFISICAL_TOKEN" ] || { INFISICAL_TOKEN=""; return 1; }
    token_is_local=true
  fi
  # Le jeton ne reste exporté que le temps des lectures.
  export INFISICAL_TOKEN
  status=0
  for secret_path in $INFISICAL_SECRET_PATHS; do
    infisical_export_path "$secret_path" || { status=1; break; }
  done
  if [ "${token_is_local:-false}" = true ]; then unset INFISICAL_TOKEN token_is_local; fi
  return $status
}

# JSON plutôt que dotenv : le guillemetage est refait ici.
infisical_export_path() {
  secrets_json=$(infisical_cli secrets-manager secrets export \
    --domain "$INFISICAL_DOMAIN" \
    --projectId "$INFISICAL_PROJECT_ID" \
    --env "$INFISICAL_ENVIRONMENT" \
    --path "$1" \
    --format json --silent) || return 1

  exports=$(printf '%s' "$secrets_json" | node -e '
    const input = require("fs").readFileSync(0, "utf8");
    const data = JSON.parse(input);
    const entries = Array.isArray(data)
      ? data.map((item) => [item.key ?? item.secretKey, item.value ?? item.secretValue])
      : Object.entries(data);
    const quote = (v) => "\x27" + String(v).replace(/\x27/g, "\x27\\\x27\x27") + "\x27";
    for (const [key, value] of entries) {
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) && value !== undefined) {
        console.log("export " + key + "=" + quote(value));
      }
    }
  ') || return 1

  eval "$exports"
}

# Charge les secrets si le mode Infisical est actif ; sinon ne fait rien.
load_secrets() {
  infisical_enabled || return 0
  infisical_export_secrets || {
    echo "Secrets Infisical indisponibles. Identifiants Machine Identity : npm run infisical:login" >&2
    return 1
  }
}
