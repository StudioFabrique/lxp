/**
Envoi d'un email d'activation et mise à jour
de la propriété "invitationSent" si l'envoi a réussi.
*/

import jwt from "jsonwebtoken";
import User from "../../utils/interfaces/db/user";
import mongoose from "mongoose";
import { newUserMail } from "../../services/mailer";

export default async function putInvitation(userId: string) {
  // vérifie que l'utilisateur existe dans la bdd
  const existingUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  });

  console.log(existingUser?.email);

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  // récupère le rôle de l'utilisateur
  const role = await existingUser.roles[0];

  // création d'un token contenant l'id et le rôle de l'utilisateur
  const token = jwt.sign(
    { userId: userId, userRoles: [role] },
    process.env.REGISTER_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  // si l'application fonctionne en mode développement ou production un email d'activation est envoyé à l'utilisateur
  if (process.env.ENVIRONMENT !== "test") {
    try {
      await newUserMail(existingUser.email, token);
    } catch (emailError: any) {
      throw {
        statusCode: 500,
        message: "Le mail d'activation n'a pas pu être envoyé.",
      };
    }
  }

  // si le mail a été envoyé sans erreur de la part du serveur, la propriété invitationSent est mise à jour dans la BDD
  const updateResult = await User.updateOne(
    { _id: existingUser._id },
    { $set: { invitationSent: true, firstname: "toto" } }
  );
  console.log({ updateResult });
  return updateResult;
}
