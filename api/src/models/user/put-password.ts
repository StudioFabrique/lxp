/**
Vérification et activation du compte de l'utilisateur.
Si ces opérations réussissent le lien d'activation qu'il a
utilisé est désactivé.
*/

import { hash } from "bcrypt";
import User from "../../utils/interfaces/db/user";
import mongoose from "mongoose";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token";

export default async function putPassword(
  userId: string,
  password: string,
  token: string,
) {
  const existingToken = await BlackListedToken.findOne({ token });

  if (existingToken)
    throw { statusCode: 406, message: "Ce lien n'est plus actif." };

  try {
    const existingUser = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!existingUser) {
      throw { statusCode: 404, message: "L'utilisateur n'existe pas" };
    }

    const hashedPassword = await hash(password, 10);

    const updatedResult = await User.updateOne(
      { _id: existingUser._id },
      {
        $set: { password: hashedPassword, isActive: true, emailVerified: true },
      },
    );

    await BlackListedToken.create({ token });

    return updatedResult;
  } catch (error: any) {
    console.log({ error });
    throw {
      statusCode: 500,
      message:
        "L'activation de votre compte a échoué, veuillez re-essayer plus tard svp",
    };
  }
}
