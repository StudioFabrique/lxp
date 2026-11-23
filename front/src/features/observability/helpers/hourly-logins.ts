/**
 * Regroupe des connexions horaires (horodatage UTC) par heure de la journée
 * dans le fuseau du navigateur : 24 cases, de 0 h à 23 h.
 */
export function groupLoginsByLocalHour(
  buckets: { time: string; count: number }[],
): number[] {
  const hours = Array.from({ length: 24 }, () => 0);
  for (const { time, count } of buckets) {
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) continue;
    hours[date.getHours()] += count;
  }
  return hours;
}
