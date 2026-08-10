import bcrypt from "bcrypt";

import { credentialsError } from "../../utils/constantes.ts";
import User from "../../utils/interfaces/db/user.ts";
import IConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";
import { getActivationEmailRetryAfterSeconds } from "../../utils/services/auth/activation-email-cooldown.ts";

async function userLogin(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).populate({
      path: "roles",
      select: "-permissions",
    });

    if (!user) {
      throw { message: credentialsError, status: 401 };
    }

    // Un compte désactivé par un administrateur a déjà un email vérifié : il
    // ne doit pas pouvoir demander une nouvelle invitation d'activation.
    if (!user.isActive && !user.emailVerified) {
      throw {
        message:
          "Votre compte n'est pas encore activé. Vous pouvez demander un nouveau lien d'activation.",
        status: 403,
        code: "ACCOUNT_NOT_ACTIVATED",
        retryAfterSeconds: getActivationEmailRetryAfterSeconds(
          user.invitationSentAt,
        ),
      };
    }

    // Vérifiez si l'utilisateur possède un mot de passe stocké.
    if (!user.password) {
      throw { message: credentialsError, status: 401 };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // on vérifie les identifiants et on retourne les informations de l'utilisateur
    if (user && isPasswordValid && user.isActive) {
      return {
        _id: user._id.toString(),
        email: user.email,
        roles: user.roles,
        avatar: imageToDataUrl(user.avatar),
        createdAt: user.createdAt,
        firstname: user.firstname,
        lastname: user.lastname,
      };
    }
    throw { message: credentialsError, status: 401 };
  } catch (error: any) {
    throw error;
  }
}

export default userLogin;
