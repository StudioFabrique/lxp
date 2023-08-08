import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function putParcoursSkill(parcoursId: number, newSkill: any) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
  });
  if (!existingParcours) {
    throw new Error(`Le parcours n'existe pas`);
  }
  const existingSkill = prisma.skill.findUnique({
    where: { description: newSkill.description },
  });

  let skillToAdd: any;

  if (!existingParcours) {
    skillToAdd = await prisma.skill.create({
      data: newSkill,
    });
  } else {
    skillToAdd = existingSkill;
  }

  const updatedParcours = await prisma.parcours.update({
    where: { id: parcoursId },
    data: {
      skills: {
        create: { skill: { connect: { id: skillToAdd.id } } },
      },
    },
  });
}
