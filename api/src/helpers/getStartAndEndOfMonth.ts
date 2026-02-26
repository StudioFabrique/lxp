/**
 * Return the start and end Date objects for the current month.
 *
 * Notes:
 * - This function constructs Date objects intended to represent the month
 *   boundaries for the current month. Implementation currently creates those
 *   dates using UTC timestamps (`Date.UTC(...)`) based on the local `now`
 *   values. As a result the returned Date instances represent exact UTC
 *   instants that correspond to the local month boundaries as computed from
 *   the server's current local date/time.
 * - Ensure this behavior matches how `createdAt` timestamps are stored in the DB:
 *   if `createdAt` are stored in UTC (recommended) this is usually fine; if they
 *   are stored as local times, you should align conventions or use a timezone-aware
 *   approach (e.g. `luxon` / `date-fns-tz`) to avoid DST-related edge cases.
 * - The `startOfMonth` is set to the very start of the month (00:00:00.000).
 * - The `endOfMonth` is set to the very end of the month (23:59:59.999).
 * - The original filename/function name contains a typo (`getSartAndEndOfMonth`).
 *   To avoid breaking imports elsewhere in the codebase this function keeps the
 *   same exported name. Consider renaming the file and references to
 *   `getStartAndEndOfMonth` in a follow-up change.
 *
 * Returns:
 *   An object with `{ startOfMonth: Date, endOfMonth: Date }`.
 */
export default function getStartAndEndOfMonth(): {
  startOfMonth: Date;
  endOfMonth: Date;
} {
  // Use the current local date/time as the reference point.
  const now = new Date();

  // Compute the start of the current month in local time:
  // year = now.getFullYear(), month = now.getMonth(), day = 1, time = 00:00:00.000
  const startOfMonth = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
  );

  // Compute the end of the current month in local time.
  // Creating a date for (next month, day 0) returns the last day of the current month.
  // Set time to 23:59:59.999 to represent the inclusive end-of-day.
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const endOfMonth = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), lastDay, 23, 59, 59, 999),
  );

  return { startOfMonth, endOfMonth };
}
