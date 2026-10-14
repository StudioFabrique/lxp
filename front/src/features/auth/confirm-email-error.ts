export type ConfirmEmailErrorHelp = {
  cause: string;
  solutions: string[];
};

/** Explique l'échec de validation de l'email et les actions possibles, d'après le message public de l'API. */
export function getConfirmEmailErrorHelp(message: string): ConfirmEmailErrorHelp {
  const text = message.toLowerCase();
  if (text.includes("incomplet"))
    return {
      cause: "Le lien ouvert est tronqué : il ne contient pas le jeton de validation.",
      solutions: [
        "Rouvrez l'email reçu et cliquez directement sur le bouton de validation.",
        "Si vous avez copié le lien, vérifiez qu'il est complet, jusqu'au dernier caractère.",
      ],
    };
  if (text.includes("déjà été utilisé"))
    return {
      cause: "Ce lien de validation a déjà servi : votre adresse est très probablement déjà validée.",
      solutions: [
        "Essayez de vous connecter avec votre adresse email et votre mot de passe.",
        "Si la connexion échoue, utilisez « Mot de passe oublié » depuis la page de connexion.",
      ],
    };
  if (text.includes("expiré") || text.includes("pas valide") || text.includes("plus valide"))
    return {
      cause: "Ce lien n'est plus valable : il expire au bout de 24 heures ou a été remplacé par une demande plus récente.",
      solutions: [
        "Utilisez le dernier email de validation reçu, qui annule les précédents.",
        "Si aucun lien récent n'est valide, demandez à un administrateur de renvoyer la demande.",
      ],
    };
  if (text.includes("utilise déjà"))
    return {
      cause: "Cette adresse email est déjà associée à un autre compte.",
      solutions: [
        "Connectez-vous avec le compte existant si c'est le vôtre.",
        "Sinon, recommencez la demande avec une autre adresse email.",
      ],
    };
  return {
    cause: "La validation n'a pas pu aboutir, sans que votre adresse soit remise en cause.",
    solutions: [
      "Vérifiez votre connexion internet puis rechargez la page.",
      "Si le problème persiste, rouvrez le lien depuis l'email ou contactez un administrateur.",
    ],
  };
}
