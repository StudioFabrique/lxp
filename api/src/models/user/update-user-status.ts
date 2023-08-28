import User, { IUser } from "../../utils/interfaces/db/user";

async function updateUserStatus(user: IUser) {
  let userToUpdate = await User.findOne({ _id: user._id });
  if (!userToUpdate) {
    return false;
  }
  userToUpdate = await User.findByIdAndUpdate(user._id, {
    isActive: user.isActive,
  });
  return userToUpdate;
}

export default updateUserStatus;
