import Role from "../../utils/interfaces/db/role";
import User, { IUser } from "../../utils/interfaces/db/user";

export default async function createManyUsers(
  users: IUser[],
  roleRank: number,
): Promise<IUser[] | null> {
  const emails = users.map((user) => user.email);
  const existingUsers = await User.find({ email: emails });
  const emailsExist = existingUsers.map((user) => user.email);

  const roles = await Role.find({ rank: roleRank });

  const usersToInsert = users.filter((user) => {
    user.isActive = true;
    user.roles = roles;
    return !emailsExist.includes(user.email);
  });

  const createdUsers = await User.insertMany(usersToInsert);

  return [...createdUsers, ...existingUsers];
}
