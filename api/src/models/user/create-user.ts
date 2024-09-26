import User, { IUser } from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import Role from "../../utils/interfaces/db/role";
import { hash } from "bcrypt";
import { alreadyExist } from "../../utils/constantes";
import { randomUUID } from "crypto";

export default async function createUser(user: IUser, roleId: string) {
  const userToFind = await User.findOne({
    email: user.email,
  });

  if (userToFind) {
    throw {
      statusCode: 409,
      message: "Un utilisateur a déjà été enregistré avec cette adresse email.",
    };
  }

  const firstRole = await Role.findOne({ _id: roleId });

  if (!firstRole) throw { statusCode: 404, message: "Le rôle n'existe pas." };

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
    password: await hash(randomUUID() + "@Sn99", 10),
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

  return { createdUser, firstRole };
}
