import PromptStats from "../../utils/interfaces/db/prompt-stats.ts";
import User from "../../utils/interfaces/db/user.ts";

/**
 * Clé de journée des `PromptStats` : minuit UTC.
 *
 * Correspond à la valeur qu'obtenait l'ancien code en passant la chaîne
 * "YYYY-MM-DD" à Mongoose, les documents existants restent donc adressables.
 */
export function promptStatsDay(now: Date = new Date()): Date {
  return new Date(now.toISOString().slice(0, 10));
}

/**
 * Incrémente atomiquement des compteurs journaliers pour un utilisateur.
 *
 * L'upsert remplace un `findOne` suivi d'un `create` qui pouvait violer
 * l'index unique `{ userId, date }` sous concurrence — deux requêtes IA
 * simultanées suffisaient.
 */
export async function incrementPromptStats(
  userId: string,
  increments: Record<string, number>,
  now: Date = new Date(),
) {
  const date = promptStatsDay(now);
  const user = await User.findById(userId).select("group");

  // `group` est un tableau de références : l'ancien code lisait `group._id`,
  // toujours `undefined`, et enregistrait donc `groupId: null` pour tout le
  // monde — ce qui vidait les statistiques par groupe du dashboard IA.
  const groups = user?.group as unknown as Array<unknown> | undefined;
  const groupId = Array.isArray(groups)
    ? (groups[0]?.toString() ?? null)
    : null;

  const stats = await PromptStats.findOneAndUpdate(
    { userId, date },
    {
      $inc: increments,
      $setOnInsert: { groupId },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  if (stats) {
    // `$addToSet` : la référence ne doit apparaître qu'une fois même si le
    // document du jour est incrémenté des dizaines de fois.
    await User.findByIdAndUpdate(userId, {
      $addToSet: { promptStats: stats._id },
    });
  }

  return stats;
}
