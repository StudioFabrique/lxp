export const chatbotGestures = ["wave", "nod", "look", "double-blink"] as const;
export type ChatbotGesture = typeof chatbotGestures[number];

export function chooseChatbotGesture(previous: ChatbotGesture | null, random: number): ChatbotGesture {
  const available = chatbotGestures.filter(gesture => gesture !== previous);
  return available[Math.floor(random * available.length)] ?? "wave";
}
