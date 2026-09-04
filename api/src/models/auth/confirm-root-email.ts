import jwt from "jsonwebtoken";
import { env } from "../../config/env.ts";
import { regexMail } from "../../utils/constantes.ts";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token.ts";
import Role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";
import { normalizeEmail } from "../../utils/unique-fields.ts";

type RootEmailVerificationPayload = {
  purpose: "root-email-verification";
  userId: string;
  email: string;
};

function verifyToken(token: string): RootEmailVerificationPayload {
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
    payload.purpose !== "root-email-verification" ||
    !("userId" in payload) ||
    typeof payload.userId !== "string" ||
    !("email" in payload) ||
    typeof payload.email !== "string" ||
    !regexMail.test(normalizeEmail(payload.email))
  ) {
    throw { statusCode: 401, message: "Le lien n'est pas valide." };
  }

  return payload as RootEmailVerificationPayload;
}

export async function confirmRootEmail(token: string) {
  const payload = verifyToken(token);
  const email = normalizeEmail(payload.email);

  if (await BlackListedToken.exists({ token })) {
    throw { statusCode: 400, message: "Ce lien a déjà été utilisé." };
  }

  const rootRole = await Role.findOne({ role: "root", rank: 0 }).select("_id");
  if (!rootRole) {
    throw { statusCode: 500, message: "Le rôle root n'existe pas." };
  }

  const updateResult = await User.updateOne(
    {
      _id: payload.userId,
      email,
      roles: rootRole._id,
      isActive: false,
      emailVerified: false,
    },
    { $set: { isActive: true, emailVerified: true } },
  );

  if (updateResult.matchedCount === 0) {
    throw {
      statusCode: 400,
      message: "Cette demande d'activation n'est plus valide.",
    };
  }

  await BlackListedToken.create({ token });
  return email;
}
