import SearchOption from "../utils/interfaces/search-options";

export const userInGroupSearchOptions = [
  { index: 1, value: "lastname", option: "Nom" },
  { index: 2, value: "firstname", option: "Prénom" },
] as SearchOption[];

export const courseSearchOptions = [
  { index: 1, value: "title", option: "Titre" },
  { index: 2, value: "module", option: "Module" },
  { index: 3, value: "parcours", option: "Parcours" },
  { index: 4, value: "author", option: "Auteur" },
] as SearchOption[];
