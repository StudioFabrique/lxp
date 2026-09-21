import User from "../../utils/interfaces/db/user.ts";
import type { IRole } from "../../utils/interfaces/db/role.ts";
import mongoose from "mongoose";
import { activationToken } from "../../helpers/activation-token.ts";
import { sendPasswordEmail } from "../../services/mailer.ts";
import { env } from "../../config/env.ts";
import { mailerDisabled } from "../../config/mailer-disabled.ts";

export default async function putResetPassword(userId: string) {
  if (mailerDisabled) {
    throw { statusCode: 400, message: "Le mailer est désactivé en développement." };
  }
  const existingUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  }).populate<{ roles: IRole[] }>("roles");

  if (!existingUser) throw { statusCode: 404, message: "User does not exist." };

  if (!existingUser.isActive) {
    throw {
      statusCode: 400,
      message: "Un compte inactif ne peut pas réinitialiser son mot de passe.",
    };
  }

  const role = await existingUser.roles[0];

  const token = activationToken(userId, role, "15m", "password-reset");

  if (env.ENVIRONMENT !== "test") {
    try {
      await sendPasswordEmail(existingUser.email, token, "reset");
    } catch (emailError: any) {
      throw {
        statusCode: 500,
        message: "Le mail de réinitialisation n'a pas pu être envoyé.",
      };
    }
  }
}

export async function putResetPasswordByEmail(email: string) {
  const existingUser = await User.findOne({ email });

  // Endpoint public : on ne révèle pas si le compte existe ou non pour éviter
  // l'énumération des utilisateurs. La réponse reste identique dans tous les cas.
  if (!existingUser || !existingUser.isActive) return;

  return putResetPassword(existingUser._id.toString());
}
