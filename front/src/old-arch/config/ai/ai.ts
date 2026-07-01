const isAiDisabled =
  (import.meta.env.VITE_DISABLE_AI_FEATURES || "false") === "true";

export { isAiDisabled };
