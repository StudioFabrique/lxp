// Import des dépendances nécessaires
import { getTemplate } from "../helpers/get-mail-template";
import { badQuery, regexMail } from "../utils/constantes";
import nodemailer from "nodemailer";

// Configuration du transporteur SMTP pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP,
  port: +process.env.SMTP_PORT!,
  secure: +process.env.SMTP_PORT! === 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
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
      process.env.ENVIRONMENT === "development"
        ? process.env.SMTP_EMAIL
        : email;

    // Vérification de la connexion SMTP
    await transporter.verify();

    // Récupération du template HTML correspondant
    const message = getTemplate(template, token, email);

    // Envoi de l'email
    const result = await transporter.sendMail({
      from: process.env.FROM,
      to: destination,
      subject: "Activation du compte",
      html: message,
    });

    return result;
  } catch (error: any) {
    console.error("Error sending email:", error);
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Check your SMTP credentials.");
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
    if (!process.env.SMTP_EMAIL) {
      console.error(
        "La variable d'environnement SMTP_EMAIL n'est pas définie."
      );
      return;
    }

    // En développement, rediriger vers une adresse email de test
    const destination =
      process.env.ENVIRONMENT === "development"
        ? process.env.SMTP_EMAIL
        : email;

    // Vérification de la connexion SMTP
    await transporter.verify();

    // Récupération du template pour la mise à jour du compte
    const message = getTemplate("updated-user", "");

    // Envoi de l'email
    const result = await transporter.sendMail({
      from: process.env.FROM,
      to: destination,
      subject: "Modification du compte",
      html: message,
    });

    return result;
  } catch (error) {
    throw error;
  }
}
