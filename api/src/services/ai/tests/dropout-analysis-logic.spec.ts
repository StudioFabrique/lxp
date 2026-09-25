import { criticalGroupsForTeacher, dropoutOnboardingRequired, dueDropoutPeriods, mapWithConcurrency, nextDropoutWake, runDueDropoutSchedule, selectEligibleDropoutGroups, summarizeDropoutGroups, uniqueLearners, weekKey, type DropoutGroup, type CandidateParcours } from "../../dropout-analysis-logic.ts";
import { DROPOUT_SUMMARY_SUBJECT, dropoutSummaryHtml } from "../../../helpers/mail-template/dropout-summary.ts";

const groups: DropoutGroup[] = [
  { groupId: "a", name: "A", parcoursId: 1, teacherIds: ["teacher"], userIds: ["one", "two"] },
  { groupId: "b", name: "B", parcoursId: 2, teacherIds: ["teacher"], userIds: ["two", "three"] },
];

describe("analyse hebdomadaire du décrochage", () => {
  it("retient les parcours publiés en cours, les groupes et comptes actifs et les formateurs directs optants", () => {
    const base: CandidateParcours = { id: 1, isPublished: true, startDate: "2026-01-01T00:00:00Z", endDate: "2026-12-31T23:59:59Z",
      contacts: [{ idMdb: "teacher" }, { idMdb: "off" }, { idMdb: "admin" }], groupIds: ["a", "b"] };
    const selected = selectEligibleDropoutGroups({
      parcours: [base, { ...base, id: 2, isPublished: false }, { ...base, id: 3, startDate: "2027-01-01T00:00:00Z" }],
      groups: [{ id: "a", name: "A", active: true, userIds: ["one", "inactive", "teacher"] },
        { id: "b", name: "B", active: false, userIds: ["one"] }],
      enabledTeacherIds: new Set(["teacher"]), studentIds: new Set(["one", "inactive"]), activeUserIds: new Set(["one", "teacher"]),
      now: new Date("2026-09-24T08:00:00Z"),
    });
    expect(selected).toEqual([{ groupId: "a", name: "A", parcoursId: 1, teacherIds: ["teacher"], userIds: ["one"] }]);
  });
  it("analyse chaque apprenant une fois, puis compte les cas critiques dans chaque groupe", () => {
    expect(uniqueLearners(groups)).toEqual(["one", "two", "three"]);
    expect(summarizeDropoutGroups(groups, new Map([
      ["one", false], ["two", true], ["three", true],
    ]))).toEqual([
      { groupId: "a", name: "A", parcoursId: 1, teacherIds: ["teacher"], analyzed: 2, critical: 1 },
      { groupId: "b", name: "B", parcoursId: 2, teacherIds: ["teacher"], analyzed: 2, critical: 2 },
    ]);
  });

  it("utilise le lundi parisien comme clé malgré le changement d'heure", () => {
    expect(weekKey(new Date("2026-03-30T06:00:00Z"))).toBe("2026-03-30");
    expect(weekKey(new Date("2026-03-29T21:30:00Z"))).toBe("2026-03-23");
  });

  it("rattrape l'échéance passée et calcule le prochain réveil à 8 h de Paris", () => {
    expect(dueDropoutPeriods(new Date("2026-03-30T05:59:00Z")).week).toBeNull();
    expect(dueDropoutPeriods(new Date("2026-03-30T06:00:00Z")).week).toBe("2026-03-30");
    expect(dueDropoutPeriods(new Date("2026-04-01T06:00:00Z")).month).toBe("2026-03");
    expect(nextDropoutWake(new Date("2026-03-29T21:30:00Z")).toISOString()).toBe("2026-03-30T06:00:00.000Z");
    expect(nextDropoutWake(new Date("2026-10-25T21:30:00Z")).toISOString()).toBe("2026-10-26T07:00:00.000Z");
  });

  it("limite les prédictions simultanées et attend les tâches en cours avant un échec", async () => {
    let active = 0;
    let maximum = 0;
    const result = await mapWithConcurrency([1, 2, 3, 4, 5], 2, async (value) => {
      active++;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, 1));
      active--;
      return value * 2;
    });
    expect(maximum).toBe(2);
    expect([...result.entries()].sort(([left], [right]) => left - right)).toEqual([[1, 2], [2, 4], [3, 6], [4, 8], [5, 10]]);
    await expect(mapWithConcurrency([1, 2, 3], 2, async (value) => {
      if (value === 2) throw new Error("indisponible");
      return value;
    })).rejects.toThrow("indisponible");
  });

  it("reprend séparément le traitement hebdomadaire et le récapitulatif mensuel après un échec", async () => {
    const now = new Date("2026-06-01T06:00:00Z");
    let weekComplete = false;
    let monthComplete = false;
    let weeklySends = 0;
    let monthlySends = 0;
    let attempts = 0;
    const jobs = {
      runWeek: async () => {
        attempts++;
        if (attempts === 1) throw new Error("IA indisponible");
        weekComplete = true;
        return true;
      },
      sendWeek: async () => { if (weekComplete) weeklySends++; },
      monthDone: async () => monthComplete,
      sendMonth: async () => { monthlySends++; },
      markMonthDone: async () => { monthComplete = true; },
    };
    await expect(runDueDropoutSchedule(now, jobs)).rejects.toThrow("IA indisponible");
    expect(weeklySends).toBe(0);
    expect(monthlySends).toBe(1);
    await runDueDropoutSchedule(now, jobs);
    expect(weeklySends).toBe(1);
    expect(monthlySends).toBe(1);
  });

  it("n'envoie que les groupes critiques encore rattachés, sans identité d'apprenant", () => {
    const available = criticalGroupsForTeacher([
      { name: "A <script>", parcoursId: 1, teacherIds: ["teacher"], critical: 2 },
      { name: "B", parcoursId: 1, teacherIds: ["teacher"], critical: 0 },
      { name: "C", parcoursId: 2, teacherIds: ["teacher"], critical: 1 },
      { name: "D", parcoursId: 1, teacherIds: ["other"], critical: 1 },
    ], "teacher", new Set([1]));
    expect(available).toEqual([{ name: "A <script>", critical: 2 }]);
    expect(dropoutSummaryHtml(available)).toBe("<ul><li>A &lt;script&gt; : 2 cas critiques</li></ul>");
    expect(DROPOUT_SUMMARY_SUBJECT).not.toContain("A");
    expect(criticalGroupsForTeacher([{ name: "B", parcoursId: 1, teacherIds: ["teacher"], critical: 0 }], "teacher", new Set([1]))).toEqual([]);
  });

  it("déclenche l'onboarding une seule fois après la première affectation directe", () => {
    expect(dropoutOnboardingRequired(false)).toBe(false);
    expect(dropoutOnboardingRequired(true)).toBe(true);
    expect(dropoutOnboardingRequired(true, new Date("2026-09-24"))).toBe(false);
  });
});
