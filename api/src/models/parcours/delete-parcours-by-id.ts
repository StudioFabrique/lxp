import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";
import deleteActivity from "../activity/delete-activity/delete-activity";

async function deleteParcoursById(parcoursId: number, userId: string) {
  const admin = await getAdmin(userId);
  const parcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
    include: {
      admin: { select: { idMdb: true } },
      modules: {
        include: {
          courses: {
            include: {
              lessons: { include: { activities: true } },
            },
          },
        },
      },
    },
  });

  if (!parcours) {
    throw {
      message: `Le parcours identifié par l'id : ${parcoursId} n'existe pas`,
      statusCode: 404,
    };
  }

  if (parcours.admin.idMdb !== userId) {
    throw {
      statusCode: 406,
      message: "Vous n'êtes pas autorisé à supprimer ce parcours.",
    };
  }

  for (const activity of parcours.modules.flatMap((module) =>
    module.courses.flatMap((course) =>
      course.lessons.flatMap((lesson) => lesson.activities),
    ),
  )) {
    await deleteActivity(activity.id, activity.type, "lesson");
  }

  await prisma.$transaction(async (tx) => {
    await tx.tagsOnParcours.deleteMany({ where: { parcoursId } });
    await tx.contactsOnParcours.deleteMany({ where: { parcoursId } });
    await tx.bonusSkill.deleteMany({ where: { parcoursId } });
    await tx.objective.deleteMany({ where: { parcoursId } });
    await tx.groupsOnParcours.deleteMany({ where: { parcoursId } });
    await tx.parcours.delete({
      where: { id: parcoursId, adminId: admin.id },
    });
  });

  return parcours.title;
}

export default deleteParcoursById;
