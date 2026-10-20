#!/usr/bin/env bash
# Présentation commune des scripts npm (init, clean, dump) : encadrés colorés
# pour les titres et récapitulatifs, puces et statuts pour le détail.
c_reset=$'\033[0m'; c_bold=$'\033[1m'; c_dim=$'\033[2m'
c_cyan=$'\033[36m'; c_green=$'\033[32m'; c_yellow=$'\033[33m'; c_red=$'\033[31m'
step_count=0

# box <couleur> <ligne>... : encadré aux bordures simples, largeur minimale 60.
box() {
  color="$1"; shift
  inner=58
  for line in "$@"; do
    [ $(( ${#line} + 2 )) -gt "$inner" ] && inner=$(( ${#line} + 2 ))
  done
  border=$(printf '%*s' "$inner" '' | sed 's/ /─/g')
  printf '%s┌%s┐%s\n' "$color" "$border" "$c_reset"
  for line in "$@"; do
    printf '%s│%s %s%*s%s│%s\n' "$color" "$c_reset" "$line" $(( inner - ${#line} - 1 )) '' "$color" "$c_reset"
  done
  printf '%s└%s┘%s\n' "$color" "$border" "$c_reset"
}

# Une étape qui n'a rien affiché est fermée par un tiret, pour ne pas paraître vide.
step_has_output=true
close_step() {
  if [ "$step_count" -gt 0 ] && [ "$step_has_output" = false ]; then
    printf '  %s-----%s\n' "$c_dim" "$c_reset"
  fi
  step_has_output=true
}
# Une question posée compte comme une sortie.
read() { step_has_output=true; builtin read "$@"; }

step() {
  close_step
  step_count=$((step_count + 1))
  step_has_output=false
  echo
  box "$c_cyan" "$(printf 'ÉTAPE %02d  %s' "$step_count" "$1")"
}
# Étape dont les commandes écrivent elles-mêmes à l'écran : jamais considérée comme vide.
step_cmd() { step "$1"; step_has_output=true; }
info() { step_has_output=true; printf '  %s•%s %s\n' "$c_cyan" "$c_reset" "$1"; }
# cmd <commande> : commande mise en évidence sur fond blanc, comme le rappel ctrl+C.
cmd() { printf '%s %s %s' $'\033[47;30m' "$1" "$c_reset"; }
ok()   { step_has_output=true; printf '  %sOK%s %s\n' "$c_green$c_bold" "$c_reset" "$1"; }
warn() { step_has_output=true; printf '  %s!!%s %s\n' "$c_yellow$c_bold" "$c_reset" "$1"; }
fail() {
  echo
  box "$c_red" "ÉCHEC  $1"
}

# Vrai si au moins un volume Docker du Compose lxp-api existe (sinon, rien à perdre).
has_project_volumes() {
  [ -n "$(docker volume ls -q --filter label=com.docker.compose.project=lxp-api 2> /dev/null)" ]
}

# Rappel discret, affiché une fois sous l'en-tête. Volontairement pas épinglé en bas avec une
# zone de défilement : les commandes lancées ensuite (docker, concurrently) réécrivent l'écran.
show_cancel_hint() {
  [ -t 1 ] || return 0
  printf '  %s ctrl+C %s%s pour annuler à tout moment%s\n' $'\033[47;30m' "$c_reset" "$c_dim" "$c_reset"
}
