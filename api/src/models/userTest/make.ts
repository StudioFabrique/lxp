import User, {
  IUser,
} from "../../utils/interfaces/db/teacher-admin/teacher.model";
export default async function make(user: IUser) {
  const userToFind = await User.findOne({ email: user.email });
}
