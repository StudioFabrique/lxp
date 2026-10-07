/** Ease in and out so the chatbot accelerates, glides, then settles instead of moving at a constant speed. */
export const chatbotMoveEase = [0.65, 0, 0.35, 1] as const;
export const chatbotMoveEasing = `cubic-bezier(${chatbotMoveEase.join(", ")})`;
export const chatbotMoveDurationMs = 900;
