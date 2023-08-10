import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function postManySkills(parcoursId: number, newSkills: Array<any>) {
  try {
    const existingParcours = await prisma.parcours.findUnique({
      where: { id: parcoursId },
    });
    if (!existingParcours) {
      throw new Error(`Le parcours n'existe pas`);
    }
    const response = await prisma.bonusSkill.createMany({
      data: newSkills.map((skill: any) => {
        return {
          ...skill,
          parcoursId,
        };
      }),
    });

    const result = await prisma.bonusSkill.findMany({
      where: { parcoursId },
    });
    return result;
  } catch (error: any) {
    throw new Error("Les compétences n'ont pas été enregistrées");
  }
}

export default postManySkills;
