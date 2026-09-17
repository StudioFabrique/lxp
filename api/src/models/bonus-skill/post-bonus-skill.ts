import { prisma } from "../../utils/db.ts";

async function postBonusSkill(parcoursId: number, newSkill: any) {
  try {
    const existingParcours = await prisma.orm.public.Parcours.where({
      id: parcoursId,
    }).first();
    if (!existingParcours) {
      throw new Error(`Le parcours n'existe pas`);
    }
    const existingSkill = await prisma.orm.public.Skill.where({
      description: newSkill.description,
    }).first();

    if (!existingSkill) {
      const response = await prisma.orm.public.BonusSkill.create({
        ...newSkill,
        parcours: (relation) => relation.connect({ id: parcoursId }),
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
