import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import { prisma } from "../../utils/db.ts";
import Role, { type IRole } from "../../utils/interfaces/db/role.ts";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { activationToken } from "../../helpers/activation-token.ts";
import { sendPasswordEmail } from "../../services/mailer.ts";
import { logger } from "../../utils/logs/logger.ts";
import {
  exactInsensitive,
  isDuplicateKeyError,
  normalizeEmail,
} from "../../utils/unique-fields.ts";

/**
 * Envoie l'invitation puis note l'issue sur le compte.
 *
 * Détachée du flux de création : elle n'est jamais attendue par une requête, et
 * ne doit donc pas propager d'erreur. L'échec est journalisé avec sa cause, et
 * `invitationSent` reste à faux, ce qui laisse le renvoi manuel disponible.
 */
async function sendActivationInvitation(
  userId: string,
  email: string,
  role: IRole,
) {
  try {
    const token = activationToken(userId, role, "7d");
    await sendPasswordEmail(email, token, "activation");
    await User.updateOne(
      { _id: userId },
      {
        $set: { invitationSent: true, invitationSentAt: new Date() },
        $unset: { invitationPendingSince: 1 },
      },
    );
  } catch (error: any) {
    // L'attente est levée même en échec : la liste doit reproposer le renvoi
    // plutôt que de rester sur un indicateur qui ne se résoudra pas.
    await User.updateOne(
      { _id: userId },
      { $unset: { invitationPendingSince: 1 } },
    );
    logger.error(
      `Invitation non envoyée à ${email}`,
      error instanceof Error
        ? error
        : new Error(error?.message ?? "cause inconnue"),
    );
  }
}

export default async function createUser(user: IUser, roleId: string) {
  const email = normalizeEmail(user.email ?? "");

  try {
    if (email.length === 0) {
      throw {
        statusCode: 400,
        message: "L'adresse email est obligatoire.",
      };
    }

    // Vérifier si l'utilisateur existe déjà. La comparaison ignore la casse :
    // les comptes créés par import CSV ou via la création de contact ne sont
    // pas passés en minuscules, un test d'égalité stricte les manquait.
    const userToFind = await User.findOne({ email: exactInsensitive(email) });
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
      email,
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

    // L'invitation part sans que la réponse l'attende.
    //
    // Un serveur SMTP lent tenait la requête ouverte le temps de la remise —
    // plus d'une minute par moments — laissant l'interface sur « sauvegarde en
    // cours » alors que le compte était déjà créé. Le compte est l'objet de
    // l'appel, la remise du message n'en est qu'une conséquence : elle se
    // poursuit en arrière-plan et `invitationSent` reflète son issue dans la
    // liste des utilisateurs, où figure aussi le renvoi manuel.
    const invitationPending = Boolean(user.invitationSent);

    if (invitationPending) {
      // Marqué avant le départ : la liste peut être rechargée dans la seconde
      // qui suit la création.
      await User.updateOne(
        { _id: createdUser._id },
        { $set: { invitationPendingSince: new Date() } },
      );
      void sendActivationInvitation(
        createdUser._id.toString(),
        createdUser.email,
        role,
      );
    }

    // Retourner l'utilisateur créé et le rang du rôle
    return { createdUser, role: role.rank, invitationPending };
  } catch (error: any) {
    if (isDuplicateKeyError(error)) {
      throw {
        statusCode: 409,
        message:
          "Un utilisateur a déjà été enregistré avec cette adresse email.",
      };
    }
    throw error;
  }
}
