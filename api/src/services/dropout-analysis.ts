import mongoose, { Schema } from "mongoose";
import { randomUUID } from "node:crypto";
import { prisma } from "../utils/db.ts";
import User from "../utils/interfaces/db/user.ts";
import Role from "../utils/interfaces/db/role.ts";
import Group from "../utils/interfaces/db/group.ts";
import predictOutcome from "../models/indicators/predict-outcome.ts";
import type { ModelIndicators } from "../models/indicators/model-features.ts";
import { sendDropoutSummaryEmail } from "./mailer.ts";
import { logger } from "../utils/logs/logger.ts";
import {
  criticalGroupsForTeacher,
  selectEligibleDropoutGroups,
  summarizeDropoutGroups,
  uniqueLearners,
  mapWithConcurrency,
  weekKey,
  parisParts,
  runDueDropoutSchedule,
  nextDropoutWake,
  type DropoutGroup,
} from "./dropout-analysis-logic.ts";

const weeklySchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    leaseUntil: Date,
    owner: String,
    completedAt: Date,
    groups: [
      {
        groupId: String,
        name: String,
        parcoursId: Number,
        teacherIds: [String],
        analyzed: Number,
        critical: Number,
      },
    ],
  },
  { timestamps: true },
);
weeklySchema.index({ status: 1, completedAt: -1 });
const predictionSchema = new Schema({
  key: { type: String, required: true, unique: true },
  week: String,
  userId: String,
  status: String,
  critical: Boolean,
  effectiveLevel: Number,
  indicators: { type: Schema.Types.Mixed },
  coverage: { available: Number, total: Number },
  leaseUntil: Date,
});
const deliverySchema = new Schema({
  key: { type: String, required: true, unique: true },
  status: String,
  claimedAt: Date,
  sentAt: Date,
});
const monthlySchema = new Schema({
  key: { type: String, required: true, unique: true },
  completedAt: { type: Date, required: true },
});
export const DropoutWeek = mongoose.model("DropoutWeek", weeklySchema);
export const DropoutPrediction = mongoose.model(
  "DropoutPrediction",
  predictionSchema,
);
export const DropoutDelivery = mongoose.model(
  "DropoutDelivery",
  deliverySchema,
);
export const DropoutMonth = mongoose.model("DropoutMonth", monthlySchema);

export async function initializeDropoutAnalysis() {
  await Promise.all([
    DropoutWeek.createIndexes(),
    DropoutPrediction.createIndexes(),
    DropoutDelivery.createIndexes(),
    DropoutMonth.createIndexes(),
  ]);
}

export async function eligibleDropoutGroups(
  now = new Date(),
): Promise<DropoutGroup[]> {
  const parcours = await prisma.orm.public.Parcours.where((p) =>
    p.isPublished.eq(true),
  )
    .select("id", "startDate", "endDate", "isPublished")
    .include("contacts", (c) =>
      c.include("contact", (contact) => contact.select("idMdb")),
    )
    .include("groups", (g) =>
      g.include("group", (group) => group.select("idMdb")),
    )
    .all();
  const teacherIds = [
    ...new Set(
      parcours.flatMap((p) =>
        p.contacts
          .map((c) => c.contact?.idMdb)
          .filter((id): id is string => Boolean(id)),
      ),
    ),
  ];
  const teacherRole = await Role.findOne({ role: "teacher", rank: 2 })
    .select("_id")
    .lean();
  if (!teacherRole) return [];
  const teachers = await User.find({
    _id: { $in: teacherIds },
    roles: teacherRole._id,
    isActive: true,
    "dropoutAnalysis.enabled": true,
  })
    .select("_id")
    .lean();
  const enabled = new Set(teachers.map((t) => String(t._id)));
  const eligibleParcours = parcours.filter((p) =>
    (!p.startDate || new Date(p.startDate) <= now) &&
    (!p.endDate || new Date(p.endDate) >= now) &&
    p.contacts.some((c) => c.contact && enabled.has(c.contact.idMdb)));
  if (eligibleParcours.length === 0) return [];
  const groupIds = [
    ...new Set(eligibleParcours.flatMap((p) => p.groups.map((g) => g.group!.idMdb))),
  ];
  const groups = await Group.find({ _id: { $in: groupIds }, isActive: true })
    .select("_id name users isActive")
    .lean();
  const userIds = [
    ...new Set(
      groups.flatMap((g) => (g.users ?? []).map(String)),
    ),
  ];
  const studentRows = userIds.length
    ? await prisma.orm.public.Student.where((student) => student.idMdb.in(userIds)).select("idMdb").all()
    : [];
  const students = new Set(studentRows.map((s) => s.idMdb));
  const activeUsers = userIds.length
    ? await User.find({ _id: { $in: userIds }, isActive: true }).select("_id").lean()
    : [];
  const active = new Set(activeUsers.map((u) => String(u._id)));
  return selectEligibleDropoutGroups({
    now,
    studentIds: students,
    activeUserIds: active,
    enabledTeacherIds: enabled,
    parcours: eligibleParcours.map((p) => ({
      id: p.id,
      isPublished: p.isPublished,
      startDate: p.startDate,
      endDate: p.endDate,
      contacts: p.contacts.flatMap((c) =>
        c.contact ? [{ idMdb: c.contact.idMdb }] : [],
      ),
      groupIds: p.groups.flatMap((g) => (g.group ? [g.group.idMdb] : [])),
    })),
    groups: groups.map((g) => ({
      id: String(g._id),
      name: g.name,
      active: g.isActive,
      userIds: (g.users ?? []).map(String),
    })),
  });
}

