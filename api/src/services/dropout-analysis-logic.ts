export type DropoutGroup = {
  groupId: string;
  name: string;
  parcoursId: number;
  teacherIds: string[];
  userIds: string[];
};

export type CandidateParcours = {
  id: number;
  isPublished: boolean;
  startDate: string | null;
  endDate: string | null;
  contacts: { idMdb: string }[];
  groupIds: string[];
};
export type CandidateGroup = { id: string; name: string; active: boolean; userIds: string[] };

export function dropoutOnboardingRequired(hasDirectParcours: boolean, completedAt?: Date | null) {
  return hasDirectParcours && !completedAt;
}

export function selectEligibleDropoutGroups(input: {
  parcours: CandidateParcours[];
  groups: CandidateGroup[];
  studentIds: Set<string>;
  activeUserIds: Set<string>;
  enabledTeacherIds: Set<string>;
  now: Date;
}): DropoutGroup[] {
  const groups = new Map(input.groups.filter((g) => g.active).map((g) => [g.id, g]));
  return input.parcours.flatMap((p) => {
    if (!p.isPublished || (p.startDate && new Date(p.startDate) > input.now)
      || (p.endDate && new Date(p.endDate) < input.now)) return [];
    const teacherIds = [...new Set(p.contacts.filter((c) => input.enabledTeacherIds.has(c.idMdb)).map((c) => c.idMdb))];
    if (!teacherIds.length) return [];
    return p.groupIds.flatMap((id) => {
      const group = groups.get(id);
      return group ? [{ groupId: id, name: group.name, parcoursId: p.id, teacherIds,
        userIds: [...new Set(group.userIds.filter((userId) => input.studentIds.has(userId) && input.activeUserIds.has(userId)))] }] : [];
    });
  });
}

export function uniqueLearners(groups: DropoutGroup[]) {
  return [...new Set(groups.flatMap((group) => group.userIds))];
}

export async function mapWithConcurrency<T, R>(
  items: T[], limit: number, processItem: (item: T) => Promise<R>,
): Promise<Map<T, R>> {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("Limite de concurrence invalide");
  const results = new Map<T, R>();
  let next = 0;
  let failed = false;
  let failure: unknown;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (!failed && next < items.length) {
      const item = items[next++]!;
      try { results.set(item, await processItem(item)); }
      catch (error) { failed = true; failure = error; }
    }
  }));
  if (failed) throw failure;
  return results;
}

export function summarizeDropoutGroups(groups: DropoutGroup[], predictions: Map<string, boolean>) {
  return groups.map(({ userIds, ...group }) => ({
    ...group,
    analyzed: userIds.length,
    critical: userIds.filter((id) => predictions.get(id) === true).length,
  }));
}

export function criticalGroupsForTeacher(
  groups: { name: string; parcoursId: number; teacherIds: string[]; critical: number }[],
  teacherId: string,
  currentParcoursIds: Set<number>,
) {
  return groups.filter((group) => group.critical > 0 && group.teacherIds.includes(teacherId)
    && currentParcoursIds.has(group.parcoursId))
    .map((group) => ({ name: group.name, critical: group.critical }));
}

export function weekKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const day = new Date(`${p.year}-${p.month}-${p.day}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
  return day.toISOString().slice(0, 10);
}

export function parisParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
    weekday: "short", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function dueDropoutPeriods(now: Date) {
  const p = parisParts(now);
  const month = new Date(Date.UTC(Number(p.year), Number(p.month) - 2, 1)).toISOString().slice(0, 7);
  return {
    week: p.weekday === "Mon" && Number(p.hour) < 8 ? null : weekKey(now),
    month: p.day === "01" && Number(p.hour) < 8 ? null : month,
  };
}

/** Les deux déclencheurs sont à 8 h locales, y compris après un changement d'heure. */
export function nextDropoutWake(now: Date) {
  const hour = 60 * 60_000;
  const firstHour = Math.floor(now.getTime() / hour) * hour + hour;
  for (let index = 0; index < 24 * 35; index++) {
    const candidate = new Date(firstHour + index * hour);
    const p = parisParts(candidate);
    if (p.hour === "08" && (p.weekday === "Mon" || p.day === "01")) return candidate;
  }
  throw new Error("Prochaine échéance du décrochage introuvable");
}

export async function runDueDropoutSchedule(now: Date, jobs: {
  runWeek: (now: Date) => Promise<boolean>;
  sendWeek: (week: string) => Promise<void>;
  monthDone: (month: string) => Promise<boolean>;
  sendMonth: (now: Date) => Promise<void>;
  markMonthDone: (month: string) => Promise<void>;
}) {
  const due = dueDropoutPeriods(now);
  let failure: unknown;
  if (due.week) {
    try {
      if (!(await jobs.runWeek(now))) throw new Error(`Traitement ${due.week} réservé par une autre instance`);
      await jobs.sendWeek(due.week);
    } catch (error) { failure = error; }
  }
  if (due.month) {
    try {
      if (!(await jobs.monthDone(due.month))) {
        await jobs.sendMonth(now);
        await jobs.markMonthDone(due.month);
      }
    } catch (error) { failure ??= error; }
  }
  if (failure) throw failure;
}
