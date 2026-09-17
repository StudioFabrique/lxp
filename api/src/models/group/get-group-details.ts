import Group from "../../utils/interfaces/db/group.ts";
import { prisma } from "../../utils/db.ts";

export default async function getGroupDetails(groupId: string) {
  const group = await Group.findOne({
    _id: groupId,
  })
    .populate("users")
    .lean();

  const groupPrisma = await prisma.orm.public.Group.where({ idMdb: groupId })
    .include("parcours", (related80) =>
      related80
        .select("parcoursId")
        .include("parcours", (related81) =>
          related81
            .select("formationId", "title")
            .include("formation", (related82) =>
              related82.select("id", "title"),
            ),
        ),
    )
    .first();

  if (!(group && groupPrisma)) return;

  return {
    ...group,
    // formation:
    //   groupPrisma?.parcours && groupPrisma?.parcours.length > 0
    //     ? `${groupPrisma?.parcours[0].parcours.formation.title} - ${groupPrisma?.parcours[0].parcours.title}`
    //     : undefined,
    formationId: groupPrisma?.parcours[0]
      ? groupPrisma.parcours[0]!.parcours!.formationId
      : null,
    parcoursId: groupPrisma?.parcours[0]
      ? groupPrisma?.parcours[0].parcoursId
      : null,
  };
}
