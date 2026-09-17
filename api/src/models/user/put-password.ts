/**
Vérification et activation du compte de l'utilisateur.
Si ces opérations réussissent le lien d'activation qu'il a
utilisé est désactivé.
*/

import { hash } from "bcrypt";
import User from "../../utils/interfaces/db/user.ts";
import mongoose from "mongoose";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token.ts";
import type { PasswordTokenPurpose } from "../../helpers/activation-token.ts";

export default async function putPassword(
  userId: string,
  password: string,
  token: string,
  purpose: PasswordTokenPurpose,
) {
  try {
    const existingUser = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!existingUser) {
      throw { statusCode: 404, message: "L'utilisateur n'existe pas" };
    }

    if (purpose === "password-reset" && !existingUser.isActive) {
      throw {
        statusCode: 403,
        message: "Ce compte doit être activé avant de pouvoir réinitialiser son mot de passe.",
      };
    }

    const hashedPassword = await hash(password, 10);

    const updatedResult = await User.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          password: hashedPassword,
          ...(purpose === "activation"
            ? { isActive: true, emailVerified: true }
            : {}),
        },
      }
    );

    await BlackListedToken.create({ token });

    return updatedResult;
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw {
      statusCode: 500,
      message:
        "L'activation de votre compte a échoué, veuillez re-essayer plus tard svp",
    };
  }
}
