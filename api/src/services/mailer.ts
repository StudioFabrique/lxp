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
// `MAILER_SMTP_PORT` n'est exigé qu'en production, où `config/env.ts` en
// contrôle la présence. Hors production, le port de soumission standard évite le `NaN`
// silencieux que produisait l'ancien `+process.env.MAILER_SMTP_PORT!` quand la
// variable manquait.
const smtpPort = env.MAILER_SMTP_PORT ?? 587;

const transporter = nodemailer.createTransport({
  host: env.MAILER_SMTP,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: env.MAILER_EMAIL,
    pass: env.MAILER_PASSWORD,
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
        ? env.MAILER_DEV_RECIPIENT
        : email;

    // Récupération du template HTML correspondant
    const message = getTemplate(template, token, email);

    // Envoi de l'email
    const result = await transporter.sendMail({
      from: env.MAILER_FROM,
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

    // Cette redirection ne concerne que le développement. En production, le
    // message part toujours vers son véritable destinataire.
    if (env.ENVIRONMENT === "development" && !env.MAILER_DEV_RECIPIENT) {
      logger.error(
        "La variable d'environnement MAILER_DEV_RECIPIENT n'est pas définie.",
      );
      return;
    }

    // En développement, rediriger vers une adresse email de test
    const destination =
      env.ENVIRONMENT === "development"
        ? env.MAILER_DEV_RECIPIENT
        : email;

    // Récupération du template pour la mise à jour du compte
    const message = getTemplate("updated-user", "");

    // Envoi de l'email
    const result = await transporter.sendMail({
      from: env.MAILER_FROM,
      to: destination,
      subject: "Modification du compte",
      html: message,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

async function sendAccountEmail(
  email: string,
  token: string,
  template: "email-change" | "root-account-init" | "root-account",
  subject: string,
) {
  if (!regexMail.test(email)) {
    throw { statusCode: 400, message: badQuery };
  }

  const destination =
    env.ENVIRONMENT === "development" ? env.MAILER_DEV_RECIPIENT : email;

  try {
    return await transporter.sendMail({
      from: env.MAILER_FROM,
      to: destination,
      subject,
      html: getTemplate(template, token, email),
    });
  } catch (error: any) {
    logger.error(`Envoi du mail « ${subject} » impossible`, error);
    throw {
      statusCode: 500,
      message: "Le mail n'a pas pu être envoyé au destinataire",
      error: error?.message,
    };
  }
}

export function sendEmailChangeConfirmation(email: string, token: string) {
  return sendAccountEmail(
    email,
    token,
    "email-change",
    "Validation de votre nouvelle adresse email",
  );
}

export function sendRootAccountInvitation(
  email: string,
  token: string,
  firstRoot: boolean,
) {
  return sendAccountEmail(
    email,
    token,
    firstRoot ? "root-account-init" : "root-account",
    "Création de votre compte root ANDRIA",
  );
}
