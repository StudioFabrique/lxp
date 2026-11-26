import {
  instanceBrand,
  layout,
  organizationName,
  type MailContext,
} from "./shared.ts";

export const deletedUser = (
  _token: string,
  _email: string | undefined,
  context: MailContext,
) =>
  layout(
    `<p>Bonjour,</p><p>Votre compte a été supprimé. Vous n’avez plus accès à la plateforme avec cette adresse e-mail.</p><p>Si vous n’êtes pas à l’origine de cette demande ou si vous pensez qu’il s’agit d’une erreur, contactez un administrateur.</p>`,
    organizationName(context),
    instanceBrand(context),
  );
