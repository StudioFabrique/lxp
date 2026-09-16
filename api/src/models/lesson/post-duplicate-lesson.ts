import { whereFromObject } from "../../utils/prisma-query.ts";
import type { NestedCreate } from "../../utils/db.ts";
import type { Lesson } from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getDuplicateIdentity } from "../../helpers/duplication.ts";
import { duplicateActivityFile } from "../../helpers/duplicate-activity-file.ts";

export default async function postDuplicateLesson(
  courseId: number,
  lessonId: number[],
  adminId: string,
) {
  // Vérification que lessonId n'est pas vide
  if (!lessonId || lessonId.length === 0) {
    const error = new Error("Aucune leçon à dupliquer");
    (error as any).statusCode = 400;
    throw error;
  }

  const existingCourse = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, { id: courseId }),
  )
    .include("lessons", (related127) =>
      related127.select("title", "duplicationIndex", "order"),
    )
    .first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const prismaAdmin = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: adminId }),
  )
    .select("id")
    .first();

  if (!prismaAdmin) {
    const error = new Error("L'auteur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAdmin = await User.findOne(
    { _id: adminId },
    { firstname: 1, lastname: 1 },
  );

  if (!existingAdmin) {
    const error = new Error("L'auteur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let newLessons: Lesson[] = [];

  await prisma.transaction(async (tx) => {
    // Récupérer les leçons à copier avec leurs activités
    const lessonsToCopy = await tx.orm.public.Lesson.where((row) =>
      whereFromObject(row, { id: { in: lessonId } }),
    )
      .select("title", "duplicationIndex", "description", "modalite", "tagId")
      .include("activities", (related128) =>
        related128
          .select("title", "type", "order", "url", "duplicationIndex")
          .include("resourceActivities")
          .orderBy((row) => row.order.asc()),
      )
      .all();

    if (!lessonsToCopy || lessonsToCopy.length === 0) {
      throw { statusCode: 404, message: "Les leçons n'existent pas" };
    }

    // Calculer le prochain ordre disponible
    const maxOrder =
      existingCourse.lessons.length > 0
        ? Math.max(...existingCourse.lessons.map((l) => l.order))
        : -1;

    // Créer les nouvelles leçons avec leurs activités
    newLessons = await Promise.all(
      lessonsToCopy.map(async (lessonData, index) => {
        const identity = getDuplicateIdentity(
          lessonData,
          existingCourse.lessons.map((lesson) => lesson.title),
        );
        const activities = await Promise.all(
          lessonData.activities.map(async (activity) => ({
            ...activity,
            url: await duplicateActivityFile(activity.url, activity.type),
            resourceActivities: await Promise.all(
              activity.resourceActivities.map(async (resource) => ({
                ...resource,
                url: await duplicateActivityFile(resource.url, "resource"),
              })),
            ),
          })),
        );
        return tx.orm.public.Lesson.include("tag")
          .include("activities", (related129) =>
            related129.orderBy((row) => row.order.asc()),
          )
          .create({
            title: identity.title,
            duplicationIndex: identity.duplicationIndex,
            description: lessonData.description,
            modalite: lessonData.modalite,
            author: `${existingAdmin.firstname} ${existingAdmin.lastname}`,
            order: maxOrder + index + 1,
            tagId: lessonData.tagId,
            adminId: prismaAdmin.id,
            courseId: courseId,
            activities: (relation) =>
              relation.create(
                activities.map((a) => ({
                  title: a.title,
                  type: a.type,
                  order: a.order,
                  url: a.url,
                  duplicationIndex: a.duplicationIndex,
                  authorId: prismaAdmin.id,
                  resourceActivities: (relation: NestedCreate<"ResourceActivity">) =>
                    relation.create(
                      a.resourceActivities.map(({ label, order, url }) => ({
                        label,
                        order,
                        url,
                      })),
                    ),
                })),
              ),
          });
      }),
    );
  });

  if (!newLessons || newLessons.length === 0) {
    const error = new Error("Les leçons n'ont pas pu être enregistrées");
    (error as any).statusCode = 500;
    throw error;
  }

  return newLessons.map((l) => ({ id: l.id, title: l.title }));
}
