const DAY = 86_400_000;

/** Répartit des journées entières dans l'ordre pédagogique, bornes incluses. */
export function defaultCourseDates(
  index: number,
  count: number,
  minDate: Date | null,
  maxDate: Date | null,
  now = new Date(),
) {
  const start = new Date(minDate ?? now);
  start.setUTCHours(0, 0, 0, 0);
  const end = maxDate ? new Date(maxDate) : null;
  end?.setUTCHours(0, 0, 0, 0);
  const days = end && end >= start
    ? Math.round((end.getTime() - start.getTime()) / DAY) + 1
    : Math.max(count, 1) * 7;
  const first = Math.floor(index * days / Math.max(count, 1));
  const last = Math.max(first, Math.floor((index + 1) * days / Math.max(count, 1)) - 1);
  return {
    id: 1,
    minDate: new Date(start.getTime() + first * DAY).toISOString(),
    maxDate: new Date(start.getTime() + last * DAY).toISOString(),
    synchroneDuration: 0,
    asynchroneDuration: 0,
  };
}

/** Les heures sont facultatives, mais forment une plage quotidienne complète. */
export function isValidCourseTimes(startTime: unknown, endTime: unknown): boolean {
  if (startTime == null && endTime == null) return true;
  const time = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  return typeof startTime === "string" && typeof endTime === "string" &&
    time.test(startTime) && time.test(endTime) && startTime < endTime;
}

export function isValidCalendarDates(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 1000) return false;
  const ids = new Set<number>();
  return value.every((date) => {
    if (!date || typeof date !== "object") return false;
    const { id, minDate, maxDate, synchroneDuration, asynchroneDuration } = date;
    if (!Number.isSafeInteger(id) || id < 0 || ids.has(id)) return false;
    ids.add(id);
    return isValidCourseTimes(date.startTime, date.endTime) && typeof minDate === "string" && typeof maxDate === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(minDate) && /^\d{4}-\d{2}-\d{2}T/.test(maxDate) &&
      Number.isFinite(Date.parse(minDate)) && Number.isFinite(Date.parse(maxDate)) &&
      Date.parse(minDate) <= Date.parse(maxDate) &&
      Number.isFinite(synchroneDuration) && synchroneDuration >= 0 &&
      Number.isFinite(asynchroneDuration) && asynchroneDuration >= 0;
  });
}
