import User from "../../utils/interfaces/db/user.ts";
import mongoose from "mongoose";
import { activationToken } from "../../helpers/activation-token.ts";
import { sendPasswordEmail } from "../../services/mailer.ts";

export default async function putResetPassword(userId: string) {
  const existingUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  });

  if (!existingUser) throw { statusCode: 404, message: "User does not exist." };

  const role = await existingUser.roles[0];

  const token = activationToken(userId, role, "15m");

  if (process.env.ENVIRONMENT !== "test") {
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

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  return putResetPassword(existingUser._id.toString());
}
