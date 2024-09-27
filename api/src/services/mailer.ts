import { badQuery, regexMail } from "../utils/constantes";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP!,
  port: +process.env.SMTP_PORT!,
  secure: true,
  auth: {
    user: process.env.EMAIL!,
    pass: process.env.PASSWORD!,
  },
});

export async function newUserMail(email: string, token: string) {
  try {
    if (!regexMail.test(email)) throw { statusCode: 400, message: badQuery };

    const activationLink = `${process.env.FRONT_URL}/register?id=${token}`;
    const destination =
      process.env.ENVIRONMENT === "production" ? email : process.env.SMTP_EMAIL;

    const accountActivation = await transporter.sendMail({
      from: '"LXP - Administrateur" <martin@group-worker.com>',
      to: destination,
      subject: "Activation du compte",
      html: `<b>Hello apprenant, pour activer votre compte veuillez cliquer sur le lien ci-dessous dans un délai de 24h</b><br/><a href=${activationLink}>Lien d'activation</a><br/><p>A bientôt !</p>`,
    });
  } catch (error: any) {
    throw {
      statusCode: 500,
      message:
        "Le mail d'activation de compte n'a pas pu être envoyé au destinataire",
    };
  }
}
