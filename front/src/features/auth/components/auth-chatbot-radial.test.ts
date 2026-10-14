import { describe, expect, it } from "vitest";
import { arrangeRadialSlots, radialAngles, radialRadius, spreadRadialSlots } from "./auth-chatbot-radial";

describe("éventail des questions de l’assistant virtuel", () => {
  it("garde l'écart historique de 45° pour trois entrées", () => {
    expect(radialAngles(3)).toEqual([-45, 0, 45]);
    expect(radialRadius(3)).toBe(160);
    expect(radialRadius(3, true)).toBeLessThan(160);
    expect(radialAngles(3, -1, true)).toEqual([-24, 0, 24]);
  });

  it("resserre l'éventail dans 150° et l'éloigne au-delà de trois entrées", () => {
    const angles = radialAngles(6);
    expect(angles).toHaveLength(6);
    expect(angles[5] - angles[0]).toBeCloseTo(150);
    expect(angles[0] + angles[5]).toBeCloseTo(0);
    expect(radialRadius(6)).toBeGreaterThan(radialRadius(3));
  });

  it("place une entrée unique sur l'horizontale", () => {
    expect(radialAngles(1)).toEqual([0]);
  });
});

describe("entrée épinglée de l’éventail", () => {
  it("place l'entrée épinglée sur l'horizontale, les autres de part et d'autre", () => {
    expect(radialAngles(5, 0)).toEqual([0, -75, -37.5, 37.5, 75]);
    const angles = radialAngles(4, 2);
    expect(angles[2]).toBe(0);
    expect(angles.filter(angle => angle < 0)).toHaveLength(2);
    expect(angles.filter(angle => angle > 0)).toHaveLength(1);
  });
});

describe("répartition verticale des entrées", () => {
  it("sépare des entrées écrasées contre le bas de la fenêtre sans en sortir", () => {
    const tops = spreadRadialSlots([{ top: 700, height: 60 }, { top: 710, height: 60 }, { top: 720, height: 60 }], 12, 760);
    expect(tops[2] + 60).toBeLessThanOrEqual(760);
    expect(tops[1] - tops[0]).toBeGreaterThanOrEqual(68);
    expect(tops[2] - tops[1]).toBeGreaterThanOrEqual(68);
  });

  it("ne déplace pas des entrées déjà espacées", () => {
    expect(spreadRadialSlots([{ top: 100, height: 40 }, { top: 300, height: 40 }], 12, 700)).toEqual([100, 300]);
  });
});

describe("répartition autour de l'entrée épinglée", () => {
  const slot = (top: number, height = 46) => ({ top, height });

  it("laisse l'entrée épinglée à sa hauteur et écarte les autres de part et d'autre", () => {
    const tops = arrangeRadialSlots([slot(300), slot(190), slot(410)], 0, 12, 788);
    expect(tops).toEqual([300, 190, 410]);
  });

  it("laisse libre ce qui dépasse au-dessus de l'entrée épinglée", () => {
    const tops = arrangeRadialSlots([slot(400, 58), slot(380)], 0, 12, 788, 8, 24);
    expect(tops[1] + 46).toBeLessThanOrEqual(400 - 24 - 8);
  });

  it("reporte au-dessus les entrées qui n'ont plus de place sous l'assistant collé au bas de la fenêtre", () => {
    const tops = arrangeRadialSlots([slot(628, 58), slot(520), slot(747)], 0, 12, 677);
    expect(tops[0]).toBe(619);
    expect(tops[1]).toBeLessThan(tops[0] - 46);
    expect(tops[2]).toBeLessThan(tops[0] - 46);
    expect(Math.abs(tops[1] - tops[2])).toBeGreaterThanOrEqual(54);
  });
});
