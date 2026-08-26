import { describe, expect, it } from "vitest";

import {
  getInitialTimelineDates,
  validateTimelineDates,
} from "./module-timeline-date-modal.helpers";

describe("getInitialTimelineDates", () => {
  it("ne modifie pas la date de début du parcours", () => {
    const startDate = new Date(2026, 7, 26, 14, 30);
    const datesParcours = {
      startDate,
      endDate: new Date(2026, 7, 30),
    };

    const result = getInitialTimelineDates({}, datesParcours);

    expect(result).toEqual({
      minDate: "2026-08-26",
      maxDate: "2026-08-27",
    });
    expect(startDate.getDate()).toBe(26);
  });
});

describe("validateTimelineDates", () => {
  const datesParcours = {
    startDate: new Date(2026, 7, 26, 14, 30),
    endDate: new Date(2026, 7, 30, 14, 30),
  };

  it("accepte une date de début identique à celle du parcours", () => {
    expect(
      validateTimelineDates(
        { minDate: "2026-08-26", maxDate: "2026-08-27" },
        datesParcours,
      ),
    ).toBeNull();
  });

  it("refuse une date de début antérieure à celle du parcours", () => {
    expect(
      validateTimelineDates(
        { minDate: "2026-08-25", maxDate: "2026-08-27" },
        datesParcours,
      ),
    ).toContain("supérieure ou égale");
  });
});
