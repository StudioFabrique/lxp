import User from "./interfaces/db/user.ts";
import { type IRole } from "./interfaces/db/role.ts";

export default async function userBelongsToContacts(
  userMdbid: string,
  contacts: { idMdb: string }[],
  errorMessage: string
) {
  const user = await User.findById(userMdbid).populate("roles");

  if (!user) {
    throw {
      statusCode: 406,
      message: errorMessage,
    };
  }

  const isBelonging =
    contacts.some((contact) => contact.idMdb === user.id) ||
    user.roles.some((role: IRole) => role.rank <= 1);

  if (!isBelonging)
    throw {
      statusCode: 406,
      message: errorMessage,
    };
}
