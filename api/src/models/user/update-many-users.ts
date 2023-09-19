import User, { IUser } from "../../utils/interfaces/db/user";

export default async function updateManyUsers(users: IUser[]) {
  const promises = users.map(async (user) => {
    // Update the user and get the updated document
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { ...user },
      { returnDocument: "after" }
    );

    return updatedUser?._id;
  });

  const updatedUsers = await Promise.all(promises);

  return updatedUsers;
}
