import bcrypt from "bcrypt";

import { credentialsError } from "../../utils/constantes.ts";

import User from "../../utils/interfaces/db/user.ts";
import IConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";

/**
 * Empreinte bcrypt jetable, comparée quand aucun compte ne correspond pour que
 * le temps de réponse ne dépende pas de l'existence de l'adresse. Le coût doit
 * rester aligné sur celui des empreintes réellement stockées.
 */
const DUMMY_PASSWORD_HASH =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

async function userLogin(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).populate({
      path: "roles",
      select: "-permissions",
    });

    // Comparer aussi quand l'adresse est inconnue pour conserver le même coût.
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || DUMMY_PASSWORD_HASH,
    );

    if (!user || !user.password || user.roles.length !== 1) {
      throw { message: credentialsError, status: 401 };
    }

    if (!user.isActive && !user.emailVerified && user.invitationSent) {
      throw {
        message: credentialsError,
        status: 401,
        code: "ACCOUNT_NOT_ACTIVATED",
      };
    }

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
        onboarding: user.onboarding ?? {
          status: "pending",
          step: "",
          version: 1,
        },
      };
    }
    throw { message: credentialsError, status: 401 };
  } catch (error: any) {
    throw error;
  }
}

export default userLogin;
