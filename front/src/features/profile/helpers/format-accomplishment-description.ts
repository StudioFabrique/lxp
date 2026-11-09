import { formatTitle } from "../../../utils/helpers/text-helpers";

/**
 * Les réussites sont enregistrées sans sujet (« vient de terminer la leçon … »), car le fil des
 * félicitations les affiche sous le nom de l'apprenant. Dans le journal personnel, il faut un sujet,
 * et le titre de la leçon garde sa majuscule initiale.
 */
export const formatAccomplishmentDescription = (description: string): string =>
  formatTitle(
    description
      .trim()
      .replace(/^vient d(e |')/i, "Vous venez d$1")
      .replace(/(\bla leçon )(\p{L})/u, (_, prefix: string, letter: string) => prefix + letter.toUpperCase()),
  );
