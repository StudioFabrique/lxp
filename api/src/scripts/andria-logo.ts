// Logo ANDRIA affiché par les scripts en ligne de commande, dans la police
// « ANSI Shadow » (blocs █ et traits ╗ ║ ╝) : ces glyphes sont dessinés
// proprement par tous les terminaux, Terminal.app compris, contrairement aux
// demi-blocs (▀) qui y laissent des rayures.

const LETTER_A = [
  " █████╗ ",
  "██╔══██╗",
  "███████║",
  "██╔══██║",
  "██║  ██║",
  "╚═╝  ╚═╝",
];

const LETTER_N = [
  "███╗   ██╗",
  "████╗  ██║",
  "██╔██╗ ██║",
  "██║╚██╗██║",
  "██║ ╚████║",
  "╚═╝  ╚═══╝",
];

const LETTER_D = [
  "██████╗ ",
  "██╔══██╗",
  "██║  ██║",
  "██║  ██║",
  "██████╔╝",
  "╚═════╝ ",
];

const LETTER_R = [
  "██████╗ ",
  "██╔══██╗",
  "██████╔╝",
  "██╔══██╗",
  "██║  ██║",
  "╚═╝  ╚═╝",
];

const LETTER_I = ["██╗", "██║", "██║", "██║", "██║", "╚═╝"];

const RESET = "\x1b[0m";

// Comme dans le logo : « ANDR » en couleur de texte du thème, « iA » en bleu.
// L'ombre (tout ce qui n'est pas █) est plus sombre que la face des lettres.
// Palette 256 couleurs, la seule que Terminal.app accepte.
const TEXT_FACE = "\x1b[1;39m";
const TEXT_SHADOW = "\x1b[2;39m";
const ACCENT_FACE = "\x1b[1;38;5;33m";
const ACCENT_SHADOW = "\x1b[38;5;25m";

interface Letter {
  rows: string[];
  face: string;
  shadow: string;
}

const WORD: readonly Letter[] = [
  { rows: LETTER_A, face: TEXT_FACE, shadow: TEXT_SHADOW },
  { rows: LETTER_N, face: TEXT_FACE, shadow: TEXT_SHADOW },
  { rows: LETTER_D, face: TEXT_FACE, shadow: TEXT_SHADOW },
  { rows: LETTER_R, face: TEXT_FACE, shadow: TEXT_SHADOW },
  { rows: LETTER_I, face: ACCENT_FACE, shadow: ACCENT_SHADOW },
  { rows: LETTER_A, face: ACCENT_FACE, shadow: ACCENT_SHADOW },
];

function supportsColor(): boolean {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return process.env.FORCE_COLOR !== "0";
  return Boolean(process.stdout.isTTY) && process.env.TERM !== "dumb";
}

function colorize(row: string, { face, shadow }: Letter): string {
  return [...row]
    .map((char) => {
      if (char === " ") return char;
      return (char === "█" ? face : shadow) + char + RESET;
    })
    .join("");
}

/**
 * Retourne le logo ANDRIA sur six lignes, en couleurs ANSI lorsque la sortie
 * les accepte, sinon en texte brut (redirection, journaux, NO_COLOR).
 */
export function renderAndriaLogo(): string {
  const colored = supportsColor();

  return LETTER_A.map((_, rowIndex) =>
    WORD.map((letter) => {
      const row = letter.rows[rowIndex];
      return colored ? colorize(row, letter) : row;
    }).join(""),
  ).join("\n");
}
