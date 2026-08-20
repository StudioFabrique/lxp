import type {
  IndicatorsPrediction,
  MatchedCondition,
} from "../interfaces/indicators";

/**
 * Mise en forme de l'analyse du risque de décrochage.
 *
 * Le service IA répond dans le vocabulaire de son entraînement : `graduate`,
 * `dropout`, des niveaux d'alerte numérotés, des seuils et des opérateurs de
 * comparaison. Rien de tout cela ne se lit pour un formateur, et le nom du
 * modèle ne l'aide en rien : tout est traduit ici en langage clair, une bonne
 * fois pour toutes, pour que les composants n'aient plus qu'à afficher.
 */

// ── Issue estimée ───────────────────────────────────────────────────────────

const OUTCOME_LABELS: Record<string, string> = {
  graduate: "Va au bout de son parcours",
  fail: "Difficultés, échec possible",
  dropout: "Abandon",
};

export function formatOutcome(prediction: string): string {
  return OUTCOME_LABELS[prediction] ?? prediction;
}

const OUTCOME_SENTENCES: Record<string, string> = {
  graduate:
    "Son activité sur la période ne laisse pas craindre de décrochage : il devrait aller au bout de son parcours.",
  fail: "Son activité sur la période laisse craindre des difficultés, voire un échec.",
  dropout: "Son activité sur la période laisse craindre un abandon.",
};

export function outcomeSentence(prediction: string): string {
  return (
    OUTCOME_SENTENCES[prediction] ??
    "Son activité sur la période ne permet pas de conclure."
  );
}

// ── Niveau de risque ────────────────────────────────────────────────────────

/** Gravité portée par l'issue estimée, sur la même échelle que les alertes. */
const OUTCOME_SEVERITY: Record<string, number> = {
  graduate: 0,
  fail: 2,
  dropout: 3,
};

/**
 * Un seul niveau à retenir, celui du signal le plus grave.
 *
 * L'issue estimée et les règles d'alerte sont deux mesures indépendantes ; la
 * plus alarmante des deux commande, sans quoi un apprenant dont trois règles
 * se déclenchent passerait pour tranquille parce que le modèle le voit finir.
 */
export function riskLevel(prediction: IndicatorsPrediction): number {
  return Math.max(
    OUTCOME_SEVERITY[prediction.outcome.prediction] ?? 0,
    prediction.alert.effectiveLevel,
  );
}

const RISK_LABELS: Record<number, string> = {
  0: "Rien à signaler",
  1: "Point de vigilance",
  2: "À suivre de près",
  3: "Situation préoccupante",
};

export function formatRiskLevel(level: number): string {
  return RISK_LABELS[level] ?? `Niveau ${level}`;
}

/** Classe daisyUI du badge, de la plus rassurante à la plus grave. */
export function severityBadgeClass(level: number): string {
  switch (level) {
    case 0:
      return "badge-success";
    case 1:
      return "badge-info";
    case 2:
      return "badge-warning";
    default:
      return "badge-error";
  }
}

// ── Probabilités ────────────────────────────────────────────────────────────

