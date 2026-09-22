import {
  button,
  instanceBrand,
  layout,
  organizationName,
  publicUrl,
  type MailContext,
} from "./shared.ts";
export const activation = (
  token: string,
  _email: string | undefined,
  context: MailContext,
) =>
  layout(
    `<h1 style="margin:0 0 16px;font-size:26px;line-height:34px">Bienvenue parmi nous !</h1><p style="margin:0">Votre compte est prêt. Activez-le pour accéder à votre espace.</p>${button(publicUrl("register", { id: token }), "Activer mon compte")}<p style="margin:0">Ce lien expire dans 24 heures. Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>`,
    organizationName(context),
    instanceBrand(context),
  );
