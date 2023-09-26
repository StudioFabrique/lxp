import { Group } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putParcoursGroups(parcoursId: number, groupsIds: string[]) {
  const groups = await prisma.group.findMany({
    where: {
      idMdb: {
        in: groupsIds.map((item: string) => item),
      },
    },
  });

  console.log({ parcoursId });

  const existingParcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
  });

  if (!existingParcours) {
    const error = { message: "Le parcours n'existe pas", statusCode: 404 };
    throw error;
  }

  let updatedParcours: any = {};

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.groupsOnParcours.deleteMany({
      where: {
        parcoursId,
      },
    });
    updatedParcours = await tx.parcours.update({
      where: { id: parcoursId },
      data: {
        groups: {
          create: groups.map((group: Group) => {
            return {
              group: {
                connect: {
                  id: group.id,
                },
              },
            };
          }),
        },
      },
      select: {
        groups: {
          select: {
            group: {
              select: {
                id: true,
                idMdb: true,
              },
            },
          },
        },
      },
    });
  });

  return updatedParcours;
}

export default putParcoursGroups;