export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)} %`;
}

/**
 * Issues triées de la plus probable à la moins probable.
 *
 * Le modèle retient une issue, mais la distribution complète dit l'essentiel :
 * une issue à 40 % contre 38 % ne se lit pas comme un résultat tranché.
 */
export function sortedProbabilities(
  probabilities: Record<string, number>,
): { outcome: string; probability: number }[] {
  return Object.entries(probabilities)
    .map(([outcome, probability]) => ({ outcome, probability }))
    .sort((a, b) => b.probability - a.probability);
}

/** `true` quand aucune issue ne l'emporte vraiment : à dire, pas à masquer. */
export function isUncertain(probabilities: Record<string, number>): boolean {
  const values = Object.values(probabilities);
  return values.length > 0 && Math.max(...values) < 0.5;
}

// ── Règles d'alerte ─────────────────────────────────────────────────────────

/**
 * Libellés français des huit règles d'alerte livrées par défaut avec le service
 * IA, qui les nomme et les décrit en anglais.
 *
 * La correspondance se fait sur le nom : une règle ajoutée ou renommée côté
 * service ressort telle quelle plutôt que d'être masquée.
 */
const ALERT_RULE_LABELS: Record<string, { name: string; description: string }> =
  {
    "Critical disengagement": {
      name: "Décrochage installé",
      description:
        "Aucune activité depuis 15 jours ou plus, aucun temps de connexion ni de consultation.",
    },
    "Critical academic failure": {
      name: "Résultats très insuffisants",
      description:
        "Moins de 40 % de quiz réussis et des résultats toujours en baisse.",
    },
    "Engagement fade": {
      name: "Engagement en perte de vitesse",
      description:
        "Plus de 15 jours sans activité et au plus deux jours de connexion sur la période.",
    },
    "Content disengagement": {
      name: "Ne travaille plus les contenus",
      description:
        "Aucun temps passé sur les contenus ni sur les quiz : présent, mais pas en train d'apprendre.",
    },
    "Academic decline": {
      name: "Résultats en baisse",
      description:
        "Moins de 60 % de quiz réussis sur au moins deux quiz terminés.",
    },
    "Early inactivity": {
      name: "Absence qui s'installe",
      description:
        "Entre 7 et 14 jours sans activité : le signal arrive avant le décrochage.",
    },
    "Low connection": {
      name: "Connexions rares",
      description: "Trois à cinq jours de connexion seulement sur la période.",
    },
    "Scores slipping": {
      name: "Résultats qui s'effritent",
      description: "Résultats en léger recul après au moins un quiz terminé.",
    },
  };

export function formatAlertRuleName(name: string): string {
  return ALERT_RULE_LABELS[name]?.name ?? name;
}

/** La description traduite quand la règle est connue, sinon celle du service. */
export function formatAlertRuleDescription(
  name: string,
  description: string | null,
): string | null {
  return ALERT_RULE_LABELS[name]?.description ?? description;
}

const OPERATOR_LABELS: Record<string, string> = {
  "<": "en dessous de",
  "<=": "au plus",
  ">": "au-dessus de",
  ">=": "au moins",
  "==": "égal à",
  "!=": "différent de",
};

/**
 * Une condition franchie, en une phrase.
 *
 * Valeur mesurée et seuil sont mis en forme avec la même unité : comparer
 * « 50 % » à « 0.6 » demanderait au lecteur de faire la conversion lui-même.
 */
export function formatMatchedCondition(condition: MatchedCondition): string {
  const label = formatModelIndicatorLabel(condition.indicator);
  const value = formatModelIndicatorValue(condition.indicator, condition.actual);
  const threshold = Array.isArray(condition.threshold)
    ? `entre ${formatModelIndicatorValue(condition.indicator, condition.threshold[0]!)} et ${formatModelIndicatorValue(condition.indicator, condition.threshold[1]!)}`
    : `${OPERATOR_LABELS[condition.op] ?? condition.op} ${formatModelIndicatorValue(condition.indicator, condition.threshold)}`;

  return `${label} : ${value} (seuil : ${threshold})`;
}

// ── Données de l'analyse ────────────────────────────────────────────────────

/**
 * Libellés des données attendues par le modèle.
 *
 * Elles ne portent pas les noms des indicateurs de la plateforme : le modèle a
 * été entraîné sur un autre jeu de données, l'API fait la correspondance.
 */
const MODEL_INDICATOR_LABELS: Record<string, string> = {
  session_time: "Temps de connexion",
  mood_proxy: "Humeur déclarée",
  monthly_connection_days: "Jours de connexion",
  days_since_last_activity: "Jours depuis la dernière activité",
  time_on_content: "Temps passé sur les contenus",
  quiz_interaction_count: "Quiz lancés",
  chatbot_proxy: "Questions posées au chatbot",
  score_evolution: "Évolution des résultats",
  assessment_count: "Quiz terminés sur la période",
  cumul_assessments: "Quiz terminés au total",
  pass_rate: "Taux de réussite aux quiz",
};

export function formatModelIndicatorLabel(key: string): string {
  return MODEL_INDICATOR_LABELS[key] ?? key;
}

/** Unités des données transmises, pour les relire sans se méprendre. */
export function formatModelIndicatorValue(
  key: string,
  value: number | null,
): string {
  if (value === null) return "—";

  switch (key) {
    case "session_time":
    case "time_on_content":
      return `${value} min`;
    case "days_since_last_activity":
    case "monthly_connection_days":
      return value === 1 ? "1 jour" : `${value} jours`;
    case "mood_proxy":
      return `${value} / 5`;
    case "pass_rate":
      return `${Math.round(value * 100)} %`;
    // Le modèle raisonne en pente sur une échelle [0, 1] par jour ; « 0.016667 »
    // ne se lit pas, « +1,67 pt/jour » se rapporte au taux de bonnes réponses.
    case "score_evolution": {
      const points = (value * 100).toFixed(2).replace(".", ",");
      return `${value > 0 ? "+" : ""}${points} pt/jour`;
    }
    default:
      return String(value);
  }
}

/**
 * Ce qui manquait à l'analyse, en une phrase — ou `null` si rien ne manquait.
 *
 * Une prédiction établie sur six données sur onze se lit autrement qu'une
 * prédiction complète : le lecteur doit le savoir sans avoir à déplier le
 * détail.
 */
export function missingDataSentence(
  prediction: IndicatorsPrediction,
): string | null {
  const labels = Object.keys(prediction.missing).map((key) =>
    formatModelIndicatorLabel(key).toLowerCase(),
  );

  if (labels.length === 0) return null;

  const list = labels.join(", ");

  return labels.length === 1
    ? `Une donnée manquait : ${list}.`
    : `${labels.length} données manquaient : ${list}.`;
}
