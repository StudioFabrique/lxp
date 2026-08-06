import { activationToken } from "../../helpers/activation-token.ts";
import { sendPasswordEmail } from "../../services/mailer.ts";
import role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function postCheckEmail(email: string) {
  const existingUser = await User.findOne({ email });

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  // création d'un token contenant l'id et le rôle de l'utilisateur
  const token = activationToken(existingUser._id, existingUser.roles[0], "15m");

  // si l'application fonctionne en mode développement ou production un email d'activation est envoyé à l'utilisateur
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
