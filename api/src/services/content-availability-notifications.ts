import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../utils/db.ts";
import User from "../utils/interfaces/db/user.ts";
import { logger } from "../utils/logs/logger.ts";
import { resolveAvailableFormations } from "../models/learning-profile/learning-profile.ts";
import { sendContentAvailabilityEmail } from "./mailer.ts";

const BASELINE_KEY = "content-availability-notifications-v1";
const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 60 * 60_000];
const SWEEP_INTERVAL_MS = 30_000;
let reconciliationScheduled = false;
let workerRunning = false;

async function activeStudentIds() {
  const students = await prisma.orm.public.Student.select("id", "idMdb").all();
  if (students.length === 0) return [];
  const activeUsers = await User.find({
    _id: { $in: students.map((student) => student.idMdb) },
    isActive: true,
  }).select("_id");
  const activeIds = new Set(activeUsers.map((user) => user.id));
  return students.filter((student) => activeIds.has(student.idMdb));
}

async function createNotificationRows(
  userIdMdb: string,
  status: "pending" | "suppressed",
) {
  const student = await prisma.orm.public.Student.where({ idMdb: userIdMdb })
    .select("id")
    .first();
  if (!student) return;
  const formations = await resolveAvailableFormations(userIdMdb);
  for (const formation of formations) {
    await prisma.orm.public.ContentAvailabilityNotification.where((row) =>
      and(
        row.studentId.eq(student.id),
        row.formationId.eq(formation.id),
      ),
    ).upsert({
      create: {
        studentId: student.id,
        formationId: formation.id,
        status,
        suppressionReason:
          status === "suppressed" ? "deployment_baseline" : null,
      },
      update: {},
      conflictOn: { studentId: student.id, formationId: formation.id },
    });
  }
}

export async function initializeContentAvailabilityNotifications() {
  const baseline = await prisma.orm.public.SystemJobState.where({
    key: BASELINE_KEY,
  }).first();
  if (baseline) return;

  // Ces colonnes existaient sans être pilotées. Cette normalisation ne se joue
  // qu'une fois et préserve la visibilité que les apprenants avaient avant la
  // mise en place de la hiérarchie stricte.
  await prisma.orm.public.Parcours.where({ isPublished: true }).updateAndCount({
    visibility: true,
  });
  await prisma.orm.public.Lesson.where((lesson) => lesson.id.gt(0)).updateAndCount({
    isPublished: true,
    visibility: true,
  });

  for (const student of await activeStudentIds()) {
    await createNotificationRows(student.idMdb, "suppressed");
  }
  await prisma.orm.public.SystemJobState.create({ key: BASELINE_KEY });
}

export async function reconcileContentAvailability() {
  for (const student of await activeStudentIds()) {
    await createNotificationRows(student.idMdb, "pending");
  }
}

export function scheduleAvailabilityReconciliation() {
  if (reconciliationScheduled) return;
  reconciliationScheduled = true;
  setTimeout(() => {
    reconciliationScheduled = false;
    void reconcileContentAvailability().catch((error) =>
      logger.error("Réconciliation de disponibilité impossible", error),
    );
  }, 0);
}

async function processDueNotifications() {
  if (workerRunning) return;
  workerRunning = true;
  try {
    const now = new Date();
    const due = await prisma.orm.public.ContentAvailabilityNotification.where(
      (row) =>
        and(
          row.status.eq("pending"),
          row.nextAttemptAt.lte(now.toISOString()),
        ),
    )
      .select("id", "studentId", "formationId", "attemptCount", "nextAttemptAt")
      .include("student", (student) => student.select("idMdb"))
      .include("formation", (formation) => formation.select("title"))
      .limit(20)
      .all();

    for (const notification of due) {
      const claimed = await prisma.orm.public.ContentAvailabilityNotification.where(
        (row) =>
          and(
            row.id.eq(notification.id),
            row.status.eq("pending"),
            row.nextAttemptAt.lte(now.toISOString()),
          ),
      ).updateAndCount({
        // Lease the row first. An inactive account is deferred without consuming
        // one of its five actual SMTP attempts.
        nextAttemptAt: new Date(now.getTime() + 5 * 60_000).toISOString(),
      });
      if (claimed === 0) continue;

      const user = await User.findById(notification.student!.idMdb).select(
        "email firstname isActive",
      );
      if (!user?.isActive) {
        await prisma.orm.public.ContentAvailabilityNotification.where({
          id: notification.id,
        }).update({
          nextAttemptAt: new Date(Date.now() + SWEEP_INTERVAL_MS).toISOString(),
        });
        continue;
      }
      const availableFormation = (
        await resolveAvailableFormations(notification.student!.idMdb)
      ).find((formation) => formation.id === notification.formationId);
      if (!availableFormation) {
        await prisma.orm.public.ContentAvailabilityNotification.where({
          id: notification.id,
        }).update({
          status: "suppressed",
          suppressionReason: "content_unavailable_before_delivery",
        });
        continue;
      }

      const attemptCount = notification.attemptCount + 1;
      await prisma.orm.public.ContentAvailabilityNotification.where({
        id: notification.id,
      }).update({
        attemptCount,
        lastAttemptAt: new Date().toISOString(),
      });

      try {
        await sendContentAvailabilityEmail({
          email: user.email,
          firstname: user.firstname,
          formation: notification.formation!.title,
          parcours: availableFormation.parcours.map((parcours) => parcours.title),
          messageId: `<content-${notification.studentId}-${notification.formationId}@andria-lxp>`,
        });
        await prisma.orm.public.ContentAvailabilityNotification.where({
          id: notification.id,
        }).update({
          status: "sent",
          sentAt: new Date().toISOString(),
          lastError: null,
        });
      } catch (error) {
        const lastError =
          error instanceof Error ? error.message : JSON.stringify(error);
        if (attemptCount >= 5) {
          await prisma.orm.public.ContentAvailabilityNotification.where({
            id: notification.id,
          }).update({ status: "failed", lastError });
        } else {
          await prisma.orm.public.ContentAvailabilityNotification.where({
            id: notification.id,
          }).update({
            lastError,
            nextAttemptAt: new Date(
              Date.now() + RETRY_DELAYS_MS[attemptCount - 1]!,
            ).toISOString(),
          });
        }
      }
    }
  } finally {
    workerRunning = false;
  }
}

export function startContentAvailabilityWorker() {
  void reconcileContentAvailability()
    .then(processDueNotifications)
    .catch((error) => logger.error("Démarrage du worker de disponibilité impossible", error));
  const timer = setInterval(() => {
    void reconcileContentAvailability()
      .then(processDueNotifications)
      .catch((error) => logger.error("Worker de disponibilité en échec", error));
  }, SWEEP_INTERVAL_MS);
  timer.unref();
}
