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
export const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])(?=.{8,})/;
export const regexNumber = /^[0-9]*$/;
export const regexGeneric =
  /^[a-zA-Z0-9\s,.'\-+éÉàÀè?çîÎ!âÂôÔêÊûÛ:ùÙœŒ()']{1,}$/;

export const regexOptionalGeneric =
  /^[a-zA-Z0-9\s,.'\-+éÉàÀè?çîÎ!âÂôÔêÊûÛ:ùÙœŒ()']{0,}$/;

export const regexUrl = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
export const regexDate = /^\d{4}-\d{2}-\d{2}$/;
export const regexVideoUrl =
  /^(https?:\/\/\S+)?|(video-[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}\d{17}traffic\.mp4)$/i;
export const regexRgba =
  /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\)$/;
export const regexJwt = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const regexMongodbId = /^[0-9a-fA-F]{24}$/;
