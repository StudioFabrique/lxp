import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import { prisma } from "../../utils/db.ts";
import Role from "../../utils/interfaces/db/role.ts";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { activationToken } from "../../helpers/activation-token.ts";
import { sendPasswordEmail } from "../../services/mailer.ts";
import { logger } from "../../utils/logs/logger.ts";

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

    if (role.rank === 1 || role.rank === 2) {
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

    // L'envoi de l'invitation ne conditionne pas la création du compte.
    //
    // Il intervient après l'écriture en base : le laisser interrompre l'appel
    // renvoyait une erreur à l'administrateur tout en conservant le compte, si
    // bien que la tentative suivante butait sur un conflit d'adresse email et
    // que la situation devenait irrattrapable sans suppression manuelle. Le
    // compte est donc conservé, l'échec signalé, et le renvoi d'invitation
    // reste disponible depuis la liste des utilisateurs.
    let invitationSent = false;

    if (user.invitationSent) {
      try {
        const token = activationToken(createdUser._id, role, "7d");
        await sendPasswordEmail(createdUser.email, token, "activation");
        await User.updateOne(
          { _id: createdUser._id },
          { $set: { invitationSent: true, invitationSentAt: new Date() } },
        );
        invitationSent = true;
      } catch (error: any) {
        logger.error(
          `Invitation non envoyée à ${createdUser.email}`,
          error instanceof Error ? error : new Error(error?.message ?? "cause inconnue"),
        );
      }
    }

    // Retourner l'utilisateur créé et le rang du rôle
    return { createdUser, role: role.rank, invitationSent };
  } catch (error: any) {
    throw error;
  }
}
