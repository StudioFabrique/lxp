export const themes = {
  light: "classic",
  dark: "classic-dark",
};

export const lightThemes = [
  "classic",
  "ocean",
  "linen",
  "sage",
  "lavender",
  "sunrise",
  "glacier",
  "sand",
] as const;

export const darkThemes = [
  "classic-dark",
  "aurora",
  "ember",
  "abyss",
  "graphite",
  "plum",
  "moss",
  "cobalt",
] as const;

export const themeLabels: Record<string, string> = {
  classic: "Classique",
  ocean: "Océan",
  linen: "Lin",
  sage: "Sauge",
  lavender: "Lavande",
  sunrise: "Lever du jour",
  glacier: "Glacier",
  sand: "Sable",
  "classic-dark": "Classique sombre",
  aurora: "Aurore",
  ember: "Braise",
  abyss: "Abysses",
  graphite: "Graphite",
  plum: "Prune",
  moss: "Mousse",
  cobalt: "Cobalt",
};
