/**
 * Unit tests for getSartAndEndOfMonth helper.
 *
 * These tests control the system time using Jest fake timers and verify that
 * the helper returns the same start/end instants that the helper's algorithm
 * is expected to produce (UTC instants built from local year/month values).
 *
 * Note: tests mirror the helper's construction logic to avoid coupling to a
 * particular timezone configuration of the test runner. They validate that
 * the function is consistent with its own intended algorithm (and will catch
 * regressions if the implementation changes).
 */

import { jest } from "@jest/globals";
import getStartAndEndOfMonth from "../getStartAndEndOfMonth.ts";

describe("getSartAndEndOfMonth", () => {
  const testDates = [
    // Regular month (non-DST)
    "2024-02-15T12:00:00.000Z",
    // Month containing DST start in Europe (March)
    "2024-03-15T12:00:00.000Z",
    // Month containing DST end in Europe (October)
    "2024-10-15T12:00:00.000Z",
    // End-of-month timestamp to exercise boundary
    "2024-01-31T23:59:59.000Z",
  ];

  afterEach(() => {
    // Restore real timers after each test to avoid leaking state.
    if (typeof jest !== "undefined" && jest.useRealTimers) jest.useRealTimers();
  });

  testDates.forEach((iso) => {
    it(`returns expected boundaries for system time ${iso}`, () => {
      // Use modern fake timers and set the system time for determinism.
      jest.useFakeTimers();
      const ms = Date.parse(iso);
      jest.setSystemTime(ms);

      const { startOfMonth, endOfMonth } = getStartAndEndOfMonth();

      // Recompute expected values using the same construction strategy:
      // start = Date.UTC(year, monthIndex, 1, 0,0,0,0)
      // end = Date.UTC(year, monthIndex, lastDay, 23,59,59,999)
      const now = new Date(ms);
      const year = now.getFullYear();
      const month = now.getMonth();

      const expectedStart = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      const lastDay = new Date(year, month + 1, 0).getDate();
      const expectedEnd = new Date(
        Date.UTC(year, month, lastDay, 23, 59, 59, 999),
      );

      expect(startOfMonth.getTime()).toBe(expectedStart.getTime());
      expect(endOfMonth.getTime()).toBe(expectedEnd.getTime());

      // Clean up timers for this iteration
      // @ts-ignore
      jest.useRealTimers();
    });
  });
});
