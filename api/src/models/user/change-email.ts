import jwt from "jsonwebtoken";
import { env } from "../../config/env.ts";
import { sendEmailChangeConfirmation } from "../../services/mailer.ts";
import { regexMail } from "../../utils/constantes.ts";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token.ts";
import User from "../../utils/interfaces/db/user.ts";
import {
  exactInsensitive,
  isDuplicateKeyError,
  normalizeEmail,
} from "../../utils/unique-fields.ts";

type EmailChangePayload = {
  purpose: "email-change";
  userId: string;
  email: string;
};

function verifyEmailChangeToken(token: string): EmailChangePayload {
  let payload: unknown;
  try {
    payload = jwt.verify(token, env.REGISTER_SECRET);
  } catch {
    throw { statusCode: 401, message: "Le lien est invalide ou a expiré." };
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("purpose" in payload) ||
    payload.purpose !== "email-change" ||
    !("userId" in payload) ||
    typeof payload.userId !== "string" ||
    !("email" in payload) ||
    typeof payload.email !== "string"
  ) {
    throw { statusCode: 401, message: "Le lien n'est pas valide." };
  }

  return payload as EmailChangePayload;
}

export async function requestEmailChange(userId: string, value: string) {
  const email = normalizeEmail(value);
  if (!regexMail.test(email)) {
    throw { statusCode: 400, message: "L'adresse email n'est pas valide." };
  }

  const user = await User.findById(userId).select("email pendingEmail");
  if (!user) {
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
  }

  if (normalizeEmail(user.email) === email) {
    await User.updateOne({ _id: user._id }, { $unset: { pendingEmail: 1 } });
    return false;
  }

  const owner = await User.findOne({
    email: exactInsensitive(email),
    _id: { $ne: user._id },
  }).select("_id");
  if (owner) {
    throw {
      statusCode: 409,
      message: "Un autre utilisateur utilise déjà cette adresse email.",
    };
  }

  const token = jwt.sign(
    { purpose: "email-change", userId, email },
    env.REGISTER_SECRET,
    { expiresIn: "24h" },
  );

  await User.updateOne({ _id: user._id }, { $set: { pendingEmail: email } });
  try {
    await sendEmailChangeConfirmation(email, token);
  } catch (error) {
    await User.updateOne(
      { _id: user._id, pendingEmail: email },
      { $unset: { pendingEmail: 1 } },
    );
    throw error;
  }

  return true;
}

export async function confirmEmailChange(token: string) {
  const payload = verifyEmailChangeToken(token);
  const email = normalizeEmail(payload.email);

  if (await BlackListedToken.exists({ token })) {
    throw { statusCode: 400, message: "Ce lien a déjà été utilisé." };
  }

  const user = await User.findOne({
    _id: payload.userId,
    pendingEmail: email,
  });
  if (!user) {
    throw {
      statusCode: 400,
      message: "Cette demande de changement d'email n'est plus valide.",
    };
  }

  const owner = await User.findOne({
    email: exactInsensitive(email),
    _id: { $ne: user._id },
  }).select("_id");
  if (owner) {
    throw {
      statusCode: 409,
      message: "Un autre utilisateur utilise déjà cette adresse email.",
    };
  }

  try {
    const updateResult = await User.updateOne(
      { _id: user._id, pendingEmail: email },
      {
        $set: { email, emailVerified: true },
        $unset: { pendingEmail: 1 },
      },
    );
    if (updateResult.matchedCount === 0) {
      throw {
        statusCode: 400,
        message: "Cette demande de changement d'email n'est plus valide.",
      };
    }
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw {
        statusCode: 409,
        message: "Un autre utilisateur utilise déjà cette adresse email.",
      };
    }
    throw error;
  }

  await BlackListedToken.create({ token });
  return email;
}
