import { Skill } from "@prisma/client";

import { prisma } from "../../utils/db";

async function putParcoursSkills(parcoursId: number, newSkills: Array<any>) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
  });
  if (!existingParcours) {
    throw new Error(`Le parcours n'existe pas`);
  }
  const existingSkills = await prisma.skill.findMany();
  const skillsToCreate = Array<Skill>();

  for (const newSkill of newSkills) {
    const skill = existingSkills.find(
      (item) => item.description === newSkill.description
    );
    if (!skill) {
      skillsToCreate.push(newSkill);
    }
  }
  if (skillsToCreate.length > 0) {
    /*  const updatedSkills = skillsToCreate.map((item: any) => {
      if (item.badge) {
        const badge = Buffer.from(item.badge, "base64");
        return { ...item, badge };
      } else {
        return item;
      }
    }); */

    await prisma.skill.createMany({
      data: skillsToCreate,
    });
  }

  await prisma.skillsOnParcours.deleteMany({
    where: { parcoursId },
  });

  const skillsToAdd = await prisma.skill.findMany({
    where: {
      description: {
        in: newSkills.map((item) => item.description),
      },
    },
  });

  const updatedParcours = await prisma.parcours.update({
    where: { id: parcoursId },
    data: {
      skills: {
        create: skillsToAdd.map((item) => {
          return {
            skill: {
              connect: { id: item.id },
            },
          };
        }),
      },
    },
    include: { skills: { include: { skill: true } } },
  });

  const response = updatedParcours.skills.map((item: any) => {
    if (item.skill.badge) {
      const base64Image = item.skill.badge.toString("base64");
      return { ...item, badge: base64Image };
    } else {
      return item;
    }
  });

  return response;
}

export default putParcoursSkills;
