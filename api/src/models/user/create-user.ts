import User, { IUser } from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import Role from "../../utils/interfaces/db/role";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { newUserMail } from "../../services/mailer";
import jwt from "jsonwebtoken";
import { activationToken } from "../../helpers/activation-token";

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
    const firstRole = await Role.findOne({ _id: roleId });
    if (!firstRole) {
      throw { statusCode: 404, message: "Le rôle n'existe pas." };
    }

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
      phoneNumber: user.phoneNumber?.toLowerCase(),
      password: await hash(randomUUID() + "@Sn99", 10),
      isActive: false,
      avatar: user.avatar,
      roles: firstRole,
    });

    // Gérer les créations Prisma en fonction du rôle
    if (firstRole.rank === 1 || firstRole.rank === 2) {
      await prisma.admin.create({ data: { idMdb: createdUser._id } });
    }

    if (firstRole.rank === 2) {
      await prisma.contact.create({
        data: {
          idMdb: createdUser._id,
          name: `${createdUser.lastname} ${createdUser.firstname}`,
          role: firstRole.label,
        },
      });
    }

    if (firstRole.rank === 3)
      await prisma.student.create({ data: { idMdb: createdUser._id } });

    if (user.invitationSent) {
      const token = activationToken(createdUser._id, firstRole);
      await newUserMail(createdUser.email, token);
    }

    await User.updateOne(
      { _id: createdUser._id },
      { $set: { invitationSent: true } },
    );

    // Retourner l'utilisateur créé et le rang du rôle
    return { createdUser, role: firstRole.rank };
  } catch (error: any) {
    throw error;
  }
}
