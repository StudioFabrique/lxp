import { log } from "console";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function postModuleFromScratch(
  userId: string,
  title: string,
  description: string,
  formationId: number,
  parcoursId: number | null = null,
  contactsIds: number[] = [],
  bonusSkillsIds: number[] = [],
  duration: number,
  image: any,
  thumb: any
) {
  console.log({ contactsIds });

  const existingFormation = await prisma.formation.findFirst({
    where: { id: formationId },
  });
  if (!existingFormation)
    throw { statusCode: 404, message: "La formation n'existe pas." };

  let existingParcours: any;

  if (parcoursId) {
    existingParcours = await prisma.parcours.findFirst({
      where: { id: parcoursId },
    });
    if (!existingParcours)
      throw { statusCode: 404, message: "Le parcours n'existe pas." };
  }

  const existingUser = await User.findOne(
    { _id: userId },
    { firstname: 1, lastname: 1 }
  );

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  await prisma.$transaction(async (tx) => {
    const module = await tx.module.create({
      data: {
        title,
        description,

        duration,
        image,
        thumb,
        author: existingUser.firstname + " " + existingUser.lastname,
        adminId: existingAdmin.id,
      },
    });
    await tx.formation.update({
      where: { id: formationId },
      data: {
        modules: {
          create: {
            module: {
              connect: {
                id: module.id,
              },
            },
          },
        },
      },
    });

    if (parcoursId) {
      const newModule = await tx.module.create({
        data: {
          title,
          description,
          duration,
          image,
          thumb,
          author: existingUser.firstname + " " + existingUser.lastname,
          adminId: existingAdmin.id,

          contacts: {
            create: contactsIds.map((id) => ({ contact: { connect: { id } } })),
          },
          bonusSkills: {
            create: bonusSkillsIds.map((id) => ({
              bonusSkill: { connect: { id } },
            })),
          },
          minDate: new Date(existingParcours!.startDate!),
          maxDate: new Date(existingParcours!.endDate!),
        },
      });
      await tx.parcours.update({
        where: { id: parcoursId },
        data: {
          modules: {
            create: {
              module: {
                connect: {
                  id: newModule.id,
                },
              },
            },
          },
        },
      });
    }
  });
  return true;
}
