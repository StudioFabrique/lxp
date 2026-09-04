import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../config/env.ts";
import { getSetupStatus } from "../models/auth/setup.ts";
import { sendRootAccountInvitation } from "../services/mailer.ts";
import { regexMail } from "../utils/constantes.ts";
import { normalizeEmail } from "../utils/unique-fields.ts";

async function main() {
  const email = normalizeEmail(process.argv[2] ?? "");
  if (!regexMail.test(email)) {
    throw new Error("Une adresse email valide est requise.");
  }

  await mongoose.connect(env.MONGO_LOCAL_URL);
  const hasAdmins = await getSetupStatus();
  const token = jwt.sign(
    { purpose: "root-account", email },
    env.REGISTER_SECRET,
    { expiresIn: env.ROOT_ACTIVATION_TOKEN_TTL_MINUTES * 60 },
  );

  await sendRootAccountInvitation(email, token, !hasAdmins);
  console.log(`Invitation de création d'un compte root envoyée à ${email}.`);
}

main()
  .catch((error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" &&
            error !== null &&
            "message" in error
          ? String(error.message)
          : String(error);
    console.error(
      "L'invitation root n'a pas pu être envoyée :",
      message,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
