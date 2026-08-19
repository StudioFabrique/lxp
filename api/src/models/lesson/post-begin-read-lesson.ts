import postBeginContentRead from "../content-read/post-begin-content-read.ts";

/**
 * Conservé pour la route historique `POST /v1/lesson/read/:lessonId`.
 * Le comportement vit désormais dans `models/content-read`, partagé avec les
 * modules, cours et activités.
 */
export default async function postBeginReadLesson(
  lessonId: number,
  userIdMdb: string,
) {
  const lessonRead = await postBeginContentRead("lesson", lessonId, userIdMdb);

  // L'appelant historique distingue `[]` (pas un apprenant) de `null` (échec).
  if (!lessonRead) return [];

  return lessonRead;
}
