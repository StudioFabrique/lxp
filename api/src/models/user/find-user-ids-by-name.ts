import User from "../../utils/interfaces/db/user.ts";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

/**
 * Identifiants des comptes dont le prénom ou le nom commence par le texte
 * cherché. Sert à retrouver, dans les journaux, ce qu'a fait une personne :
 * les journaux ne portent que son identifiant, jamais son nom.
 */
export default async function findUserIdsByName(
  text: string,
  limit = 10,
): Promise<string[]> {
  const pattern = new RegExp(`^${escapeRegExp(text.trim())}`, "i");
  const users = await User.find(
    { $or: [{ firstname: pattern }, { lastname: pattern }] },
    { _id: 1 },
  )
    .limit(limit)
    .lean();
  return users.map((user) => user._id.toString());
}
