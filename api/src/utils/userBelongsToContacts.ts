import User from "./interfaces/db/user.ts";
import { type IRole } from "./interfaces/db/role.ts";

export default async function userBelongsToContacts(
  userMdbid: string,
  contacts: readonly ({ idMdb: string } | null)[],
  errorMessage: string,
) {
  const user = await User.findById(userMdbid).populate<{ roles: IRole[] }>(
    "roles",
  );

  if (!user) {
    throw {
      statusCode: 406,
      message: errorMessage,
    };
  }

  const isBelonging =
    contacts.some((contact) => contact?.idMdb === user._id.toString()) ||
    (user.roles[0]?.rank ?? 4) <= 1;

  if (!isBelonging)
    throw {
      statusCode: 406,
      message: errorMessage,
    };
}
