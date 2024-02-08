import { prisma } from "../../utils/db";

export default async function putFormation(
  formationId: number,
  formation: any
) {
  const exisitingFormation = await prisma.formation.findFirst({
    where: { id: formationId },
  });

  if (!exisitingFormation) {
    const error: any = {
      message: "La formation n'existe pas.",
      statusCode: 404,
    };
  }

  const existingTitle = await prisma.formation.findFirst({
    where: { title: formation.title },
  });

  if (existingTitle) {
    const error: any = {
      message: "Une formation avec ce titre existe déjà.",
      statusCode: 409,
    };
    throw error;
  }

  let updatedFormation: any = {};

  await prisma.$transaction(async (tx) => {
    await tx.tagsOnFormation.deleteMany({
      where: { formationId },
    });
    updatedFormation = await tx.formation.update({
      where: { id: formationId },
      data: {
        title: formation.title,
        description: formation.description,
        code: formation.code,
        level: formation.level,
        tags: {
          create: formation.tags.map((item: number) => {
            return {
              tag: { connect: { id: item } },
            };
          }),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        level: true,
        parcours: { select: { id: true } },
        tags: { select: { tag: { select: { id: true } } } },
      },
    });
  });

  return {
    ...updatedFormation,
    parcours: updatedFormation.parcours.length,
    tags: updatedFormation.tags.map((item: any) => item.tag.id),
  };
}
