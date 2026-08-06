import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getDuplicateIdentity } from "../../helpers/duplication.ts";
import { duplicateActivityFile } from "../../helpers/duplicate-activity-file.ts";

export default async function postDuplicateParcours(
  parcoursId: number,
  userId: string,
) {
  const [source, admin, mongoUser] = await Promise.all([
    prisma.parcours.findUnique({
      where: { id: parcoursId },
      include: {
        objectives: true,
        bonusSkills: true,
        contacts: true,
        tags: true,
        modules: {
          include: {
            contacts: true,
            bonusSkills: true,
            quizzes: {
              where: { courseId: null, activityId: null },
              include: {
                questions: { include: { quizQuestionReports: true } },
              },
            },
            courses: {
              orderBy: { order: "asc" },
              include: {
                contacts: true,
                tags: true,
                lessons: {
                  orderBy: { order: "asc" },
                  include: {
                    activities: {
                      orderBy: { order: "asc" },
                      include: { resourceActivities: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.admin.findFirst({ where: { idMdb: userId } }),
    User.findById(userId),
  ]);

  if (!source) {
    throw { statusCode: 404, message: "Le parcours n'existe pas." };
  }
  if (!admin) {
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
  }

  const existingParcoursTitles = await prisma.parcours.findMany({
    select: { title: true },
  });
  const parcoursIdentity = getDuplicateIdentity(
    source,
    existingParcoursTitles.map(({ title }) => title),
  );

  const existingModuleTitles = await prisma.module.findMany({
    where: { parcours: { formationId: source.formationId } },
    select: { title: true },
  });
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
                  url: await duplicateActivityFile(
                    activity.url,
                    activity.type,
                  ),
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

  return prisma.$transaction(async (tx) => {
    const createdParcours = await tx.parcours.create({
      data: {
        title: parcoursIdentity.title,
        duplicationIndex: parcoursIdentity.duplicationIndex,
        description: source.description,
        startDate: source.startDate,
        endDate: source.endDate,
        degree: source.degree,
        image: source.image,
        thumb: source.thumb,
        virtualClass: source.virtualClass,
        visibility: false,
        isPublished: false,
        author: mongoUser
          ? `${mongoUser.firstname} ${mongoUser.lastname}`
          : source.author,
        adminId: admin.id,
        formationId: source.formationId,
        objectives: {
          create: source.objectives.map(({ description }) => ({ description })),
        },
        contacts: {
          create: source.contacts.map(({ contactId }) => ({
            contact: { connect: { id: contactId } },
          })),
        },
        tags: {
          create: source.tags.map(({ tagId }) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
    });

    const skillMap = new Map<number, number>();
    for (const skill of source.bonusSkills) {
      const createdSkill = await tx.bonusSkill.create({
        data: {
          description: skill.description,
          badge: skill.badge,
          parcoursId: createdParcours.id,
        },
      });
      skillMap.set(skill.id, createdSkill.id);
    }

    for (let index = 0; index < copiedModules.length; index += 1) {
      const module = copiedModules[index];
      const identity = moduleIdentities[index];
      await tx.module.create({
        data: {
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
          contacts: {
            create: module.contacts.map(({ contactId }) => ({
              contact: { connect: { id: contactId } },
            })),
          },
          bonusSkills: {
            create: module.bonusSkills
              .map(({ bonusSkillId }) => skillMap.get(bonusSkillId))
              .filter((id): id is number => id !== undefined)
              .map((bonusSkillId) => ({
                bonusSkill: { connect: { id: bonusSkillId } },
              })),
          },
          courses: {
            create: module.courses.map((course) => ({
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
              contacts: {
                create: course.contacts.map(({ contactId }) => ({
                  contact: { connect: { id: contactId } },
                })),
              },
              tags: {
                create: course.tags.map(({ tagId }) => ({
                  tag: { connect: { id: tagId } },
                })),
              },
              lessons: {
                create: course.lessons.map((lesson) => ({
                  title: lesson.title,
                  description: lesson.description,
                  modalite: lesson.modalite,
                  author: lesson.author,
                  adminId: admin.id,
                  tagId: lesson.tagId,
                  order: lesson.order,
                  isPublished: lesson.isPublished,
                  visibility: lesson.visibility,
                  duplicationIndex: lesson.duplicationIndex + 1,
                  activities: {
                    create: lesson.activities.map((activity) => ({
                      title: activity.title,
                      type: activity.type,
                      order: activity.order,
                      url: activity.url,
                      authorId: admin.id,
                      duplicationIndex: activity.duplicationIndex + 1,
                      resourceActivities: {
                        create: activity.resourceActivities.map(
                          ({ label, order, url }) => ({ label, order, url }),
                        ),
                      },
                    })),
                  },
                })),
              },
            })),
          },
          quizzes: {
            create: module.quizzes.map((quiz) => ({
              title: quiz.title,
              type: quiz.type,
              questions: {
                create: quiz.questions.map((question) => ({
                  externalId: question.externalId,
                  type: question.type,
                  difficulty: question.difficulty,
                  prompt: question.prompt,
                  explanationTrue: question.explanationTrue,
                  explanationWrong: question.explanationWrong,
                  tags: question.tags,
                  data: question.data as any,
                  contentHash: null,
                  quizQuestionReports: {
                    create: question.quizQuestionReports.map(
                      ({ commentaire }) => ({ commentaire }),
                    ),
                  },
                })),
              },
            })),
          },
        },
      });
    }

    return createdParcours;
  });
}
