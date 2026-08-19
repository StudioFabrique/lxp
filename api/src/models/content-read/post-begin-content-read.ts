import type { ContentType } from "../../config/content-read.ts";
import { contentReadRepository } from "./content-read-repository.ts";

/**
 * Marque l'ouverture d'un contenu par un apprenant.
 *
 * Retourne `null` si l'utilisateur n'a pas de fiche `Student` : les formateurs
 * et administrateurs consultent les contenus sans être suivis.
 */
export default async function postBeginContentRead(
  type: ContentType,
  contentId: number,
  userIdMdb: string,
) {
  const student = await contentReadRepository.findStudentByMongoId(userIdMdb);

  if (!student) return null;

  return contentReadRepository.open(type, contentId, student.id);
}
