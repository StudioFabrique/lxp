import { activationToken } from "../../helpers/activation-token.ts";
import { sendPasswordEmail } from "../../services/mailer.ts";
import User from "../../utils/interfaces/db/user.ts";
import type { IRole } from "../../utils/interfaces/db/role.ts";
import {
  ACTIVATION_EMAIL_COOLDOWN_MS,
  getActivationEmailRetryAfterSeconds,
} from "../../utils/services/auth/activation-email-cooldown.ts";
import { env } from "../../config/env.ts";
import { mailerDisabled } from "../../config/mailer-disabled.ts";

export default async function resendActivationEmail(email: string) {
  if (mailerDisabled) return;
  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  }).populate<{ roles: IRole[] }>("roles");

  // Seul un compte auquel une invitation a déjà été remise peut en demander
  // une nouvelle. La réponse publique reste identique dans les autres cas.
  if (
    !existingUser ||
    existingUser.isActive ||
    existingUser.emailVerified ||
    !existingUser.invitationSent ||
    existingUser.roles.length !== 1
  ) {
    return;
  }

  const now = new Date();
  const retryAfterSeconds = getActivationEmailRetryAfterSeconds(
    existingUser.invitationSentAt,
    now,
  );

  if (retryAfterSeconds > 0) {
    throw {
      status: 429,
      code: "ACTIVATION_EMAIL_COOLDOWN",
      message: `Un lien d'activation a déjà été envoyé. Réessayez dans ${retryAfterSeconds} seconde${retryAfterSeconds > 1 ? "s" : ""}.`,
      retryAfterSeconds,
    };
  }

  const reservation = await User.updateOne(
    {
      _id: existingUser._id,
      isActive: false,
      emailVerified: false,
      invitationSent: true,
      $or: [
        { invitationSentAt: { $exists: false } },
        {
          invitationSentAt: {
            $lte: new Date(now.getTime() - ACTIVATION_EMAIL_COOLDOWN_MS),
          },
        },
      ],
    },
    { $set: { invitationSent: true, invitationSentAt: now } },
  );

  if (reservation.modifiedCount === 0) {
    const refreshedUser = await User.findById(existingUser._id).select(
      "invitationSentAt",
    );
    const concurrentRetryAfterSeconds = getActivationEmailRetryAfterSeconds(
      refreshedUser?.invitationSentAt,
    );

    throw {
      status: 429,
      code: "ACTIVATION_EMAIL_COOLDOWN",
      message: `Un lien d'activation vient d'être envoyé. Réessayez dans ${concurrentRetryAfterSeconds} seconde${concurrentRetryAfterSeconds > 1 ? "s" : ""}.`,
      retryAfterSeconds: concurrentRetryAfterSeconds,
    };
  }

  const token = activationToken(
    existingUser._id.toString(),
    existingUser.roles[0],
    "7d",
  );

  if (env.ENVIRONMENT !== "test") {
    try {
      await sendPasswordEmail(existingUser.email, token, "activation");
    } catch (error) {
      const rollback = existingUser.invitationSentAt
        ? {
            $set: {
              invitationSent: existingUser.invitationSent,
              invitationSentAt: existingUser.invitationSentAt,
            },
          }
        : {
            $set: { invitationSent: existingUser.invitationSent },
            $unset: { invitationSentAt: 1 },
          };

      await User.updateOne(
        { _id: existingUser._id, invitationSentAt: now },
        rollback,
      );
      throw error;
    }
  }
}
