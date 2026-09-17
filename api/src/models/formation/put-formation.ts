import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

export default async function putFormation(
  formationId: number,
  formation: any,
) {
  const exisitingFormation = await prisma.orm.public.Formation.where({
    id: formationId,
  }).first();

  if (!exisitingFormation) {
    const error: any = {
      message: "La formation n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const existingTitle = await prisma.orm.public.Formation.where({
    title: formation.title,
  }).first();

  if (existingTitle && existingTitle.id !== formationId) {
    const error: any = {
      message: "Une formation avec ce titre existe déjà.",
      statusCode: 409,
    };
    throw error;
  }

  let updatedFormation: any = {};

  await prisma.transaction(async (tx) => {
    await tx.orm.public.TagsOnFormation.where({ formationId })
      .deleteAndCount()
      .then((count) => ({ count }));
    if (formation.tags.length > 0) {
      await tx.orm.public.TagsOnFormation.createAndCount(
        [...new Set(formation.tags as number[])].map((tagId) => ({
          formationId,
          tagId,
        })),
      );
    }
    updatedFormation = await tx.orm.public.Formation.where({ id: formationId })
      .select("id", "title", "description", "code", "level", "createdAt")
      .include("parcours", (related74) => related74.select("id"))
      .include("tags", (related75) =>
        related75.include("tag", (related76) => related76.select("id")),
      )
      .update({
        title: formation.title,
        description: formation.description,
        code: formation.code,
        level: formation.level,
        updatedAt: new Date().toISOString(),
      })
      .then(requireDatabaseRow);
  });

  return {
    ...updatedFormation,
    parcours: updatedFormation.parcours.length,
    tags: updatedFormation.tags.map((item: any) => item.tag.id),
  };
}
