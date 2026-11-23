import { formatNumber } from "../../../utils/helpers/format-number";
import type { ActivityOverview } from "../api/observability.api";
import { detailPanelId, type StatBlockId } from "../helpers/stat-blocks";
import ActivityStatBlock from "./ActivityStatBlock";

type Props = {
  totals: ActivityOverview["totals"];
  selected: StatBlockId | null;
  onSelect: (block: StatBlockId, button: HTMLButtonElement) => void;
};

const plural = (count: number, singular: string, pluralForm: string) =>
  `${formatNumber(count)} ${count > 1 ? pluralForm : singular}`;

export default function ActivityStats({ totals, selected, onSelect }: Props) {
  const block = (
    id: StatBlockId,
    props: { label: string; value: number; hint?: string; unit?: string; valueClassName?: string },
  ) => (
    <li key={id}>
      <ActivityStatBlock
        {...props}
        selected={selected === id}
        controls={detailPanelId}
        onSelect={(button) => onSelect(id, button)}
      />
    </li>
  );

  return (
    <ul
      aria-label="Chiffres clés"
      className="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {block("logins", {
        label: "Connexions",
        value: totals.logins,
        hint: plural(totals.loginUsers, "personne différente", "personnes différentes"),
      })}
      {block("failed-logins", {
        label: "Échecs de connexion",
        value: totals.failedLogins,
        hint: "Mauvais identifiants ou blocages",
        valueClassName: totals.failedLogins > 0 ? "text-warning" : undefined,
      })}
      {block("active-users", {
        label: "Utilisateurs actifs",
        value: totals.activeUsers,
        hint: "Comptes ayant agi",
      })}
      {block("requests", {
        label: "Requêtes",
        value: totals.requests,
        hint: "Appels reçus par l'API",
      })}
      {block("client-errors", {
        label: "Erreurs côté client",
        value: totals.clientErrors,
        hint: "Codes 4xx : refus, introuvable",
        valueClassName: totals.clientErrors > 0 ? "text-warning" : undefined,
      })}
      {block("server-errors", {
        label: "Erreurs côté serveur",
        value: totals.serverErrors,
        hint: "Codes 5xx : pannes",
        valueClassName: totals.serverErrors > 0 ? "text-error" : undefined,
      })}
      {block("performance-average", {
        label: "Temps de réponse moyen",
        value: totals.avgResponseMs,
        unit: "ms",
      })}
      {block("performance-p95", {
        label: "95e centile",
        value: totals.p95ResponseMs,
        unit: "ms",
        hint: "95 % des requêtes sont plus rapides",
      })}
    </ul>
  );
}
