import User from "./interfaces/db/user";
import { IRole } from "./interfaces/db/role";

export default async function userBelongsToContacts(
  userMdbid: string,
  contacts: { idMdb: string }[],
  errorMessage: string
) {
  const user = await User.findById(userMdbid);

  console.log({ user });

  if (!user)
    throw {
      statusCode: 406,
      message: errorMessage,
    };

  const isBelonging =
    contacts.some((contact) => contact.idMdb === user.id) ||
    user.roles.some((role: IRole) => role.rank === 1);

  if (!isBelonging)
    throw {
      statusCode: 406,
      message: errorMessage,
    };
}
