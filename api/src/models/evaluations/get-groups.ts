import { prisma } from "../../utils/db";
import Group from "../../utils/interfaces/db/group";

export default async function getGroups(parcoursId: number, userId: string) {
  const existingParcours = await prisma.parcours.findFirst({
    where: {
      id: parcoursId,
    },
    select: {
      contacts: {
        select: {
          contact: {
            select: { idMdb: true },
          },
        },
      },
      groups: {
        select: {
          group: {
            select: { idMdb: true },
          },
        },
      },
    },
  });

  if (!existingParcours)
    throw { message: "Le parcours n'existe pas.", statusCode: 404 };

  const teachers = existingParcours.contacts.map((item) => item.contact);
  const existingTeacher = teachers.find((item) => item.idMdb === userId);

  if (!existingTeacher)
    throw {
      message:
        "L'utilisateur n'est pas dans la liste des contacts de ce parcours.",
      statusCode: 404,
    };

  const groupsIds = existingParcours.groups.map((item) => item.group);
  const existingGroups = await Group.find({
    $in: groupsIds,
  }).populate("user", { fistname: 1, lastname: 1, email: 1 });

  if (existingGroups.length === 0)
    throw { message: "Aucun groupe trouvé pour ce parcours.", statusCode: 400 };

  return existingGroups;
}
