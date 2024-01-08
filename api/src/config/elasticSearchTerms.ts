const basicTerms: string[] = ["titre", "description", "nom", "couleur"];

const nestedTerms: string[] = ["*_titre", "*_nom"];

export const elasticSearchTerms: string[] = [...basicTerms, ...nestedTerms];
