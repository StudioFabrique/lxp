import { and } from "@prisma/orm-postgres/orm-client";
import {
  HEARTBEAT_INTERVAL_MS,
  type ContentType,
} from "../../config/content-read.ts";
import { prisma, type TransactionClient } from "../../utils/db.ts";

export type ContentRead = {
  id: number;
  beganAt: string;
  lastOpenedAt: string;
  finishedAt: string | null;
  readTimeMs: number;
  studentId: number;
};

type DatabaseSession = typeof prisma | TransactionClient;

const MAX_HEARTBEAT_CREDIT_MS = HEARTBEAT_INTERVAL_MS * 2;

export function computeHeartbeatCredit(lastOpenedAt: Date, now: Date): number {
  const elapsed = now.getTime() - lastOpenedAt.getTime();
  if (elapsed <= 0) return 0;
  return Math.min(elapsed, MAX_HEARTBEAT_CREDIT_MS);
}

export class ContentReadRepository {
  private readonly database: DatabaseSession;

  constructor(database: DatabaseSession = prisma) {
    this.database = database;
  }

  findStudentByMongoId(idMdb: string) {
    return this.database.orm.public.Student.where({ idMdb }).first();
  }

  find(type: ContentType, contentId: number, studentId: number) {
    switch (type) {
      case "module":
        return this.database.orm.public.ModuleRead.where({
          moduleId: contentId,
          studentId,
        }).first();
      case "course":
        return this.database.orm.public.CourseRead.where({
          courseId: contentId,
          studentId,
        }).first();
      case "lesson":
        return this.database.orm.public.LessonRead.where({
          lessonId: contentId,
          studentId,
        }).first();
      case "activity":
        return this.database.orm.public.ActivityRead.where({
          activityId: contentId,
          studentId,
        }).first();
    }
  }

  private create(type: ContentType, contentId: number, studentId: number) {
    switch (type) {
      case "module":
        return this.database.orm.public.ModuleRead.create({
          moduleId: contentId,
          studentId,
        });
      case "course":
        return this.database.orm.public.CourseRead.create({
          courseId: contentId,
          studentId,
        });
      case "lesson":
        return this.database.orm.public.LessonRead.create({
          lessonId: contentId,
          studentId,
        });
      case "activity":
        return this.database.orm.public.ActivityRead.create({
          activityId: contentId,
          studentId,
        });
    }
  }

  private update(
    type: ContentType,
    id: number,
    data: { lastOpenedAt?: string; finishedAt?: string },
  ) {
    switch (type) {
      case "module":
        return this.database.orm.public.ModuleRead.where({ id }).update(data);
      case "course":
        return this.database.orm.public.CourseRead.where({ id }).update(data);
      case "lesson":
        return this.database.orm.public.LessonRead.where({ id }).update(data);
      case "activity":
        return this.database.orm.public.ActivityRead.where({ id }).update(data);
    }
  }

  async open(type: ContentType, contentId: number, studentId: number) {
    const existing = await this.find(type, contentId, studentId);
    return existing
      ? this.update(type, existing.id, {
          lastOpenedAt: new Date().toISOString(),
        })
      : this.create(type, contentId, studentId);
  }

  private updateReadTime(
    type: ContentType,
    existing: ContentRead,
    credit: number,
    lastOpenedAt: string,
  ) {
    const data = { readTimeMs: existing.readTimeMs + credit, lastOpenedAt };
    switch (type) {
      case "module":
        return this.database.orm.public.ModuleRead.where({
          id: existing.id,
          lastOpenedAt: existing.lastOpenedAt,
        }).updateAndCount(data);
      case "course":
        return this.database.orm.public.CourseRead.where({
          id: existing.id,
          lastOpenedAt: existing.lastOpenedAt,
        }).updateAndCount(data);
      case "lesson":
        return this.database.orm.public.LessonRead.where({
          id: existing.id,
          lastOpenedAt: existing.lastOpenedAt,
        }).updateAndCount(data);
      case "activity":
        return this.database.orm.public.ActivityRead.where({
          id: existing.id,
          lastOpenedAt: existing.lastOpenedAt,
        }).updateAndCount(data);
    }
  }

