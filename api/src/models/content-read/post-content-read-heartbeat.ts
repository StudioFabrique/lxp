import type { ContentType } from "../../config/content-read.ts";
import { contentReadRepository } from "./content-read-repository.ts";

/**
 * Crédite le temps écoulé depuis le dernier signe de vie sur un contenu.
 *
 * Retourne `null` si l'apprenant n'a pas de suivi ouvert sur ce contenu :
 * un heartbeat sans `begin` préalable ne crée rien.
 */
export default async function postContentReadHeartbeat(
  type: ContentType,
  contentId: number,
  userIdMdb: string,
) {
  const student = await contentReadRepository.findStudentByMongoId(userIdMdb);

  if (!student) return null;

  return contentReadRepository.addReadTime(type, contentId, student.id);
}
