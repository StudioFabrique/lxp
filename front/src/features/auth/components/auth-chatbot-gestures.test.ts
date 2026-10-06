import { describe, expect, it } from "vitest";
import { chatbotGestures, chooseChatbotGesture } from "./auth-chatbot-gestures";

describe("gestes du chatbot", () => {
  it("propose quatre animations différentes", () => {
    expect(new Set([0, .25, .5, .75].map(random => chooseChatbotGesture(null, random))).size).toBe(4);
  });
  it.each(chatbotGestures)("ne rejoue pas immédiatement %s à l’étape suivante", previous => {
    for (const random of [0, .25, .5, .75, .99]) {
      expect(chooseChatbotGesture(previous, random)).not.toBe(previous);
    }
  });
});
