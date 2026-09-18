import {
  button,
  escapeHtml,
  instanceBrand,
  layout,
  organizationName,
  publicUrl,
  type MailContext,
} from "./shared.ts";
export const rootAccount = (
  token: string,
  email: string | undefined,
  context: MailContext,
  initial: boolean,
) => {
  const rootEmail = email ?? "";
  return layout(
    `<p>Bonjour,</p><p>Vous êtes invité à créer un compte administrateur pour l’adresse <strong>${escapeHtml(rootEmail)}</strong>.</p>${button(publicUrl(initial ? "init" : "createRoot", { token, email: rootEmail }), "Créer mon compte")}<p>Ce lien est personnel et expire après le délai configuré.</p>`,
    organizationName(context),
    initial
      ? { officialAndriaLogo: true, contentAlignment: "center" }
      : { ...instanceBrand(context), contentAlignment: "center" },
  );
};
