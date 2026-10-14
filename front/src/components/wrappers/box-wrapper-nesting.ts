import { createContext } from "react";

/**
 * Indique qu'un BoxWrapper stylé contient le composant courant : un bloc
 * imbriqué prend une teinte plus claire pour se distinguer de son parent.
 */
export const BoxWrapperNestingContext = createContext(false);
