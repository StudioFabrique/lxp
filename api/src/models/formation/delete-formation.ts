import { prisma } from "../../utils/db";

export default async function deleteFormation(formationId: number) {
  return prisma.$transaction(async (transaction) => {
    const formation = await transaction.formation.findUnique({
      where: { id: formationId },
      select: {
        id: true,
        title: true,
        _count: { select: { parcours: true } },
      },
    });

    if (!formation) {
      throw {
        statusCode: 404,
        message: "La formation n'existe pas.",
      };
    }

    if (formation._count.parcours > 0) {
      throw {
        statusCode: 409,
        message:
          "Cette formation ne peut pas être supprimée car des parcours y sont associés.",
      };
    }

    await transaction.modulesOnFormation.deleteMany({
      where: { formationId },
    });
    await transaction.tagsOnFormation.deleteMany({
      where: { formationId },
    });
    await transaction.formation.delete({ where: { id: formationId } });
    return formation.title;
  });
}