async function predictionFor(week: string, userId: string): Promise<boolean> {
  const key = `${week}:${userId}`;
  const existing = await DropoutPrediction.findOne({ key }).lean();
  if (existing?.status === "complete") return Boolean(existing.critical);
  const now = new Date();
  const leaseUntil = new Date(now.getTime() + 10 * 60_000);
  const claim = await DropoutPrediction.findOneAndUpdate(
    {
      key,
      $or: [
        { status: "pending" },
        { status: "processing", leaseUntil: { $lte: now } },
      ],
    },
    { $set: { status: "processing", leaseUntil } },
    { new: true },
  );
  if (!claim) {
    if (existing) throw new Error(`Prédiction en cours : ${key}`);
    try {
      await DropoutPrediction.create({
        key,
        week,
        userId,
        status: "processing",
        leaseUntil,
      });
    } catch (error: any) {
      if (error?.code === 11000)
        throw new Error(`Prédiction en cours : ${key}`);
      throw error;
    }
  }
  try {
    const result = await predictOutcome(userId);
    const critical = result.alert.effectiveLevel === 3;
    await DropoutPrediction.updateOne(
      { key },
      { $set: { status: "complete", critical, effectiveLevel: result.alert.effectiveLevel,
        indicators: result.indicators satisfies ModelIndicators, coverage: result.coverage } },
    );
    return critical;
  } catch (error) {
    await DropoutPrediction.updateOne({ key }, { $set: { status: "pending" } });
    throw error;
  }
}

export async function runWeeklyDropoutAnalysis(now = new Date()) {
  const startedAt = Date.now();
  const week = weekKey(now);
  const previous = await DropoutWeek.findOne({ key: week }).lean();
  if (previous?.status === "complete") return previous;
  const owner = randomUUID();
  const leaseUntil = new Date(Date.now() + 5 * 60_000);
  if (previous) {
    const claimed = await DropoutWeek.findOneAndUpdate(
      { key: week, status: "processing", leaseUntil: { $lte: new Date() } },
      { $set: { leaseUntil, owner } },
    );
    if (!claimed) return null;
  } else {
    try {
      await DropoutWeek.create({
        key: week,
        status: "processing",
        leaseUntil,
        owner,
      });
    } catch (error: any) {
      if (error?.code === 11000) return null;
      throw error;
    }
  }
  const heartbeat = setInterval(() => {
    void DropoutWeek.updateOne(
      { key: week, owner, status: "processing" },
      { $set: { leaseUntil: new Date(Date.now() + 5 * 60_000) } },
    ).catch((error) =>
      logger.error("Renouvellement du traitement impossible", error),
    );
  }, 60_000);
  heartbeat.unref();
  try {
    const groups = await eligibleDropoutGroups(now);
    const predictions = await mapWithConcurrency(uniqueLearners(groups), 2,
      (id) => predictionFor(week, id));
    const summaries = summarizeDropoutGroups(groups, predictions);
    const completedAt = new Date();
    const saved = await DropoutWeek.updateOne(
      { key: week, owner, status: "processing" },
      { $set: { status: "complete", completedAt, groups: summaries } },
    );
    if (saved.modifiedCount !== 1)
      throw new Error(
        "Le traitement hebdomadaire n'est plus réservé par cette instance",
      );
    logger.info("Analyse hebdomadaire du décrochage terminée", {
      week, groups: summaries.length, learners: predictions.size,
      critical: summaries.reduce((total, group) => total + group.critical, 0),
      durationMs: Date.now() - startedAt,
    });
    return await DropoutWeek.findOne({ key: week }).lean();
  } catch (error) {
    await DropoutWeek.updateOne(
      { key: week, owner, status: "processing" },
      { $set: { leaseUntil: new Date(0) } },
    );
    throw error;
  } finally {
    clearInterval(heartbeat);
  }
}

