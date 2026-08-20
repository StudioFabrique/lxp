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

    // Toute cause d'échec renvoie la même erreur : distinguer « compte inconnu »
    // de « compte non activé » permettait de tester une liste d'adresses pour
    // savoir lesquelles sont inscrites. Le lien de renvoi d'activation est
    // proposé côté client après n'importe quel échec, et l'endpoint qui le sert
    // répond lui aussi de façon indifférenciée.
    //
    // La comparaison est faite même sans compte correspondant : sortir tout de
    // suite rendrait la réponse mesurablement plus rapide pour une adresse
    // inconnue que pour une adresse connue, ce qui rétablirait l'oracle que le
    // message uniforme vient de fermer.
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || DUMMY_PASSWORD_HASH,
    );

    if (!user || !user.password) {
      throw { message: credentialsError, status: 401 };
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
