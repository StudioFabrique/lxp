import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

async function postManySkills(parcoursId: number, newSkills: Array<any>) {
  try {
    const existingParcours = await prisma.orm.public.Parcours.where((row) =>
      whereFromObject(row, { id: parcoursId }),
    ).first();
    if (!existingParcours) {
      throw new Error(`Le parcours n'existe pas`);
    }

    const existingSkills = await prisma.orm.public.BonusSkill.where((row) =>
      whereFromObject(row, { parcoursId }),
    ).all();

    const skills = Array<any>();

    for (const skill of newSkills) {
      const tmp = existingSkills.find(
        (item: any) => item.description === skill.description,
      );
      if (!tmp) {
        skills.push(skill);
      }
    }

    const response = await prisma.orm.public.BonusSkill.createAndCount(
      skills.map((skill: any) => {
        return {
          ...skill,
          parcoursId,
        };
      }),
    ).then((count) => ({ count }));

    const result = await prisma.orm.public.BonusSkill.where((row) =>
      whereFromObject(row, { parcoursId }),
    )
      .select("id", "description", "badge")
      .all();
    return result;
  } catch (error: any) {
    throw new Error("Les compétences n'ont pas été enregistrées");
  }
}

export default postManySkills;
