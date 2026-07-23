import { prisma } from "../../utils/db";

async function putModule(module: any, image?: Buffer, thumb?: Buffer) {
  const existingModule = await prisma.module.findUnique({
    where: { id: module.id },
    include: {
      parcours: {
        include: {
          contacts: { select: { contactId: true } },
          bonusSkills: { select: { id: true } },
        },
      },
    },
  });
  if (!existingModule) {
    throw { message: "Le module n'existe pas.", statusCode: 404 };
  }
  const contactIds = [...new Set<number>(module.contactsIds ?? [])];
  const bonusSkillIds = [...new Set<number>(module.bonusSkillsIds ?? [])];
  const allowedContactIds = new Set(
    existingModule.parcours.contacts.map(({ contactId }) => contactId),
  );
  const allowedSkillIds = new Set(
    existingModule.parcours.bonusSkills.map(({ id }) => id),
  );
  if (
    contactIds.some((id) => !allowedContactIds.has(id)) ||
    bonusSkillIds.some((id) => !allowedSkillIds.has(id))
  ) {
    throw {
      message:
        "Les contacts et compétences doivent appartenir au parcours du module.",
      statusCode: 400,
    };
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.contactsOnModule.deleteMany({ where: { moduleId: module.id } });
    await tx.bonusSkillsOnModule.deleteMany({
      where: { moduleId: module.id },
    });

    return tx.module.update({
      where: { id: module.id },
      data: {
        title: module.title,
        description: module.description ?? "",
        quizInstructions: module.quizInstructions ?? "",
        duration: +module.duration,
        ...(image
          ? {
              image: Uint8Array.from(image) as Uint8Array<ArrayBuffer>,
              thumb: thumb
                ? (Uint8Array.from(thumb) as Uint8Array<ArrayBuffer>)
                : undefined,
            }
          : {}),
        contacts: {
          create: contactIds.map((id: number) => ({
            contact: { connect: { id } },
          })),
        },
        bonusSkills: {
          create: bonusSkillIds.map((id: number) => ({
            bonusSkill: { connect: { id } },
          })),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        quizInstructions: true,
        duration: true,
        minDate: true,
        maxDate: true,
        thumb: true,
        contacts: {
          select: { contact: { select: { id: true, name: true, role: true } } },
        },
        bonusSkills: {
          select: {
            bonusSkill: { select: { id: true, description: true } },
          },
        },
      },
    });
  });

  return {
    ...updated,
    duration: updated.duration ?? 1,
    thumb: updated.thumb
      ? Buffer.from(updated.thumb as any).toString("base64")
      : null,
    contacts: updated.contacts.map(({ contact }) => contact),
    bonusSkills: updated.bonusSkills.map(({ bonusSkill }) => bonusSkill),
  };
}

export default putModule;
