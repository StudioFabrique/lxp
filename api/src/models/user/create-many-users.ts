import Role from "../../utils/interfaces/db/role";
import User, { IUser } from "../../utils/interfaces/db/user";

export default async function createManyUsers(
  users: IUser[],
  roleRank: number,
): Promise<IUser[] | null> {
  const emails = users.map((user) => user.email);
  const emailsExist = await User.find({ email: emails }).then((users) =>
    users.map((user) => user.email),
  );

  const roles = await Role.find({ rank: roleRank });

  let usersToInsert = users.filter(async (user) => {
    user.isActive = false;
    user.roles = roles;
    return !emailsExist.includes(user.email);
  });

  if (!usersToInsert || usersToInsert.length <= 0) {
    return null;
  }

  const createdUsers = await User.insertMany(usersToInsert);

  return createdUsers;
}
