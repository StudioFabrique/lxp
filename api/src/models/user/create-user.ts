import User, {
  IUser,
} from "../../utils/interfaces/db/teacher-admin/teacher.model";
export default async function createUser(user: IUser) {
  const userToFind = await User.findOne({ email: user.email });
  if (userToFind) {
    return null;
  }

  const createdUser = await User.create(user);

  return { user };
}
