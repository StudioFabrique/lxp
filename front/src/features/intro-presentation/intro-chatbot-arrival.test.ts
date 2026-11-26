import { describe, expect, it } from "vitest";

import { videoChatbotRect } from "./intro-chatbot-arrival";

describe("videoChatbotRect", () => {
  it("reste au coin de la fenêtre quand le cadre est en 16:9", () => {
    const rect = videoChatbotRect({ left: 0, top: 0, width: 1920, height: 1080 }, { width: 1920, height: 1080 });
    expect(rect.width).toBeCloseTo(64);
    expect(rect.left + rect.width / 2).toBeCloseTo(1864);
    expect(rect.top + rect.height / 2).toBeCloseTo(1024);
  });

  it("s'arrête dans la scène 16:9 quand le cadre est plus haut que large", () => {
    const frame = { left: 0, top: 0, width: 1000, height: 900 };
    const rect = videoChatbotRect(frame, { width: 1000, height: 900 });
    // Scène de 562,5 px de haut, centrée : le bouton ne descend pas sous son bord bas.
    const sceneBottom = (900 + 562.5) / 2;
    expect(rect.top + rect.height).toBeLessThanOrEqual(sceneBottom);
    expect(rect.width).toBeCloseTo(64);
  });
});
