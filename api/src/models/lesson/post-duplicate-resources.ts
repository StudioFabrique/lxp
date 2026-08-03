import { Lesson } from "@prisma/client";

import { duplicateActivityFile } from "../../helpers/duplicate-activity-file";
import { getDuplicateIdentity } from "../../helpers/duplication";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

function createHttpError(message: string, statusCode: number) {
  const error = new Error(message);
  (error as Error & { statusCode: number }).statusCode = statusCode;
  return error;
}

export default async function postDuplicateResources(
  courseId: number,
  resourceIds: number[],
  adminMongoId: string,
) {
  if (!resourceIds?.length) {
    throw createHttpError("Aucune ressource à importer", 400);
  }

  const [existingCourse, prismaAdmin, existingAdmin] = await Promise.all([
    prisma.course.findFirst({
      where: { id: courseId },
      select: {
        lessons: {
          select: { title: true, order: true },
        },
      },
    }),
    prisma.admin.findFirst({
      where: { idMdb: adminMongoId },
      select: { id: true },
    }),
    User.findOne(
      { _id: adminMongoId },
      { firstname: 1, lastname: 1 },
    ),
  ]);

  if (!existingCourse) {
    throw createHttpError("Le cours n'existe pas", 404);
  }
  if (!prismaAdmin || !existingAdmin) {
    throw createHttpError("L'auteur n'existe pas", 404);
  }

  let newLessons: Lesson[] = [];

  await prisma.$transaction(async (tx) => {
    const resources = await tx.resource.findMany({
      where: { id: { in: resourceIds } },
      select: {
        title: true,
        description: true,
        tags: { select: { tagId: true }, take: 1 },
        bonusActivities: {
          select: {
            title: true,
            type: true,
            order: true,
            url: true,
            resourceBonusActivities: {
              select: { label: true, order: true, url: true },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!resources.length) {
      throw createHttpError("Les ressources n'existent pas", 404);
    }
    if (resources.some((resource) => !resource.tags.length)) {
      throw createHttpError(
        "Une ressource doit avoir un tag pour être importée",
        400,
      );
    }

    const maxOrder = existingCourse.lessons.length
      ? Math.max(...existingCourse.lessons.map((lesson) => lesson.order))
      : -1;
    const existingTitles = existingCourse.lessons.map(
      (lesson) => lesson.title,
    );
    const resourcesWithIdentity = resources.map((resource) => {
      const identity = getDuplicateIdentity(
        { title: resource.title, duplicationIndex: 0 },
        existingTitles,
      );
      existingTitles.push(identity.title);
      return { resource, identity };
    });

    newLessons = await Promise.all(
      resourcesWithIdentity.map(async ({ resource, identity }, index) => {
        const activities = await Promise.all(
          resource.bonusActivities.map(async (activity) => ({
            ...activity,
            url: await duplicateActivityFile(activity.url, activity.type),
            resourceBonusActivities: await Promise.all(
              activity.resourceBonusActivities.map(async (attachment) => ({
                ...attachment,
                url: await duplicateActivityFile(attachment.url, "resource"),
              })),
            ),
          })),
        );

        return tx.lesson.create({
          data: {
            title: identity.title,
            duplicationIndex: identity.duplicationIndex,
            description: resource.description ?? "",
            modalite: "distanciel",
            author: `${existingAdmin.firstname} ${existingAdmin.lastname}`,
            order: maxOrder + index + 1,
            tagId: resource.tags[0].tagId,
            adminId: prismaAdmin.id,
            courseId,
            activities: {
              create: activities.map((activity) => ({
                title: activity.title,
                type: activity.type,
                order: activity.order,
                url: activity.url,
                authorId: prismaAdmin.id,
                resourceActivities: {
                  create: activity.resourceBonusActivities,
                },
              })),
            },
          },
        });
      }),
    );
  });

  if (!newLessons.length) {
    throw createHttpError("Les ressources n'ont pas pu être importées", 500);
  }

  return newLessons.map((lesson) => ({ id: lesson.id, title: lesson.title }));
}
