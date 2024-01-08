import { prisma } from "../../utils/db";

async function postBonusSkill(parcoursId: number, newSkill: any) {
  try {
    const existingParcours = await prisma.parcours.findUnique({
      where: { id: parcoursId },
    });
    if (!existingParcours) {
      throw new Error(`Le parcours n'existe pas`);
    }
    const existingSkill = await prisma.skill.findUnique({
      where: { description: newSkill.description },
    });

    if (!existingSkill) {
      const response = await prisma.bonusSkill.create({
        data: { ...newSkill, parcours: { connect: { id: parcoursId } } },
      });
      return response;
    } else {
      throw new Error("La compétence existe déjà");
    }
  } catch (error: any) {
    return error;
  }
}

export default postBonusSkill;
