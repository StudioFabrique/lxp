import { localeDate } from "../../../utils/helpers/locale-date";

export type DayGroup<T extends { time: string }> = {
  /** « Aujourd'hui », « Hier » ou la date. */
  label: string;
  actions: T[];
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Regroupe des événements déjà triés (du plus récent au plus ancien) par jour
 * local, en conservant l'ordre. `now` est injectable pour les tests.
 */
export function groupActionsByDay<T extends { time: string }>(
  actions: T[],
  now: Date = new Date(),
): DayGroup<T>[] {
  const today = startOfDay(now);
  const groups: DayGroup<T>[] = [];
  const indexByDay = new Map<number, number>();

  for (const action of actions) {
    const date = new Date(action.time);
    if (Number.isNaN(date.getTime())) continue;
    const day = startOfDay(date);

    let index = indexByDay.get(day);
    if (index === undefined) {
      const label =
        day === today
          ? "Aujourd'hui"
          : day === today - DAY_MS
            ? "Hier"
            : localeDate(date);
      index = groups.push({ label, actions: [] }) - 1;
      indexByDay.set(day, index);
    }
    groups[index].actions.push(action);
  }
  return groups;
}
