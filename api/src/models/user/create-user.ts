import User, { IUser } from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import Role from "../../utils/interfaces/db/role";
import { hash } from "bcrypt";

export default async function createUser(user: IUser, userType: number) {
  const userToFind = await User.findOne({
    email: user.email,
  });
  if (userToFind) {
    return null;
  }

  let rolesToCheck = undefined;

  console.log(userType);

  switch (userType) {
    case 0:
      rolesToCheck = { role: "student", rank: 3 };
      break;
    case 1:
      rolesToCheck = { role: "teacher", rank: 2 };
      break;
    case 2:
      rolesToCheck = { role: "mini-admin", rank: 1 };
      break;
    case 3:
      rolesToCheck = { role: "visitor", rank: 3 };
      break;
    default:
      return null;
  }

  const roles = await Role.find(rolesToCheck);

  const createdUser = await User.create({
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    password: hash("Abcdef@123456", 10), // A enlever par la suite !
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
