import User, { IUser } from "../../utils/interfaces/db/user";

export default async function updateManyUsers(users: string[]) {
  const promises = users.map(async (userId) => {
    // Update the user and get the updated document
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { ...user },
      { returnDocument: "after" }
    );

    return updatedUser?._id;
  });

  const updatedUsers = await Promise.all(promises);

  return updatedUsers;
}
