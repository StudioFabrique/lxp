import { prisma } from "../../utils/db";
import Group from "../../utils/interfaces/db/group";

async function getParcoursByStudent(studentId: string) {
  const groupsWhereStudentIs = await Group.find({ users: studentId });

  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  const parcoursList = await prisma.parcours.findMany({
    where: { groups: { some: { group: { idMdb: { in: groupIds } } } } },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      formation: { select: { title: true, level: true } },
      admin: { select: { idMdb: true } },
      author: true,
      isPublished: true,
      visibility: true,
      thumb: true,
    },
  });

  if (!parcoursList) {
    throw new Error(`Data not found.`);
  }
  if (parcoursList) {
    const response = parcoursList.map((parcours) => {
      if (parcours.thumb instanceof Buffer) {
        const base64thumb = parcours.thumb.toString("base64");
        const result = { ...parcours, thumb: base64thumb };
        return result;
      }
      return parcours;
    });
    return response;
  }
}

export default getParcoursByStudent;
