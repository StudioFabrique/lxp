import User, { IUser } from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import Role from "../../utils/interfaces/db/role";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { activationToken } from "../../helpers/activation-token";
import { sendPasswordEmail } from "../../services/mailer";

export default async function createUser(user: IUser, roleId: string) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const userToFind = await User.findOne({ email: user.email });
    if (userToFind) {
      throw {
        statusCode: 409,
        message:
          "Un utilisateur a déjà été enregistré avec cette adresse email.",
      };
    }

    // Vérifier si le rôle existe
    const role = await Role.findOne({ _id: roleId });
    if (!role) {
      throw { statusCode: 404, message: "Le rôle n'existe pas." };
    }

    const interfaceRole = await Role.findOne({
      rank: role.rank,
    });

    // Créer un nouvel utilisateur dans MongoDB
    const createdUser = await User.create({
      email: user.email.toLowerCase(),
      firstname: user.firstname.toLowerCase(),
      lastname: user.lastname.toLowerCase(),
      nickname: user.nickname?.toLowerCase(),
      description: user.description?.toLowerCase(),
      address: user.address?.toLowerCase(),
      city: user.city?.toLowerCase(),
      postCode: user.postCode?.toLowerCase(),
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber?.toLowerCase(),
      password: await hash(randomUUID() + "@Sn99", 10),
      isActive: false,
      avatar: user.avatar,
      roles: [role, interfaceRole],
    });

    // Gérer les créations Prisma en fonction du rôle

    if (firstRole.rank === 1 || firstRole.rank === 2) {
      await prisma.admin.create({ data: { idMdb: createdUser._id } });
    }

    if (role.rank === 2) {
      await prisma.contact.create({
        data: {
          idMdb: createdUser._id,
          name: `${createdUser.lastname} ${createdUser.firstname}`,
          role: role.label,
          phone:
            createdUser.phoneNumber && createdUser.phoneNumber?.length > 0
              ? createdUser.phoneNumber
              : "Non Renseigné",
          email: createdUser.email,
        },
      });
    }

    if (role.rank === 3)
      await prisma.student.create({ data: { idMdb: createdUser._id } });

    if (user.invitationSent) {
      const token = activationToken(createdUser._id, role, "7d");
      await sendPasswordEmail(createdUser.email, token, "activation");
      await User.updateOne(
        { _id: createdUser._id },
        { $set: { invitationSent: true } },
      );
    }

    // Retourner l'utilisateur créé et le rang du rôle
    return { createdUser, role: role.rank };
  } catch (error: any) {
    throw error;
  }
}
