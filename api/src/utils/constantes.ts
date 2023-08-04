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
export const regexGeneric = /^[a-zA-Z0-9\s,.'\-+éàè@â!?ôêûù]{0,}$/;
export const regexUrl = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
