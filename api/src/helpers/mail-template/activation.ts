import {
  button,
  escapeHtml,
  layout,
  organizationName,
  publicUrl,
  type MailContext,
} from "./shared.ts";
export const activation = (
  token: string,
  email: string | undefined,
  context: MailContext,
) =>
  layout(
    `<p>Bonjour,</p><p>Votre compte a été créé pour l’adresse <strong>${escapeHtml(email ?? "")}</strong>.</p><p>Pour finaliser votre inscription, activez votre compte :</p>${button(publicUrl("register", { id: token }), "Activer mon compte")}<p>Ce lien expire dans 24 heures. Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>`,
    organizationName(context),
  );