  async addReadTime(
    type: ContentType,
    contentId: number,
    studentId: number,
    now: Date = new Date(),
  ) {
    const existing = await this.find(type, contentId, studentId);
    if (!existing) return null;

    const credit = computeHeartbeatCredit(new Date(existing.lastOpenedAt), now);
    if (credit === 0) return existing;

    const write = async (transaction: TransactionClient) => {
      const repository = new ContentReadRepository(transaction);
      const count = await repository.updateReadTime(
        type,
        existing,
        credit,
        now.toISOString(),
      );
      if (count > 0) {
        await transaction.orm.public.ContentReadCredit.create({
          studentId,
          type,
          contentId,
          from: new Date(now.getTime() - credit).toISOString(),
          to: now.toISOString(),
        });
      }
      return repository.find(type, contentId, studentId);
    };

    return "transaction" in this.database
      ? this.database.transaction(write)
      : write(this.database);
  }

  async finish(type: ContentType, contentId: number, studentId: number) {
    const existing = await this.find(type, contentId, studentId);
    if (!existing || existing.finishedAt) return existing;
    return this.update(type, existing.id, {
      finishedAt: new Date().toISOString(),
    });
  }

  async sumReadTime(
    type: ContentType,
    studentId: number,
    from: Date,
    to: Date,
  ): Promise<number> {
    const rows = await this.database.orm.public.ContentReadCredit.where(
      (credit) =>
        and(
          credit.studentId.eq(studentId),
          credit.type.eq(type),
          credit.to.gt(from.toISOString()),
          credit.from.lt(to.toISOString()),
        ),
    )
      .select("from", "to")
      .all();

    return rows.reduce((duration, credit) => {
      const start = Math.max(new Date(credit.from).getTime(), from.getTime());
      const end = Math.min(new Date(credit.to).getTime(), to.getTime());
      return duration + Math.max(0, end - start);
    }, 0);
  }

  countFinished(type: ContentType, studentId: number, from: Date, to: Date) {
    const fromIso = from.toISOString();
    const toIso = to.toISOString();
    switch (type) {
      case "module":
        return this.database.orm.public.ModuleRead.where((read) =>
          and(
            read.studentId.eq(studentId),
            read.finishedAt.gte(fromIso),
            read.finishedAt.lte(toIso),
          ),
        )
          .aggregate((aggregate) => ({ total: aggregate.count() }))
          .then(({ total }) => total);
      case "course":
        return this.database.orm.public.CourseRead.where((read) =>
          and(
            read.studentId.eq(studentId),
            read.finishedAt.gte(fromIso),
            read.finishedAt.lte(toIso),
          ),
        )
          .aggregate((aggregate) => ({ total: aggregate.count() }))
          .then(({ total }) => total);
      case "lesson":
        return this.database.orm.public.LessonRead.where((read) =>
          and(
            read.studentId.eq(studentId),
            read.finishedAt.gte(fromIso),
            read.finishedAt.lte(toIso),
          ),
        )
          .aggregate((aggregate) => ({ total: aggregate.count() }))
          .then(({ total }) => total);
      case "activity":
        return this.database.orm.public.ActivityRead.where((read) =>
          and(
            read.studentId.eq(studentId),
            read.finishedAt.gte(fromIso),
            read.finishedAt.lte(toIso),
          ),
        )
          .aggregate((aggregate) => ({ total: aggregate.count() }))
          .then(({ total }) => total);
    }
  }

  async canFinish(type: ContentType, contentId: number, studentId: number) {
    if (type === "course") {
      const assignment = await this.database.orm.public.CourseAssignment.where({
        courseId: contentId,
      })
        .include("submissions", (submissions) =>
          submissions
            .where((row) =>
              and(row.studentId.eq(studentId), row.submittedAt.isNotNull()),
            )
            .select("id"),
        )
        .first();
      return !assignment || assignment.submissions.length > 0;
    }
    if (type === "module") {
      const { total } = await this.database.orm.public.CourseAssignment.where(
        (row) =>
          and(
            row.course.some((course) => course.moduleId.eq(contentId)),
            row.submissions.none((submissions) =>
              and(
                submissions.studentId.eq(studentId),
                submissions.submittedAt.isNotNull(),
              ),
            ),
          ),
      ).aggregate((aggregate) => ({ total: aggregate.count() }));
      return total === 0;
    }
    return true;
  }
}

export const contentReadRepository = new ContentReadRepository();
