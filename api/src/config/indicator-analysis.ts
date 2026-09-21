export const ANALYSIS_FEATURE_VERSION = "lxp-indicators-v2";
export const FEEDBACK_VERDICTS = ["appropriate", "overestimated", "underestimated", "uncertain"] as const;
export const OBSERVED_OUTCOMES = ["graduate", "fail", "dropout"] as const;

export type AnalysisFeedbackInput = {
  verdict: typeof FEEDBACK_VERDICTS[number];
  comment?: string;
  actionTaken?: string;
  observedOutcome?: typeof OBSERVED_OUTCOMES[number];
};
