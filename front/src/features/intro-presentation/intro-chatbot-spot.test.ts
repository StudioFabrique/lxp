import { describe, expect, it } from "vitest";

import { getChatbotSpot } from "./intro-chatbot-spot";

describe("getChatbotSpot", () => {
  it("place le bouton à 24 px du coin bas droit de la fenêtre", () => {
    expect(getChatbotSpot({ left: 0, top: 0 }, { width: 1000, height: 800 })).toEqual({
      centerX: 944,
      centerY: 744,
      size: 64,
    });
  });

  it("exprime la position dans le repère de la séquence", () => {
    const spot = getChatbotSpot({ left: 8, top: 8 }, { width: 1000, height: 800 });

    expect(spot.centerX).toBe(936);
    expect(spot.centerY).toBe(736);
  });
});
