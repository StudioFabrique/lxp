import User, { IUser } from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import Role from "../../utils/interfaces/db/role";

export default async function createUser(user: IUser, userType: number) {
  const userToFind = await User.findOne({
    email: user.email,
  });
  if (userToFind) {
    return null;
  }

  const roles = await Role.find(
    userType === 1
      ? { role: "student", rank: 3 }
      : userType === 2
      ? { role: "teacher", rank: 2 }
      : userType === 3
      ? { role: "mini-admin", rank: 1 }
      : { role: "stagiaire", rank: 3 }
  );

  const createdUser = await User.create({
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    isActive: false,
    roles: roles,
  });

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
