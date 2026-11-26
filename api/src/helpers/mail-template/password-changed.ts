import {
  escapeHtml,
  instanceBrand,
  layout,
  organizationName,
  type MailContext,
} from "./shared.ts";

/** Jamais le mot de passe lui-même ni l'identité de l'auteur : date seulement. */
export const passwordChanged = (changedAt: Date, context: MailContext) =>
  layout(
    `<p>Bonjour,</p><p>Le mot de passe de votre compte a été modifié le <strong>${escapeHtml(
      changedAt.toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Europe/Paris",
      }),
    )}</strong>.</p><p>Si vous n’êtes pas à l’origine de cette modification, réinitialisez votre mot de passe sans attendre et contactez un administrateur.</p>`,
    organizationName(context),
    instanceBrand(context),
  );
