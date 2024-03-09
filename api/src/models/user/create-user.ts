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
    email: user.email.toLowerCase(),
    firstname: user.firstname.toLowerCase(),
    lastname: user.lastname.toLowerCase(),
    nickname:
      user.nickname && user.nickname.length > 0
        ? user.nickname.toLowerCase()
        : undefined,
    description:
      user.description && user.description.length > 0
        ? user.description.toLowerCase()
        : undefined,
    address:
      user.address && user.address.length > 0
        ? user.address.toLowerCase()
        : undefined,
    city:
      user.city && user.city.length > 0 ? user.city.toLowerCase() : undefined,
    postCode:
      user.postCode && user.postCode.length > 0
        ? user.postCode.toLowerCase()
        : undefined,
    phoneNumber:
      user.phoneNumber && user.phoneNumber.length > 0
        ? user.phoneNumber.toLowerCase()
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
