import { prisma } from "../../utils/db";

async function putModuleParcours(module: any, thumb: string, image: any) {
  const newModule = JSON.parse(module);

  const data = [
    {
      title: newModule.title,
      description: newModule.description,
      duration: newModule.duration,
      image,
      thumb,
    },
  ];
  console.log(newModule);
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: +newModule.parcoursId },
  });

  console.log({ newModule });

  if (!existingParcours) {
    const newError = { message: "Le parcours n'existe pas", statusCode: 404 };
    throw newError;
  }

  const addModule = await prisma.module.create({
    data: {
      title: newModule.title,
      description: newModule.description,
      duration: +newModule.duration,
      image,
      thumb,
      formations: {
        create: newModule.formations.map((item: any) => {
          return {
            formation: {
              connect: { id: item },
            },
          };
        }),
      },
      /*       parcours: {
        create: {
          parcours: {
            connect: { id: +newModule.parcoursId },
          },
        },
      },
      contacts: {
        create: newModule.contacts.map((contact: any) => {
          return {
            contact: {
              connect: { id: contact.id },
            },
          };
        }),
      },
      bonusSkills: {
        create: newModule.bonusSkills.map((item: any) => {
          return {
            bonusSkill: {
              connect: { id: item.id },
            },
          };
        }),
      }, */
    },
  });

  return addModule;
}

export default putModuleParcours;
