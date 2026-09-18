import {
  button,
  instanceBrand,
  layout,
  organizationName,
  publicUrl,
  type MailContext,
} from "./shared.ts";
export const reset = (
  token: string,
  _email: string | undefined,
  context: MailContext,
) =>
  layout(
    `<p>Bonjour,</p><p>Vous avez demandé la réinitialisation de votre mot de passe.</p>${button(publicUrl("reset-update", { id: token }), "Réinitialiser mon mot de passe")}<p>Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>`,
    organizationName(context),
    instanceBrand(context),
  );
