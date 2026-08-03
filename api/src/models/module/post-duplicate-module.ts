import { prisma } from "../../utils/db.ts";
import { getDuplicateIdentity } from "../../helpers/duplication.ts";
import { duplicateActivityFile } from "../../helpers/duplicate-activity-file.ts";

export default async function postDuplicateModule(
  sourceModuleId: number,
  associations: { contactsIds: number[]; skillsIds: number[] },
  userId: string,
  targetParcoursId: number,
) {
  const [admin, targetParcours, source] = await Promise.all([
    prisma.admin.findFirst({ where: { idMdb: userId } }),
    prisma.parcours.findUnique({
      where: { id: targetParcoursId },
      select: {
        id: true,
        formationId: true,
        contacts: { select: { contactId: true } },
        bonusSkills: { select: { id: true } },
      },
    }),
    prisma.module.findUnique({
      where: { id: sourceModuleId },
      include: {
        parcours: { select: { formationId: true } },
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
        quizzes: {
          where: { courseId: null, activityId: null },
          include: {
            questions: { include: { quizQuestionReports: true } },
          },
        },
      },
    }),
  ]);

  if (!admin) {
    throw { message: "L'utilisateur n'existe pas.", statusCode: 404 };
  }
  if (!source || !targetParcours) {
    throw { message: "Module ou parcours introuvable.", statusCode: 404 };
  }
  if (source.parcours.formationId !== targetParcours.formationId) {
    throw {
      message:
        "Un module ne peut être dupliqué que dans un parcours de la même formation.",
      statusCode: 400,
    };
  }

  const allowedContacts = new Set(
    targetParcours.contacts.map(({ contactId }) => contactId),
  );
  const allowedSkills = new Set(targetParcours.bonusSkills.map(({ id }) => id));
  if (
    associations.contactsIds.some((id) => !allowedContacts.has(id)) ||
    associations.skillsIds.some((id) => !allowedSkills.has(id))
  ) {
    throw {
      message:
        "Les contacts et compétences doivent appartenir au parcours cible.",
      statusCode: 400,
    };
  }

  const existingTitles = await prisma.module.findMany({
    where: { parcours: { formationId: targetParcours.formationId } },
    select: { title: true },
  });
  const identity = getDuplicateIdentity(
    source,
    existingTitles.map(({ title }) => title),
  );

  const duplicatedCourses = await Promise.all(
    source.courses.map(async (course) => ({
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
                  url: await duplicateActivityFile(resource.url, "resource"),
                })),
              ),
            })),
          ),
        })),
      ),
    })),
  );

  const duplicated = await prisma.module.create({
    data: {
      title: identity.title,
      duplicationIndex: identity.duplicationIndex,
      description: source.description,
      quizInstructions: source.quizInstructions,
      image: source.image,
      thumb: source.thumb,
      duration: source.duration,
      rating: source.rating,
      minDate: source.minDate,
      maxDate: source.maxDate,
      author: source.author,
      adminId: admin.id,
      parcoursId: targetParcours.id,
      contacts: {
        create: associations.contactsIds.map((contactId) => ({
          contact: { connect: { id: contactId } },
        })),
      },
      bonusSkills: {
        create: associations.skillsIds.map((bonusSkillId) => ({
          bonusSkill: { connect: { id: bonusSkillId } },
        })),
      },
      courses: {
        create: duplicatedCourses.map((course) => ({
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
          // A copy has no independent RAG index. IA course features stay disabled
          // until an explicit future indexing workflow assigns a new slug.
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
        create: source.quizzes.map((quiz) => ({
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
    include: {
      contacts: { include: { contact: true } },
      bonusSkills: { include: { bonusSkill: true } },
    },
  });

  return {
    id: duplicated.id,
    title: duplicated.title,
    thumb: duplicated.thumb
      ? Buffer.from(duplicated.thumb as any).toString("base64")
      : null,
    description: duplicated.description,
    contacts: duplicated.contacts.map(({ contact }) => contact),
    skills: duplicated.bonusSkills.map(({ bonusSkill }) => bonusSkill),
  };
}
