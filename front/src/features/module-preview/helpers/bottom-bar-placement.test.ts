import { describe, expect, it } from "vitest";

import { bottomBarPlacement, isBottomBarReduced } from "./bottom-bar-placement";

const screen = { viewportWidth: 400, viewportHeight: 800, questionsOpen: false, hasBottomBar: true };
/** Assistant (64 px) posé dans la bande du bas, à 24 px du bord. */
const bottomY = 800 - 64 - 24;

describe("bottomBarPlacement", () => {
  it("prend toute la largeur, en bas, sans assistant virtuel à l'écran", () => {
    expect(bottomBarPlacement({ visible: false, x: 300, y: bottomY, ...screen })).toEqual({
      left: 16,
      right: 16,
      bottom: 26,
    });
  });

  it("laisse sa place à l'assistant collé à droite dans la bande du bas, sans quitter le bas de l'écran", () => {
    expect(bottomBarPlacement({ visible: true, x: 316, y: bottomY, ...screen })).toEqual({
      bottom: 26,
      left: 16,
      right: 400 - 316 + 8,
    });
  });

  it("laisse sa place à l'assistant collé à gauche", () => {
    expect(bottomBarPlacement({ visible: true, x: 20, y: bottomY, ...screen })).toEqual({
      bottom: 26,
      left: 20 + 64 + 8,
      right: 16,
    });
  });

  it("reprend toute la largeur quand l'assistant est déplacé plus haut", () => {
    expect(bottomBarPlacement({ visible: true, x: 316, y: 300, ...screen })).toEqual({
      left: 16,
      right: 16,
      bottom: 26,
    });
  });

  it("se réduit en cercle à gauche quand les questions de l'assistant sont ouvertes sur un petit écran", () => {
    const dock = { visible: true, x: 316, y: bottomY, ...screen, questionsOpen: true };

    expect(isBottomBarReduced(dock)).toBe(true);
    expect(bottomBarPlacement(dock)).toEqual({ left: 12, bottom: 23 });
  });

  it("ne se réduit pas sur un écran assez large pour l'éventail, ni questions fermées", () => {
    expect(isBottomBarReduced({ visible: true, x: 600, y: bottomY, ...screen, viewportWidth: 700, questionsOpen: true })).toBe(false);
    expect(isBottomBarReduced({ visible: true, x: 316, y: bottomY, ...screen })).toBe(false);
  });
});
