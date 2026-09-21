import { prisma, type NestedCreate } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getDuplicateIdentity } from "../../helpers/duplication.ts";
import { duplicateActivityFile } from "../../helpers/duplicate-activity-file.ts";

export default async function postDuplicateParcours(
  parcoursId: number,
  userId: string,
) {
  const [source, admin, mongoUser] = await Promise.all([
    prisma.orm.public.Parcours.where({ id: parcoursId })
      .include("objectives")
      .include("bonusSkills")
      .include("contacts")
      .include("tags")
      .include("modules", (related7) =>
        related7
          .include("contacts")
          .include("bonusSkills")
          .include("quizzes", (related8) =>
            related8
              .where({ courseId: null, activityId: null })
              .include("questions", (related9) =>
                related9.include("quizQuestionReports"),
              ),
          )
          .include("courses", (related10) =>
            related10
              .include("contacts")
              .include("tags")
              .include("lessons", (related11) =>
                related11
                  .include("activities", (related12) =>
                    related12
                      .include("resourceActivities")
                      .orderBy((row) => row.order.asc()),
                  )
                  .orderBy((row) => row.order.asc()),
              )
              .orderBy((row) => row.order.asc()),
          ),
      )
      .first(),
    prisma.orm.public.Admin.where({ idMdb: userId }).first(),
    User.findById(userId),
  ]);

  if (!source) {
    throw { statusCode: 404, message: "Le parcours n'existe pas." };
  }
  if (!admin) {
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
  }

  const existingParcoursTitles =
    await prisma.orm.public.Parcours.select("title").all();
  const parcoursIdentity = getDuplicateIdentity(
    source,
    existingParcoursTitles.map(({ title }) => title),
  );

  const existingModuleTitles = await prisma.orm.public.Module.where((row) =>
    row.parcours.some((parcours) =>
      parcours.formationId.eq(source.formationId),
    ),
  )
    .select("title")
    .all();
  const usedModuleTitles = existingModuleTitles.map(({ title }) => title);
  const moduleIdentities = source.modules.map((module) => {
    const identity = getDuplicateIdentity(module, usedModuleTitles);
    usedModuleTitles.push(identity.title);
    return identity;
  });

  const copiedModules = await Promise.all(
    source.modules.map(async (module) => ({
      ...module,
      courses: await Promise.all(
        module.courses.map(async (course) => ({
          ...course,
          lessons: await Promise.all(
            course.lessons.map(async (lesson) => ({
              ...lesson,
              activities: await Promise.all(
                lesson.activities.map(async (activity) => ({
                  ...activity,
                  url: await duplicateActivityFile(activity.url, activity.type),
                  resourceActivities: await Promise.all(
                    activity.resourceActivities.map(async (resource) => ({
                      ...resource,
                      url: await duplicateActivityFile(
                        resource.url,
                        "resource",
                      ),
                    })),
                  ),
                })),
              ),
            })),
          ),
        })),
      ),
    })),
  );

  return prisma.transaction(async (tx) => {
    const createdParcours = await tx.orm.public.Parcours.create({
      title: parcoursIdentity.title,
      duplicationIndex: parcoursIdentity.duplicationIndex,
      description: source.description,
      startDate: source.startDate,
      endDate: source.endDate,
      degree: source.degree,
      image: source.image,
      thumb: source.thumb,
      virtualClass: source.virtualClass,
      isPublished: false,
      author: mongoUser
        ? `${mongoUser.firstname} ${mongoUser.lastname}`
        : source.author,
      adminId: admin.id,
      formationId: source.formationId,
      objectives: (relation) =>
        relation.create(
          source.objectives.map(({ description }) => ({ description })),
        ),
      contacts: (relation) =>
        relation.create(
          source.contacts.map(({ contactId }) => ({ contactId })),
        ),
      tags: (relation) =>
        relation.create(source.tags.map(({ tagId }) => ({ tagId }))),
    });

    const skillMap = new Map<number, number>();
    for (const skill of source.bonusSkills) {
      const createdSkill = await tx.orm.public.BonusSkill.create({
        description: skill.description,
        badge: skill.badge,
        parcoursId: createdParcours.id,
      });
      skillMap.set(skill.id, createdSkill.id);
    }

    for (let index = 0; index < copiedModules.length; index += 1) {
      const module = copiedModules[index];
      const identity = moduleIdentities[index];
      await tx.orm.public.Module.create({
        title: identity.title,
        duplicationIndex: identity.duplicationIndex,
        description: module.description,
        quizInstructions: module.quizInstructions,
        image: module.image,
        thumb: module.thumb,
        duration: module.duration,
        rating: module.rating,
        minDate: module.minDate,
        maxDate: module.maxDate,
        author: module.author,
        adminId: admin.id,
        parcoursId: createdParcours.id,
        contacts: (relation) =>
          relation.create(
            module.contacts.map(({ contactId }) => ({ contactId })),
          ),
        bonusSkills: (relation) =>
          relation.create(
            module.bonusSkills
              .map(({ bonusSkillId }) => skillMap.get(bonusSkillId))
              .filter((id): id is number => id !== undefined)
              .map((bonusSkillId) => ({ bonusSkillId })),
          ),
        courses: (relation) =>
          relation.create(
            module.courses.map((course) => ({
              title: course.title,
              description: course.description,
              image: course.image,
              virtualClass: course.virtualClass,
              visibility: course.visibility,
              scenario: course.scenario,
              dates: course.dates as any,
              order: course.order,
              isPublished: course.isPublished,
              author: course.author,
              adminId: admin.id,
              courseSlug: null,
              duplicationIndex: course.duplicationIndex + 1,
              contacts: (relation: NestedCreate<"ContactsOnCourse">) =>
                relation.create(
                  course.contacts.map(({ contactId }) => ({ contactId })),
                ),
              tags: (relation: NestedCreate<"TagsOnCourse">) =>
                relation.create(course.tags.map(({ tagId }) => ({ tagId }))),
              lessons: (relation: NestedCreate<"Lesson">) =>
                relation.create(
                  course.lessons.map((lesson) => ({
                    title: lesson.title,
                    description: lesson.description,
                    modalite: lesson.modalite,
                    author: lesson.author,
                    adminId: admin.id,
                    tagId: lesson.tagId,
                    order: lesson.order,
                    visibility: lesson.visibility,
                    duplicationIndex: lesson.duplicationIndex + 1,
                    activities: (relation: NestedCreate<"Activity">) =>
                      relation.create(
                        lesson.activities.map((activity) => ({
                          title: activity.title,
                          type: activity.type,
                          order: activity.order,
                          url: activity.url,
                          authorId: admin.id,
                          duplicationIndex: activity.duplicationIndex + 1,
                          resourceActivities: (
                            relation: NestedCreate<"ResourceActivity">,
                          ) =>
                            relation.create(
                              activity.resourceActivities.map(
                                ({ label, order, url }) => ({
                                  label,
                                  order,
                                  url,
                                }),
                              ),
                            ),
                        })),
                      ),
                  })),
                ),
            })),
          ),
        quizzes: (relation) =>
          relation.create(
            module.quizzes.map((quiz) => ({
              title: quiz.title,
              type: quiz.type,
              questions: (relation: NestedCreate<"QuizQuestion">) =>
                relation.create(
                  quiz.questions.map((question) => ({
                    externalId: question.externalId,
                    type: question.type,
                    difficulty: question.difficulty,
                    prompt: question.prompt,
                    explanationTrue: question.explanationTrue,
                    explanationWrong: question.explanationWrong,
                    tags: question.tags,
                    data: question.data as any,
                    contentHash: null,
                    quizQuestionReports: (
                      relation: NestedCreate<"QuizQuestionReport">,
                    ) =>
                      relation.create(
                        question.quizQuestionReports.map(({ commentaire }) => ({
                          commentaire,
                        })),
                      ),
                  })),
                ),
            })),
          ),
      });
    }

    return createdParcours;
  });
}
