import Role from "../../utils/interfaces/db/role.ts";
import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import { normalizeEmail } from "../../utils/unique-fields.ts";

export default async function createManyUsers(
  users: IUser[],
  roleRank: number,
): Promise<{
  users: IUser[];
  createdCount: number;
  alreadyExistingCount: number;
  invalidCount: number;
}> {
  // Les emails du CSV arrivent tels qu'ils ont été saisis. Sans normalisation,
  // « Jean@Mail.fr » n'était rapproché ni des comptes existants ni des autres
  // lignes du fichier, et l'insertion butait sur l'index unique.
  const normalized = users.map((user) => ({
    user,
    email: normalizeEmail((user.email as string | undefined) ?? ""),
  }));

  const valid = normalized.filter((item) => item.email.length > 0);
  const invalidCount = normalized.length - valid.length;

  // La requête utilisait `{ email: emails }` : MongoDB comparait le champ à un
  // tableau, donc ne trouvait jamais rien et le filtrage était inopérant.
  const existingUsers = await User.find({
    email: { $in: valid.map((item) => item.email) },
  });
  const emailsExist = new Set(
    existingUsers.map((user) => normalizeEmail(user.email)),
  );

  const roles = await Role.find({ rank: roleRank });

  const seen = new Set<string>();
  const usersToInsert = valid
    .filter((item) => {
      // Doublon vis-à-vis de la base, ou doublon interne au fichier.
      if (emailsExist.has(item.email) || seen.has(item.email)) return false;
      seen.add(item.email);
      return true;
    })
    .map((item) => {
      item.user.email = item.email;
      item.user.isActive = false;
      item.user.roles = roles;
      return item.user;
    });

  const createdUsers = await User.insertMany(usersToInsert);

  return {
    users: [...createdUsers, ...existingUsers] as unknown as IUser[],
    createdCount: createdUsers.length,
    alreadyExistingCount: valid.length - usersToInsert.length,
    invalidCount,
  };
}
