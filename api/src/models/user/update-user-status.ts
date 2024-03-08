import User, { IUser } from "../../utils/interfaces/db/user";

async function updateUserStatus(userId: string, value: boolean) {
  let userToUpdate = await User.findOne({ _id: userId });
  if (!userToUpdate) {
    throw [{ message: "L'utilisateur n'existe pas.", statusCode: 404 }];
  }
  userToUpdate = await User.findByIdAndUpdate(userId, {
    isActive: value,
  });
  return userToUpdate;
}

export default updateUserStatus;
