import { describe, expect, it } from "vitest";
import { chooseChatbotPlacement } from "./auth-chatbot-placement";

describe("emplacement aléatoire du dialogue dans la page", () => {
  const viewport = { width: 1600, height: 900 };
  const size = { width: 420, height: 120 };

  it("varie les coordonnées dans la page pour des tirages différents", () => {
    const first = chooseChatbotPlacement(viewport, size, [], 0);
    const last = chooseChatbotPlacement(viewport, size, [], 0.99);
    expect(first).toEqual({ left: 590, top: 20 });
    expect(last).toEqual({ left: 590, top: 760 });
    expect(first).not.toEqual(last);
  });

  it("évite le formulaire et ses actions, en conservant une marge", () => {
    const obstacle = { left: 0, top: 200, width: 1600, height: 500 };
    for (const random of [0, 0.2, 0.5, 0.8, 0.99]) {
      const point = chooseChatbotPlacement(viewport, size, [obstacle], random);
      expect(point).not.toBeNull();
      expect(point!.top < 64 || point!.top >= 716).toBe(true);
      expect(point!.left + size.width).toBeLessThanOrEqual(1580);
      expect(point!.top + size.height).toBeLessThanOrEqual(880);
    }
  });

  it("garde les mêmes coordonnées tant que la page et le tirage ne changent pas", () => {
    expect(chooseChatbotPlacement(viewport, size, [], 0.4)).toEqual(chooseChatbotPlacement(viewport, size, [], 0.4));
  });

  it("reste centré dans l’étape, à ses emplacements d’ancrage", () => {
    const area = { left: 80, top: 200, width: 600, height: 600 };
    for (const random of [0, 0.5, 0.99]) {
      const point = chooseChatbotPlacement(viewport, size, [], random, area);
      expect(point?.left).toBe(170);
      expect([220, 330, 440, 550, 660]).toContain(point?.top);
    }
  });

  it("choisit un autre point à l’étape suivante, même avec le même tirage", () => {
    const previous = chooseChatbotPlacement(viewport, size, [], 0);
    expect(chooseChatbotPlacement(viewport, size, [], 0, undefined, undefined, previous)).not.toEqual(previous);
  });

  it("revient au flux normal quand aucun espace libre ne peut accueillir le dialogue", () => {
    expect(chooseChatbotPlacement(viewport, size, [{ left: 0, top: 0, ...viewport }], 0.4)).toBeNull();
    expect(chooseChatbotPlacement({ width: 390, height: 844 }, size, [], 0.4)).toBeNull();
  });
});
