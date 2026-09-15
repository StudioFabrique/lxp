import {
  HEARTBEAT_INTERVAL_MS,
  type ContentType,
} from "../../config/content-read.ts";
import { prisma, type TransactionClient } from "../../utils/db.ts";

export type ContentRead = {
  id: number;
  beganAt: Date;
  lastOpenedAt: Date;
  finishedAt: Date | null;
  readTimeMs: number;
  studentId: number;
};

const MAX_HEARTBEAT_CREDIT_MS = HEARTBEAT_INTERVAL_MS * 2;

/**
 * Temps à créditer pour un battement, borné.
 *
 * On mesure l'écart réel depuis le dernier signe de vie plutôt que d'accepter
 * une durée envoyée par le client : sinon n'importe qui peut se déclarer
 * quarante heures de lecture sur une leçon.
 */
export function computeHeartbeatCredit(lastOpenedAt: Date, now: Date): number {
  const elapsed = now.getTime() - lastOpenedAt.getTime();
  if (elapsed <= 0) return 0;
  return Math.min(elapsed, MAX_HEARTBEAT_CREDIT_MS);
}

// Signature minimale commune aux quatre délégués Prisma *Read. Ils ne
// partagent pas de type généré commun, leur clé étrangère différant d'un
// contenu à l'autre.
type ReadDelegate = {
  findUnique(args: any): Promise<ContentRead | null>;
  create(args: any): Promise<ContentRead>;
  update(args: any): Promise<ContentRead>;
  updateMany(args: any): Promise<{ count: number }>;
  aggregate(args: any): Promise<{ _sum: { readTimeMs: number | null } }>;
  count(args: any): Promise<number>;
};

export class ContentReadRepository {
  private readonly database: typeof prisma | TransactionClient;

  constructor(database: typeof prisma | TransactionClient = prisma) {
    this.database = database;
  }

  findStudentByMongoId(idMdb: string) {
    return this.database.student.findUnique({ where: { idMdb } });
  }

  private delegate(type: ContentType): ReadDelegate {
    switch (type) {
      case "module":
        return this.database.moduleRead as unknown as ReadDelegate;
      case "course":
        return this.database.courseRead as unknown as ReadDelegate;
      case "lesson":
        return this.database.lessonRead as unknown as ReadDelegate;
      case "activity":
        return this.database.activityRead as unknown as ReadDelegate;
    }
  }

  private foreignKey(type: ContentType): string {
    return `${type}Id`;
  }

  /** Clé unique composée, nommée `<contenu>Id_studentId` par Prisma. */
  private uniqueWhere(type: ContentType, contentId: number, studentId: number) {
    return {
      [`${this.foreignKey(type)}_studentId`]: {
        [this.foreignKey(type)]: contentId,
        studentId,
      },
    };
  }

  find(type: ContentType, contentId: number, studentId: number) {
    return this.delegate(type).findUnique({
      where: this.uniqueWhere(type, contentId, studentId),
    });
  }

  /** Crée le suivi de lecture, ou repositionne `lastOpenedAt` s'il existe déjà. */
  async open(type: ContentType, contentId: number, studentId: number) {
    const existing = await this.find(type, contentId, studentId);

    if (existing) {
      return this.delegate(type).update({
        where: { id: existing.id },
        data: { lastOpenedAt: new Date() },
      });
    }

    return this.delegate(type).create({
      data: { [this.foreignKey(type)]: contentId, studentId },
    });
  }

  async addReadTime(
    type: ContentType,
    contentId: number,
    studentId: number,
    now: Date = new Date(),
  ) {
    const existing = await this.find(type, contentId, studentId);
    if (!existing) return null;

    const credit = computeHeartbeatCredit(existing.lastOpenedAt, now);

    if (credit === 0) return existing;
    // Comparaison de lastOpenedAt : deux onglets ne créditent pas le même intervalle.
    const write = async (tx: TransactionClient) => {
      const repository = new ContentReadRepository(tx);
      const updated = await repository.delegate(type).updateMany({
        where: { id: existing.id, lastOpenedAt: existing.lastOpenedAt },
        data: { readTimeMs: { increment: credit }, lastOpenedAt: now },
      });
      if (updated.count > 0) {
        await tx.contentReadCredit.create({ data: {
          studentId, type, contentId,
          from: new Date(now.getTime() - credit), to: now,
        } });
      }
      return repository.find(type, contentId, studentId);
    };
    return "$transaction" in this.database
      ? this.database.$transaction(write)
      : write(this.database);
  }

  async finish(type: ContentType, contentId: number, studentId: number) {
    const existing = await this.find(type, contentId, studentId);
    if (!existing) return null;
    if (existing.finishedAt) return existing;

    return this.delegate(type).update({
      where: { id: existing.id },
      data: { finishedAt: new Date() },
    });
  }

  /** Temps cumulé sur un type de contenu, pour l'indicateur time_on_content. */
  async sumReadTime(
    type: ContentType,
    studentId: number,
    from: Date,
    to: Date,
  ): Promise<number> {
    const rows = await this.database.$queryRaw<{ duration: number }[]>`
      SELECT COALESCE(SUM(EXTRACT(EPOCH FROM
        (LEAST("to", ${to}) - GREATEST("from", ${from}))) * 1000), 0)::float8 AS duration
      FROM "ContentReadCredit"
      WHERE "studentId" = ${studentId} AND "type" = ${type}
        AND "to" > ${from} AND "from" < ${to}
    `;
    return rows[0]?.duration ?? 0;
  }

  countFinished(type: ContentType, studentId: number, from: Date, to: Date) {
    return this.delegate(type).count({
      where: { studentId, finishedAt: { gte: from, lte: to } },
    });
  }

  async canFinish(type: ContentType, contentId: number, studentId: number) {
    if (type === "course") {
      const assignment = await this.database.courseAssignment.findUnique({
        where: { courseId: contentId },
        select: {
          submissions: {
            where: { studentId, submittedAt: { not: null } },
            select: { id: true },
          },
        },
      });
      return !assignment || assignment.submissions.length > 0;
    }
    if (type === "module") {
      const pending = await this.database.courseAssignment.count({
        where: {
          course: { moduleId: contentId },
          submissions: { none: { studentId, submittedAt: { not: null } } },
        },
      });
      return pending === 0;
    }
    return true;
  }
}

export const contentReadRepository = new ContentReadRepository();
