import putFinishReadLesson from "../lesson/put-finish-read-lesson.ts";
import type { ContentType } from "../../config/content-read.ts";
import { contentReadRepository } from "./content-read-repository.ts";

/**
 * Marque un contenu comme terminé. Idempotent : un contenu déjà terminé
 * conserve son `finishedAt` d'origine.
 *
 * Les leçons passent par leur propre modèle, qui crée en plus l'accomplissement
 * affiché aux autres apprenants.
 */
export default async function putFinishContentRead(
  type: ContentType,
  contentId: number,
  userIdMdb: string,
) {
  if (type === "lesson") {
    return putFinishReadLesson(contentId, userIdMdb);
  }

  const student = await contentReadRepository.findStudentByMongoId(userIdMdb);

  if (!student) return null;

  return contentReadRepository.finish(type, contentId, student.id);
}
