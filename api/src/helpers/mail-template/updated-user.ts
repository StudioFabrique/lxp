import {
  escapeHtml,
  instanceBrand,
  layout,
  organizationName,
  type MailContext,
} from "./shared.ts";
export const updatedUser = (
  _token: string,
  email: string | undefined,
  context: MailContext,
) =>
  layout(
    `<p>Bonjour,</p><p>Votre compte a été mis à jour avec succès.</p>${email ? `<p>Adresse e-mail : <strong>${escapeHtml(email)}</strong></p>` : ""}<p>Si vous n’êtes pas à l’origine de cette modification, contactez un administrateur.</p>`,
    organizationName(context),
    instanceBrand(context),
  );
