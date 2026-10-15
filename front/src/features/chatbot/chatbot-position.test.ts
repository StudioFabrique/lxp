import { describe, expect, it } from "vitest";
import {
  CHATBOT_AVATAR_SIZE,
  CHATBOT_BUBBLE_WIDTH,
  chatbotBubbleSide,
  chatbotBubbleWidth,
  chooseTutorialPlacement,
  clampChatbotPoint,
  restingChatbotPoint,
  snapChatbotToSide,
  toEdgeOffset,
} from "./chatbot-position";

const viewport = { width: 1440, height: 900 };

describe("position de repos de l'assistant virtuel", () => {
  it("reprend le coin bas droit de l'ancien bouton par défaut", () => {
    expect(restingChatbotPoint(viewport, null)).toEqual({ x: 1440 - 64 - 24, y: 900 - 64 - 24 });
  });

  it("restitue la position enregistrée d'après les bords, même après un redimensionnement", () => {
    const point = { x: 200, y: 300 };
    const offset = toEdgeOffset(point, viewport);
    expect(restingChatbotPoint(viewport, offset)).toEqual(point);
    const narrow = restingChatbotPoint({ width: 1000, height: 700 }, { right: 100, bottom: 80 });
    expect(narrow).toEqual({ x: 1000 - 64 - 100, y: 700 - 64 - 80 });
    // Plus de place à droite que dans la fenêtre réduite : la position est ramenée dans l'écran.
    expect(restingChatbotPoint({ width: 1000, height: 700 }, offset).x).toBe(20);
  });

  it("le remonte à mi-hauteur pendant la présentation", () => {
    expect(restingChatbotPoint(viewport, null, true).y).toBe((900 - 64) / 2);
  });

  it("garde l'assistant virtuel dans l'écran quand la fenêtre rétrécit", () => {
    const point = clampChatbotPoint({ x: 5000, y: -40 }, { width: 400, height: 300 });
    expect(point).toEqual({ x: 400 - 64 - 20, y: 20 });
  });

  it("place la bulle à gauche par défaut, y compris dans la moitié gauche de l'écran", () => {
    expect(chatbotBubbleSide({ x: 1300, y: 100 })).toBe("left");
    expect(chatbotBubbleSide({ x: 400, y: 100 })).toBe("left");
  });

  it("place la bulle à droite seulement quand elle ne tient pas à gauche", () => {
    const minimumX = CHATBOT_BUBBLE_WIDTH + 12 + 20;

    expect(chatbotBubbleSide({ x: minimumX, y: 100 })).toBe("left");
    expect(chatbotBubbleSide({ x: minimumX - 1, y: 100 })).toBe("right");
    expect(chatbotBubbleSide({ x: 50, y: 100 })).toBe("right");
  });
});

describe("placement de l'assistant virtuel face à un élément", () => {
  it("se pose à droite d'un élément à gauche, la bulle s'étendant à l'opposé sans le cacher", () => {
    const target = { left: 8, top: 120, width: 220, height: 40 };
    const placement = chooseTutorialPlacement(target, viewport);
    expect(placement?.side).toBe("right");
    expect(placement?.point.x).toBeGreaterThanOrEqual(target.left + target.width);
    expect(placement?.point.y).toBe(target.top + target.height / 2 - CHATBOT_AVATAR_SIZE / 2 > 20 ? target.top + target.height / 2 - 32 : 20);
  });

  it("se pose à gauche d'un élément à droite", () => {
    const target = { left: 1200, top: 300, width: 160, height: 40 };
    const placement = chooseTutorialPlacement(target, viewport);
    expect(placement?.side).toBe("left");
    expect(placement && placement.point.x + CHATBOT_AVATAR_SIZE).toBeLessThanOrEqual(target.left);
    expect(placement && placement.point.x - CHATBOT_BUBBLE_WIDTH).toBeGreaterThanOrEqual(20);
  });

  it("passe sous l'élément quand les côtés manquent de place", () => {
    const target = { left: 100, top: 100, width: 1240, height: 50 };
    const placement = chooseTutorialPlacement(target, viewport);
    expect(placement).not.toBeNull();
    expect(placement && placement.point.y).toBeGreaterThanOrEqual(target.top + target.height);
  });

  it("renonce quand l'élément occupe presque tout l'écran", () => {
    expect(chooseTutorialPlacement({ left: 0, top: 0, width: 1440, height: 900 }, viewport)).toBeNull();
  });

  it("réduit la bulle sur un écran étroit pour qu'elle tienne à gauche de l'assistant virtuel", () => {
    // iPhone 16 : l'assistant virtuel est posé à son retrait par défaut (64 px + 24 px du bord droit).
    const avatar = { x: 393 - 64 - 24, y: 600 };

    expect(chatbotBubbleWidth(1280)).toBe(CHATBOT_BUBBLE_WIDTH);
    expect(chatbotBubbleWidth(393)).toBeLessThan(CHATBOT_BUBBLE_WIDTH);
    expect(chatbotBubbleSide(avatar)).toBe("right");
    expect(chatbotBubbleSide(avatar, 393)).toBe("left");
  });
});

describe("assistant virtuel collé aux bords sur mobile", () => {
  const phone = { width: 400, height: 800 };

  it("se colle au bord gauche quand il est déposé dans la moitié gauche, sans changer de hauteur", () => {
    expect(snapChatbotToSide({ x: 100, y: 500 }, phone)).toEqual({ x: 20, y: 500 });
  });

  it("se colle au bord droit quand il est déposé dans la moitié droite", () => {
    expect(snapChatbotToSide({ x: 250, y: 300 }, phone)).toEqual({ x: 400 - 64 - 20, y: 300 });
  });

  it("ne change rien sur un grand écran", () => {
    expect(snapChatbotToSide({ x: 600, y: 300 }, viewport)).toEqual({ x: 600, y: 300 });
  });
});
