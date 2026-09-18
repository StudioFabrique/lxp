// Import des dépendances nécessaires
import { getTemplate } from "../helpers/get-mail-template.ts";
import { badQuery, regexMail } from "../utils/constantes.ts";
import nodemailer from "nodemailer";
import { logger } from "../utils/logs/logger.ts";
import { env } from "../config/env.ts";
import {
  hasInstanceLogo,
  instanceColorPath,
  instanceLogoPath,
  readInstanceSettings,
} from "./instance-settings.ts";
import fs from "fs";
import path from "path";
import {
  ANDRIA_FOOTER_LOGO_DARK_CID,
  ANDRIA_FOOTER_LOGO_LIGHT_CID,
  ANDRIA_LOGO_CID,
  type MailContext,
} from "../helpers/mail-template/shared.ts";

const INSTANCE_LOGO_CID = "instance-logo";

async function mailContext() {
  const settings = await readInstanceSettings();
  const hasLogo = await hasInstanceLogo();
  const color = hasLogo
    ? await fs.promises
        .readFile(instanceColorPath, "utf8")
        .catch(() => "#ffffff")
    : "#ffffff";
  return {
    organizationName: settings.name,
    logoCid: hasLogo ? INSTANCE_LOGO_CID : undefined,
    logoBackgroundColor: color.trim(),
  } satisfies MailContext;
}

async function instanceLogoAttachment() {
  if (!(await hasInstanceLogo())) return [];
  const file = await fs.promises.open(instanceLogoPath, "r");
  let contentType = "image/jpeg";
  try {
    const header = Buffer.alloc(8);
    await file.read(header, 0, header.length, 0);
    if (
      header
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ) {
      contentType = "image/png";
    }
  } finally {
    await file.close();
  }
  return [
    {
      filename: "instance-logo.jpeg",
      path: instanceLogoPath,
      cid: INSTANCE_LOGO_CID,
      contentType,
    },
  ];
}

const andriaLogoCandidates = [
  // Image de production : le Dockerfile copie le PNG optimisé avec le serveur compilé.
  path.join(import.meta.dirname, "..", "..", "mail-assets", "andria-logo.png"),
  // Développement et tests : le fichier officiel reste la source de vérité.
  path.join(
    import.meta.dirname,
    "..",
    "..",
    "..",
    "front",
    "src",
    "assets",
    "andria-logo",
    "logo-darkmode-email.png",
  ),
];

const andriaLogoPath = () =>
  andriaLogoCandidates.find((candidate) => fs.existsSync(candidate));

const andriaLogoAttachment = () => {
  const logoPath = andriaLogoPath();
  return logoPath
    ? [
        {
          filename: "andria-logo.png",
          path: logoPath,
          cid: ANDRIA_LOGO_CID,
          contentType: "image/png",
        },
      ]
    : undefined;
};

const andriaFooterLogoAttachment = (themeMode?: "light" | "dark") => {
  const isDark = themeMode === "dark";
  const logoPath = isDark
    ? andriaLogoPath()
    : [
        path.join(
          import.meta.dirname,
          "..",
          "..",
          "mail-assets",
          "andria-logo-light.png",
        ),
        path.join(
          import.meta.dirname,
          "..",
          "..",
          "..",
          "front",
          "src",
          "assets",
          "andria-logo",
          "logo-lightmode-email.png",
        ),
      ].find((candidate) => fs.existsSync(candidate));

  return logoPath
    ? [
        {
          filename: "andria-footer-logo.png",
          path: logoPath,
          contentType: "image/png",
          cid: isDark
            ? ANDRIA_FOOTER_LOGO_DARK_CID
            : ANDRIA_FOOTER_LOGO_LIGHT_CID,
        },
      ]
    : [];
};

/**
 * Transporteur SMTP.
 *
 * `verify()` n'est pas appelé avant chaque envoi : il ouvrirait une connexion
 * complète — connexion, EHLO, authentification — que `sendMail` referait
 * intégralement juste après. L'envoi SMTP reste obligatoire et toute erreur de
 * connexion ou de remise immédiate est propagée par `sendMail`.
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
  template: string,
) {
  try {
    // Vérification du format de l'email
    if (!regexMail.test(email)) throw { statusCode: 400, message: badQuery };

    // En développement, rediriger vers une adresse email de test
    const destination =
      env.ENVIRONMENT === "development" ? env.MAILER_DEV_RECIPIENT : email;

    // Récupération du template HTML correspondant
    const context = await mailContext();
    const message = getTemplate(template, token, email, context);

    // Envoi de l'email
    const result = await transporter.sendMail({
      from: env.MAILER_FROM,
      to: destination,
      subject:
        template === "reset"
          ? "Réinitialisation de votre mot de passe"
          : "Activation du compte",
      html: message,
      attachments: [
        ...(await instanceLogoAttachment()),
        ...andriaFooterLogoAttachment(),
      ],
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
      env.ENVIRONMENT === "development" ? env.MAILER_DEV_RECIPIENT : email;

    // Récupération du template pour la mise à jour du compte
    const message = getTemplate("updated-user", "", email, await mailContext());

    // Envoi de l'email
    const result = await transporter.sendMail({
      from: env.MAILER_FROM,
      to: destination,
      subject: "Modification du compte",
      html: message,
      attachments: [
        ...(await instanceLogoAttachment()),
        ...andriaFooterLogoAttachment(),
      ],
    });

    return result;
  } catch (error) {
    throw error;
  }
}

async function sendAccountEmail(
  email: string,
  token: string,
  template:
    | "email-change"
    | "root-email-verification"
    | "root-account-init"
    | "root-account",
  subject: string,
  themeMode?: "light" | "dark",
) {
  if (!regexMail.test(email)) {
    throw { statusCode: 400, message: badQuery };
  }

  const destination =
    env.ENVIRONMENT === "development" ? env.MAILER_DEV_RECIPIENT : email;

  try {
    const isInitialRoot =
      template === "root-email-verification" ||
      template === "root-account-init";
    const context = { ...(await mailContext()), themeMode };
    return await transporter.sendMail({
      from: env.MAILER_FROM,
      to: destination,
      subject,
      html: getTemplate(template, token, email, context),
      attachments: isInitialRoot
        ? andriaLogoAttachment()
        : [
            ...(await instanceLogoAttachment()),
            ...andriaFooterLogoAttachment(themeMode),
          ],
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

export function sendRootEmailVerification(
  email: string,
  token: string,
  themeMode?: "light" | "dark",
) {
  return sendAccountEmail(
    email,
    token,
    "root-email-verification",
    "Activation de votre compte administrateur",
    themeMode,
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
    "Création de votre compte administrateur",
  );
}
