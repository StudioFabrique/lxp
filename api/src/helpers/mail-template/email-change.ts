import {
  button,
  layout,
  organizationName,
  publicUrl,
  type MailContext,
} from "./shared.ts";
export const emailChange = (
  token: string,
  _email: string | undefined,
  context: MailContext,
) =>
  layout(
    `<p>Bonjour,</p><p>Confirmez votre nouvelle adresse e-mail :</p>${button(publicUrl("confirm-email", { token }), "Valider mon adresse e-mail")}<p>Ce lien expire dans 24 heures. Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>`,
    organizationName(context),
  );
