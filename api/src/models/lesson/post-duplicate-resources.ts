import { whereFromObject } from "../../utils/prisma-query.ts";
import type { Lesson } from "../../prisma/model-types.ts";

import { duplicateActivityFile } from "../../helpers/duplicate-activity-file.ts";
import { getDuplicateIdentity } from "../../helpers/duplication.ts";
import { prisma, type NestedCreate } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

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
    prisma.orm.public.Course.where((row) =>
      whereFromObject(row, { id: courseId }),
    )
      .include("lessons", (related130) => related130.select("title", "order"))
      .first(),
    prisma.orm.public.Admin.where((row) =>
      whereFromObject(row, { idMdb: adminMongoId }),
    )
      .select("id")
      .first(),
    User.findOne({ _id: adminMongoId }, { firstname: 1, lastname: 1 }),
  ]);

  if (!existingCourse) {
    throw createHttpError("Le cours n'existe pas", 404);
  }
  if (!prismaAdmin || !existingAdmin) {
    throw createHttpError("L'auteur n'existe pas", 404);
  }

  let newLessons: Lesson[] = [];

  await prisma.transaction(async (tx) => {
    const resources = await tx.orm.public.Resource.where((row) =>
      whereFromObject(row, { id: { in: resourceIds } }),
    )
      .select("title", "description")
      .include("tags", (related131) => related131.select("tagId").limit(1))
      .include("bonusActivities", (related132) =>
        related132
          .select("title", "type", "order", "url")
          .include("resourceBonusActivities", (related133) =>
            related133
              .select("label", "order", "url")
              .orderBy((row) => row.order.asc()),
          )
          .orderBy((row) => row.order.asc()),
      )
      .all();

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
    const existingTitles = existingCourse.lessons.map((lesson) => lesson.title);
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

        return tx.orm.public.Lesson.create({
          title: identity.title,
          duplicationIndex: identity.duplicationIndex,
          description: resource.description ?? "",
          modalite: "distanciel",
          author: `${existingAdmin.firstname} ${existingAdmin.lastname}`,
          order: maxOrder + index + 1,
          tagId: resource.tags[0].tagId,
          adminId: prismaAdmin.id,
          courseId,
          activities: (relation) =>
            relation.create(
              activities.map((activity) => ({
                title: activity.title,
                type: activity.type,
                order: activity.order,
                url: activity.url,
                authorId: prismaAdmin.id,
                resourceActivities: (relation: NestedCreate<"ResourceActivity">) =>
                  relation.create(
                    activity.resourceBonusActivities.map(({ label, order, url }) => ({ label, order, url })),
                  ),
              })),
            ),
        });
      }),
    );
  });

  if (!newLessons.length) {
    throw createHttpError("Les ressources n'ont pas pu être importées", 500);
  }

  return newLessons.map((lesson) => ({ id: lesson.id, title: lesson.title }));
}
