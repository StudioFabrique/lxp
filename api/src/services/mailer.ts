// Import des dépendances nécessaires
import { getTemplate } from "../helpers/get-mail-template.ts";
import { badQuery, regexMail } from "../utils/constantes.ts";
import nodemailer from "nodemailer";
import { logger } from "../utils/logs/logger.ts";
import { env } from "../config/env.ts";

/**
 * Transporteur SMTP.
 *
 * `verify()` n'est plus appelé avant chaque envoi : il ouvrait une connexion
 * complète — connexion, EHLO, authentification — que `sendMail` refaisait
 * intégralement juste après, doublant la latence de chaque message pour une
 * information que `sendMail` remonte de toute façon en cas d'échec.
 */
// `SMTP_PORT` n'est exigé qu'en production, où `config/env.ts` en contrôle la
// présence. Hors production, le port de soumission standard évite le `NaN`
// silencieux que produisait l'ancien `+process.env.SMTP_PORT!` quand la
// variable manquait.
const smtpPort = env.SMTP_PORT ?? 587;

const transporter = nodemailer.createTransport({
  host: env.SMTP,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: env.EMAIL,
    pass: env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Envoie un email pour l'activation du compte ou la réinitialisation du mot de passe
 * @param email - Adresse email du destinataire
 * @param token - Token d'authentification
 * @param template - Type de template à utiliser ('activation' ou 'reset')
 */
export async function sendPasswordEmail(
  email: string,
  token: string,
  template: string
) {
  try {
    // Vérification du format de l'email
    if (!regexMail.test(email)) throw { statusCode: 400, message: badQuery };

    // En développement, rediriger vers une adresse email de test
    const destination =
      env.ENVIRONMENT === "development"
        ? env.SMTP_EMAIL
        : email;

    // Récupération du template HTML correspondant
    const message = getTemplate(template, token, email);

    // Envoi de l'email
    const result = await transporter.sendMail({
      from: env.FROM,
      to: destination,
      subject: "Activation du compte",
      html: message,
    });

    return result;
  } catch (error: any) {
    logger.error("Error sending email:", error);
    if (error.code === "EAUTH") {
      logger.error("Authentication failed. Check your SMTP credentials.");
    }
    throw {
      statusCode: 500,
      message: "Le mail n'a pas pu être envoyé au destinataire",
      error: error.message,
    };
  }
}

/**
 * Envoie un email de confirmation après la mise à jour du compte utilisateur
 * @param email - Adresse email du destinataire
 */
export async function sendUpdatedUserEmail(email: string) {
  try {
    // Vérification du format de l'email
    if (!regexMail.test(email)) throw { statusCode: 400, message: badQuery };

    // Si la variable d'environnement n'est pas définie, log dans la console et un return
    if (!env.SMTP_EMAIL) {
      //si en prod, on lance une erreur
      if (env.ENVIRONMENT === "production") {
        throw {
          statusCode: 500,
          message: "La variable d'environnement SMTP_EMAIL n'est pas définie.",
        };
      }

      // si en développement, on log l'erreur
      logger.error(
        "La variable d'environnement SMTP_EMAIL n'est pas définie."
      );
      return;
    }

    // En développement, rediriger vers une adresse email de test
    const destination =
      env.ENVIRONMENT === "development"
        ? env.SMTP_EMAIL
        : email;

    // Récupération du template pour la mise à jour du compte
    const message = getTemplate("updated-user", "");

    // Envoi de l'email
    const result = await transporter.sendMail({
      from: env.FROM,
      to: destination,
      subject: "Modification du compte",
      html: message,
    });

    return result;
  } catch (error) {
    throw error;
  }
}