async function deliver(
  period: string,
  frequency: "weekly" | "monthly",
  week: any,
) {
  const teacherIds: string[] = [
    ...new Set<string>(
      (week.groups ?? []).flatMap((g: any) => g.teacherIds as string[]),
    ),
  ];
  const teacherRole = await Role.findOne({ role: "teacher", rank: 2 })
    .select("_id")
    .lean();
  if (!teacherRole) return;
  const teachers = await User.find({
    _id: { $in: teacherIds },
    roles: teacherRole._id,
    isActive: true,
    "dropoutAnalysis.enabled": true,
    "dropoutAnalysis.frequency": frequency,
  })
    .select("_id email dropoutAnalysis.minCritical")
    .lean();
  const attachedContacts = await prisma.orm.public.Contact.where((c) =>
    c.idMdb.in(teacherIds),
  )
    .select("idMdb")
    .include("parcours", (p) => p.select("parcoursId"))
    .all();
  const assignments = new Map(
    attachedContacts.map((c) => [
      c.idMdb,
      new Set(c.parcours.map((p) => p.parcoursId)),
    ]),
  );
  for (const teacher of teachers) {
    const groups = criticalGroupsForTeacher(
      week.groups ?? [],
      String(teacher._id),
      assignments.get(String(teacher._id)) ?? new Set<number>(),
    ).filter((group) => group.critical >= (teacher.dropoutAnalysis?.minCritical ?? 1));
    if (!groups.length) continue;
    const key = `${frequency}:${period}:${teacher._id}`;
    // Claim before SMTP: a restart cannot cause a second delivery.
    try {
      await DropoutDelivery.create({
        key,
        status: "claimed",
        claimedAt: new Date(),
      });
    } catch (error: any) {
      if (error?.code === 11000) continue;
      throw error;
    }
    try {
      await sendDropoutSummaryEmail({
        email: teacher.email,
        groups,
        messageId: `<dropout-${key.replaceAll(":", "-")}@andria>`,
      });
      await DropoutDelivery.updateOne(
        { key },
        { $set: { status: "sent", sentAt: new Date() } },
      );
    } catch (error) {
      logger.error("Envoi du récapitulatif de décrochage impossible", error);
    }
  }
}

export async function sendWeeklyDropoutEmails(week: string) {
  const result = await DropoutWeek.findOne({
    key: week,
    status: "complete",
  }).lean();
  if (result) await deliver(week, "weekly", result);
}

export async function sendMonthlyDropoutEmails(now = new Date()) {
  const p = parisParts(now);
  const previousMonth = new Date(
    Date.UTC(Number(p.year), Number(p.month) - 2, 1),
  );
  const month = previousMonth.toISOString().slice(0, 7);
  const weeks = await DropoutWeek.find({ status: "complete" })
    .sort({ completedAt: -1 })
    .limit(8)
    .lean();
  const latest = weeks.find((week) => {
    const completed = parisParts(week.completedAt!);
    return `${completed.year}-${completed.month}` === month;
  });
  if (latest) await deliver(month, "monthly", latest);
}

export async function processDueDropoutJobs(now = new Date()) {
  await runDueDropoutSchedule(now, {
    runWeek: async (date) => Boolean(await runWeeklyDropoutAnalysis(date)),
    sendWeek: sendWeeklyDropoutEmails,
    monthDone: async (month) => Boolean(await DropoutMonth.exists({ key: month })),
    sendMonth: sendMonthlyDropoutEmails,
    markMonthDone: async (month) => {
      try { await DropoutMonth.create({ key: month, completedAt: new Date() }); }
      catch (error: any) { if (error?.code !== 11000) throw error; }
      logger.info("Récapitulatif mensuel du décrochage traité", { month });
    },
  });
}

export function startDropoutAnalysisWorker() {
  let stopped = false;
  let timeout: NodeJS.Timeout | undefined;
  let active: Promise<void> = Promise.resolve();
  const run = () => { active = tick(); };
  const tick = async () => {
    if (stopped) return;
    let retry = false;
    try { await processDueDropoutJobs(); }
    catch (error) {
      retry = true;
      logger.error("Traitement du décrochage impossible", error);
    }
    if (stopped) return;
    const now = new Date();
    const delay = retry ? 5 * 60_000 : nextDropoutWake(now).getTime() - now.getTime();
    logger.info("Prochain réveil du worker de décrochage", { at: new Date(now.getTime() + Math.max(1000, delay)).toISOString(), retry });
    timeout = setTimeout(run, Math.max(1000, delay));
  };
  run();
  return async () => { stopped = true; if (timeout) clearTimeout(timeout); await active; };
}
