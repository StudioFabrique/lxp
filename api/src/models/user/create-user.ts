import User, { IUser } from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import Role from "../../utils/interfaces/db/role";
import { hash } from "bcrypt";

export default async function createUser(user: IUser, roleId: string) {
  const userToFind = await User.findOne({
    email: user.email,
  });
  if (userToFind) {
    return null;
  }

  /* let rolesToCheck = undefined;

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
  } */

  const firstRole = await Role.findOne({ _id: roleId });

  if (!firstRole) return null;

  console.log("role is not null");

  const createdUser = await User.create({
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    password: await hash("Abcdef@123456", 10), // A enlever par la suite !
    isActive: false,
    roles: firstRole,
  });

  if (firstRole.rank === 1) {
    // si type utilisateur en cours de création est "administrateur"
    await prisma.admin.create({ data: { idMdb: createdUser._id } });
  }

  if (firstRole.rank === 2) {
    // si type utilisateur en cours de création est "formateur"
    await prisma.teacher.create({ data: { idMdb: createdUser._id } });

    await prisma.contact.create({
      data: {
        idMdb: createdUser._id,
        name: `${createdUser.lastname} ${createdUser.firstname}`,
        role: "teacher",
      },
    });
  }

  return createdUser;
}
