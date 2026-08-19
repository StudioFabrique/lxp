import type { PrismaClient } from "@prisma/client";
import {
  HEARTBEAT_INTERVAL_MS,
  type ContentType,
} from "../../config/content-read.ts";
import { prisma } from "../../utils/db.ts";

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
  aggregate(args: any): Promise<{ _sum: { readTimeMs: number | null } }>;
  count(args: any): Promise<number>;
};

export class ContentReadRepository {
  private readonly database: PrismaClient;

  constructor(database: PrismaClient = prisma) {
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

    return this.delegate(type).update({
      where: { id: existing.id },
      data: {
        readTimeMs: { increment: credit },
        lastOpenedAt: now,
      },
    });
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
    const result = await this.delegate(type).aggregate({
      where: { studentId, lastOpenedAt: { gte: from, lte: to } },
      _sum: { readTimeMs: true },
    });

    return result._sum.readTimeMs ?? 0;
  }

  countFinished(type: ContentType, studentId: number, from: Date, to: Date) {
    return this.delegate(type).count({
      where: { studentId, finishedAt: { gte: from, lte: to } },
    });
  }
}

export const contentReadRepository = new ContentReadRepository();
