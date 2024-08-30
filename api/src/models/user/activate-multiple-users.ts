import User from "../../utils/interfaces/db/user";
import { IUser } from "../../utils/interfaces/db/user";

export default async function activateMultipleUsers(users: IUser[]) {
  const userIds = users.map((user) => user._id);
  const usersToFind = await User.find({
    _id: {
      $in: userIds,
    },
  });
  if (usersToFind.length !== users.length) {
    return null;
  }

  const updatedUsers = await Promise.all(
    users.map(
      async (user) =>
        await User.updateOne({ _id: user._id }, { isActive: user.isActive }),
    ),
  );

  return updatedUsers;
}
