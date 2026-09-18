import {
  button,
  escapeHtml,
  layout,
  organizationName,
  publicUrl,
  type MailContext,
} from "./shared.ts";
export const rootEmailVerification = (
  token: string,
  email: string | undefined,
  context: MailContext,
) =>
  layout(
    `<p>Bonjour,</p><p>Votre compte administrateur a été créé pour l’adresse <strong>${escapeHtml(email ?? "")}</strong>.</p>${button(publicUrl("confirm-email", { token }), "Activer mon compte")}<p>Ce lien expire dans 24 heures.</p>`,
    organizationName(context),
    {
      officialAndriaLogo: true,
      showFooter: false,
      contentAlignment: "center",
      themeMode: context.themeMode,
    },
  );
