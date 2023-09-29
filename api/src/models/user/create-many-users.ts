import User, { IUser } from "../../utils/interfaces/db/user";

export default async function createManyUsers(
  users: IUser[]
): Promise<IUser[] | null> {
  const emails = users.map((user) => user.email);
  const emailsExist = await User.find({ email: emails }).then((users) =>
    users.map((user) => user.email)
  );

  const usersToInsert = users.filter((user) => {
    user.isActive = false;
    return !emailsExist.includes(user.email);
  });

  console.log(usersToInsert);

  if (!usersToInsert || usersToInsert.length <= 0) {
    return null;
  }

  const createdUsers = await User.insertMany(usersToInsert);

  return createdUsers;
}
