import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { prisma } from "../../utils/db.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";

async function deleteParcoursById(parcoursId: number, userId: string) {
  const admin = await getAdmin(userId);
  const parcours = await prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { id: parcoursId }),
  )
    .include("admin", (related210) => related210.select("idMdb"))
    .include("modules", (related211) =>
      related211.include("courses", (related212) =>
        related212.include("lessons", (related213) =>
          related213.include("activities"),
        ),
      ),
    )
    .first();

  if (!parcours) {
    throw {
      message: `Le parcours identifié par l'id : ${parcoursId} n'existe pas`,
      statusCode: 404,
    };
  }

  if (parcours.admin!.idMdb !== userId) {
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

  await prisma.transaction(async (tx) => {
    await tx.orm.public.TagsOnParcours.where((row) =>
      whereFromObject(row, { parcoursId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await tx.orm.public.ContactsOnParcours.where((row) =>
      whereFromObject(row, { parcoursId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await tx.orm.public.BonusSkill.where((row) =>
      whereFromObject(row, { parcoursId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await tx.orm.public.Objective.where((row) =>
      whereFromObject(row, { parcoursId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await tx.orm.public.GroupsOnParcours.where((row) =>
      whereFromObject(row, { parcoursId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await tx.orm.public.SkillsOnParcours.where((row) =>
      whereFromObject(row, { parcoursId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await tx.orm.public.Parcours.where((row) =>
      whereFromObject(row, { id: parcoursId, adminId: admin.id }),
    )
      .delete()
      .then(requireDatabaseRow);
  });

  return parcours.title;
}

export default deleteParcoursById;
