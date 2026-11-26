import {
  escapeHtml,
  formatDisplayTitle,
  instanceBrand,
  layout,
  organizationName,
  type MailContext,
} from "./shared.ts";

export type UpdatedUserChange = { label: string; value: string | null };

/**
 * L'auteur est désigné par son rôle seulement : le message ne nomme jamais la
 * personne qui a effectué la modification.
 */
export const UPDATED_BY_LABEL = {
  admin: "Un administrateur a modifié votre compte.",
  self: "Vous avez modifié votre compte.",
} as const;

export const updatedUser = (
  changes: UpdatedUserChange[],
  modifiedBy: keyof typeof UPDATED_BY_LABEL,
  context: MailContext,
) => {
  const rows = changes
    .map(
      ({ label, value }) =>
        `<li><strong>${escapeHtml(label)}</strong>${
          value === null
            ? " : modifiée"
            : ` : ${escapeHtml(formatDisplayTitle(value))}`
        }</li>`,
    )
    .join("");

  const warning =
    modifiedBy === "self"
      ? "Si vous n’êtes pas à l’origine de cette modification, changez votre mot de passe et contactez un administrateur."
      : "Si cette modification vous semble anormale, contactez un administrateur.";

  return layout(
    `<p>Bonjour,</p><p>${UPDATED_BY_LABEL[modifiedBy]}</p><p>Informations modifiées :</p><ul style="margin:0 0 16px;padding-left:20px">${rows}</ul><p>${warning}</p>`,
    organizationName(context),
    instanceBrand(context),
  );
};
