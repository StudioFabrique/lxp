import { escapeHtml } from "./shared.ts";

export const DROPOUT_SUMMARY_SUBJECT = "Récapitulatif de l'analyse des groupes";

export function dropoutSummaryHtml(groups: { name: string; critical: number }[]) {
  return `<ul>${groups.map((group) => `<li>${escapeHtml(group.name)} : ${group.critical} cas critiques</li>`).join("")}</ul>`;
}
