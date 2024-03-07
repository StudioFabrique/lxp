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

  const firstRole = await Role.findOne({ _id: roleId });

  if (!firstRole) return null;

  const createdUser = await User.create({
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    nickname:
      user.phoneNumber && user.phoneNumber.length > 0
        ? user.phoneNumber
        : undefined,
    description:
      user.phoneNumber && user.phoneNumber.length > 0
        ? user.phoneNumber
        : undefined,
    address:
      user.phoneNumber && user.phoneNumber.length > 0
        ? user.phoneNumber
        : undefined,
    city:
      user.phoneNumber && user.phoneNumber.length > 0
        ? user.phoneNumber
        : undefined,
    postCode:
      user.phoneNumber && user.phoneNumber.length > 0
        ? user.phoneNumber
        : undefined,
    phoneNumber:
      user.phoneNumber && user.phoneNumber.length > 0
        ? user.phoneNumber
        : undefined,
    password: await hash("Abcdef@123456", 10), // A enlever par la suite !
    isActive: false,
    avatar: user.avatar,
    roles: firstRole,
  });

  if (firstRole.rank === 1 || firstRole.rank === 2) {
    // si type utilisateur en cours de création est "administrateur"
    await prisma.admin.create({ data: { idMdb: createdUser._id } });
  }

  if (firstRole.rank === 2) {
    // si type utilisateur en cours de création est "formateur"

    await prisma.contact.create({
      data: {
        idMdb: createdUser._id,
        name: `${createdUser.lastname} ${createdUser.firstname}`,
        role: firstRole.label,
      },
    });
  }

  if (firstRole.rank === 3) {
    // si type utilisateur en cours de création est "apprenant"
    await prisma.student.create({ data: { idMdb: createdUser._id } });
  }

  return createdUser;
}
