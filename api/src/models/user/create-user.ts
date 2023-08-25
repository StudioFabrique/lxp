import User, { IUser } from "../../utils/interfaces/db/user.model";
import { prisma } from "../../utils/db";

export default async function createUser(user: IUser, userType: number) {
  const userToFind = await User.findOne({ email: user.email });
  if (userToFind) {
    return null;
  }

  const createdUser = await User.create(user);

  if (userType === 1) {
    // si type utilisateur en cours de création est "formateur"
    prisma.teacher.create({ data: { idMdb: createdUser._id } });
  }
  if (userType === 3) {
    // si type utilisateur en cours de création est "administrateur"
    prisma.admin.create({ data: { idMdb: createdUser._id } });
  }

  return createdUser;
}
