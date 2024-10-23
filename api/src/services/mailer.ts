import { getTemplate } from "../helpers/get-mail-template";
import { badQuery, regexMail } from "../utils/constantes";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendPasswordEmail(
  email: string,
  token: string,
  template: string,
) {
  try {
    if (!regexMail.test(email)) throw { statusCode: 400, message: badQuery };
    const destination =
      process.env.ENVIRONMENT === "development"
        ? process.env.SMTP_EMAIL
        : email;
    // Verify SMTP connection before sending
    await transporter.verify();

    const message = getTemplate(template, token);

    const result = await transporter.sendMail({
      from: '"LXP - Administrateur"',
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
