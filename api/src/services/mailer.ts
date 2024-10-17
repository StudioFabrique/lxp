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

export async function newUserMail(email: string, token: string) {
  try {
    if (!regexMail.test(email)) throw { statusCode: 400, message: badQuery };

    const activationLink = `${process.env.FRONT_URL}/register?id=${token}`;
    const destination =
      process.env.ENVIRONMENT === "development"
        ? process.env.SMTP_EMAIL
        : email;

    // Verify SMTP connection before sending
    await transporter.verify();

    const result = await transporter.sendMail({
      from: '"LXP - Administrateur" <martin@group-worker.com>',
      to: destination,
      subject: "Activation du compte",
      html: `<b>Hello apprenant, pour activer votre compte veuillez cliquer sur le lien ci-dessous dans un délai de 24h</b><br/><a href=${activationLink}>Lien d'activation</a><br/><p>A bientôt !</p>`,
    });

    console.log("Email sent: ", result.response);
    return result;
  } catch (error: any) {
    console.error("Error sending email:", error);
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Check your SMTP credentials.");
    }
    throw {
      statusCode: 500,
      message:
        "Le mail d'activation de compte n'a pas pu être envoyé au destinataire",
      error: error.message,
    };
  }
}

// Helper function to check environment variables
function checkEnvVariables() {
  const requiredVars = ["SMTP", "EMAIL", "PASSWORD", "FRONT_URL"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("Missing environment variables:", missingVars.join(", "));
    throw new Error("Missing required environment variables");
  }
}

// Call this function before using the email functionality
checkEnvVariables();
