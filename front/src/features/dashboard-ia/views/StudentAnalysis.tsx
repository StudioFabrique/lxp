import { type CSSProperties } from "react";
import { BellOff, BellRing, UserRound } from "lucide-react";
import { Link } from "react-router";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { type DropoutStudent } from "../api/dashboardIA.api";
import { toTitleCase } from "../../../utils/helpers/text-helpers";
import { cn } from "../../../utils/cn";
import { Indicator } from "./Indicator";

export function StudentAnalysis({
  student,
  editing,
  disabled,
  onToggle,
}: {
  student: DropoutStudent;
  editing: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const indicators = student.indicators;
  const passRate =
    indicators?.pass_rate == null ? null : indicators.pass_rate * 100;
  const connections =
    indicators?.monthly_connection_days == null
      ? null
      : (indicators.monthly_connection_days / 30) * 100;
  const inactivity =
    indicators?.days_since_last_activity == null
      ? null
      : (indicators.days_since_last_activity / 30) * 100;
  const coverage = student.coverage?.total
    ? (student.coverage.available / student.coverage.total) * 100
    : null;
  const hasIndicators = indicators !== null || student.coverage !== null;
  const status = student.critical
    ? "Critique"
    : student.effectiveLevel === 2
      ? "À surveiller"
      : "Stable";
  const statusColor = student.critical
    ? "var(--color-error)"
    : student.effectiveLevel === 2
      ? "var(--color-warning)"
      : "var(--color-success)";
  const statusStyle: CSSProperties = {
    backgroundColor: `color-mix(in srgb, ${statusColor} 35%, var(--color-base-100))`,
    color: "var(--color-base-content)",
  };
  return (
    <li>
      <BoxWrapper className="h-auto gap-4 p-5">
        <div className="flex min-h-9 flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {!editing && (
              <span
                className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-lg border", disabled
                    ? "border-warning/50 bg-warning/20 text-warning"
                    : "border-base-300 bg-base-100 text-base-content/60")}
                title={disabled ? "Alertes désactivées" : "Alertes activées"}
                role="img"
                aria-label={
                  disabled ? "Alertes désactivées" : "Alertes activées"
                }
              >
                {disabled ? (
                  <BellOff className="size-4" aria-hidden="true" />
                ) : (
                  <BellRing className="size-4" aria-hidden="true" />
                )}
              </span>
            )}
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <UserRound
                className="size-4 shrink-0 text-base-content/60"
                aria-hidden="true"
              />
              {toTitleCase(student.name)}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-9 w-28 items-center justify-center rounded-lg border border-base-content/10 px-2 text-center text-sm font-bold leading-none"
              style={statusStyle}
            >
              {status}
            </span>
            {editing ? (
              <button
                type="button"
                aria-pressed={disabled}
                aria-label={`${disabled ? "Réactiver" : "Désactiver"} l’alerte pour ${toTitleCase(student.name)}`}
                className={cn("btn btn-sm inline-flex h-9 w-44 items-center justify-center gap-2 normal-case", disabled ? "btn-error btn-soft" : "btn-outline")}
                onClick={onToggle}
              >
                <BellOff className="size-4 shrink-0" aria-hidden="true" />
                <span className="leading-none">
                  {disabled ? "Alerte désactivée" : "Désactiver l’alerte"}
                </span>
              </button>
            ) : (
              <>
                <Link
                  to={`/admin/user/data/${student.userId}`}
                  className="btn btn-outline flex h-9 min-h-0 w-28 items-center justify-center px-2 text-sm font-bold leading-none normal-case"
                  aria-label={`Voir les détails et analyses de ${toTitleCase(student.name)}`}
                >
                  Voir le détail
                </Link>
              </>
            )}
          </div>
        </div>
        {hasIndicators ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-5 border-t border-base-300 pt-5 sm:grid-cols-4">
            <Indicator
              label="Réussite"
              value={passRate}
              detail={
                passRate === null ? "Donnée absente" : "Évaluations réussies"
              }
            />
            <Indicator
              label="Connexions"
              value={connections}
              detail={
                connections === null
                  ? "Donnée absente"
                  : `${indicators!.monthly_connection_days} j / 30 j`
              }
            />
            <Indicator
              label="Inactivité"
              value={inactivity}
              reverse
              detail={
                inactivity === null
                  ? "Donnée absente"
                  : `${indicators!.days_since_last_activity} jour(s) / 30 j`
              }
            />
            <Indicator
              label="Données disponibles"
              value={coverage}
              detail={
                student.coverage
                  ? `${student.coverage.available} / ${student.coverage.total} indicateurs`
                  : "Donnée absente"
              }
            />
          </div>
        ) : (
          <p className="border-t border-base-300 pt-4 text-sm text-base-content/65">
            Indicateurs non enregistrés pour ce traitement.
          </p>
        )}
      </BoxWrapper>
    </li>
  );
}
