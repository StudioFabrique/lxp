import Group from "../../utils/interfaces/db/group.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import Role from "../../utils/interfaces/db/role.ts";

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
            .include("contacts", (links) =>
              links.include("contact", (contact) => contact.select("idMdb")),
            )
            .include("formation", (related82) =>
              related82.select("id", "title"),
            ),
        ),
    )
    .first();

  if (!(group && groupPrisma)) return;

  const creatorId = group.createdBy?.toString();
  const linkedTeacherIds = new Set<string>(creatorId ? [creatorId] : []);
  for (const link of groupPrisma.parcours) {
    for (const { contact } of link.parcours?.contacts ?? []) {
      if (contact?.idMdb) linkedTeacherIds.add(contact.idMdb);
    }
  }
  const teacherRoles = await Role.find({ rank: 2 }, { _id: 1 }).lean();
  const teachers = await User.find({
    _id: { $in: [...linkedTeacherIds] },
    roles: { $in: teacherRoles.map(({ _id }) => _id) },
  }, { firstname: 1, lastname: 1, email: 1, isActive: 1 })
    .sort({ lastname: 1, firstname: 1 })
    .lean();

  return {
    ...group,
    teachers: teachers.map((teacher) => ({
      ...teacher,
      isCreator: teacher._id.toString() === creatorId,
      parcours: groupPrisma.parcours
        .filter((link) => link.parcours?.contacts.some(
          ({ contact }) => contact?.idMdb === teacher._id.toString(),
        ))
        .map((link) => ({ id: link.parcoursId, title: link.parcours!.title })),
    })),
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
