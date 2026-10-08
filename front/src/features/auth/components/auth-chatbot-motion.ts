/** Ease in and out so the chatbot accelerates, glides, then settles instead of moving at a constant speed. */
export const chatbotMoveEase = [0.65, 0, 0.35, 1] as const;
export const chatbotMoveEasing = `cubic-bezier(${chatbotMoveEase.join(", ")})`;
export const chatbotMoveDurationMs = 900;

/** Fade and scale in for a chatbot with no previous location: a strong ease-out starts fast and settles gently, suited to an element this size. */
export const chatbotAppearEasing = "cubic-bezier(0.23, 1, 0.32, 1)";
export const chatbotAppearDurationMs = 320;
export const chatbotAppearScale = 0.92;
