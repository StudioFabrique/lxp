import { describe, expect, it } from "vitest";

import { parseDateValue } from "./date-picker.utils";

describe("parseDateValue", () => {
  it("convertit une date ISO en date locale sans décalage de jour", () => {
    const date = parseDateValue("2026-09-08");

    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(8);
    expect(date?.getDate()).toBe(8);
  });

  it("accepte les dates ISO provenant de l’API", () => {
    const date = parseDateValue("2026-09-08T14:30:00.000Z");

    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(8);
    expect(date?.getDate()).toBe(8);
  });

  it("rejette une date impossible ou mal formée", () => {
    expect(parseDateValue("2026-02-30")).toBeUndefined();
    expect(parseDateValue("08/09/2026")).toBeUndefined();
    expect(parseDateValue("")).toBeUndefined();
  });
});
