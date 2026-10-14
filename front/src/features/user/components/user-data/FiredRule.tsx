import { formatAlertRuleDescription, formatAlertRuleName, formatMatchedCondition, severityBadgeClass } from "../../helpers/format-prediction";
import type { FiredAlertRule } from "../../interfaces/indicators";
import { cn } from "../../../../utils/cn";

export function FiredRule({ rule }: { rule: FiredAlertRule }) {
  const description = formatAlertRuleDescription(rule.name, rule.description);

  return (
    <li className="flex flex-col gap-y-1">
      <div className="flex items-center gap-x-2">
        <span className={cn("badge badge-xs", severityBadgeClass(rule.level))} />
        <p className="text-sm font-bold">{formatAlertRuleName(rule.name)}</p>
      </div>

      {description ? (
        <p className="text-xs text-base-content/50">{description}</p>
      ) : null}

      {/* Ce qui a fait basculer la règle, valeur et seuil dans la même unité :
          le signal doit pouvoir être expliqué à l'apprenant. */}
      <ul className="text-xs text-base-content/50">
        {rule.matched.map((condition, index) => (
          <li key={`${condition.indicator}-${index}`}>
            {formatMatchedCondition(condition)}
          </li>
        ))}
      </ul>
    </li>
  );
}
