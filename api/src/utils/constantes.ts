// errors
export const serverIssue = `Problème serveur, réessayez plus tard.`;
export const credentialsError = "Identifiant ou mot de passe incorrect.";
export const noData = "Ressource inexistante.";
export const alreadyExist = "Ressource déjà existante";
export const badQuery = "Paramètres de requête non conformes.";
export const noAccess = "Accès réservé.";

// success
export const creationSuccessfull = "Ressource créée avec succès";

// regex
export const regexMail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**
 * Contrôle de forme appliqué à la saisie de connexion.
 *
 * Volontairement plus permissif que la politique de création : un compte dont
 * le mot de passe a été défini sous une règle antérieure doit continuer à
 * pouvoir se connecter.
 */
export const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])(?=.{8,})/;

/**
 * Politique appliquée à la *définition* d'un mot de passe.
 *
 * Douze caractères, ce qu'annoncent déjà les messages d'erreur des écrans
 * d'activation et de création du premier administrateur, alors que la règle
 * réellement vérifiée en acceptait huit.
 */
export const regexNewPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])(?=.{12,})/;
export const regexNumber = /^[0-9]*$/;

// Version stricte (doit contenir au moins 1 caractère)
export const regexGeneric = /^[\p{L}\p{N}\p{P}\p{S}\s]+$/u;

// Version optionnelle (peut être vide)
export const regexOptionalGeneric = /^[\p{L}\p{N}\p{P}\p{S}\s]*$/u;

export const regexStringManyMongoId = /^[a-f\d]{24}(,[a-f\d]{24})*$/;

export const regexStringManyNumberId = /^[0-9]{1,}(,[0-9]{1,})*$/;

export const regexUrl = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
export const regexDate = /^\d{4}-\d{2}-\d{2}$/;
export const regexVideoUrl =
  /^(https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+(\?[^?]*)?$)|(video-[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}\d{17}traffic\.mp4)$/i;
export const regexRgba =
  /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\)$/;
export const regexJwt = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const regexMongodbId = /^[0-9a-fA-F]{24}$/;

export const JWT_PATTERN =
  /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;
