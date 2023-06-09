import User, { IUser } from "../../utils/interfaces/db/user/user.model";
export default async function createUser(user: IUser) {
  const userToFind = await User.findOne({ email: user.email });
  if (userToFind) {
    return null;
  }

  const createdUser = await User.create(user);

  return createdUser;
}
