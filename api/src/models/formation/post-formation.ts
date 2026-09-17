import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function postFormation(
  userId: string,
  title: string,
  description: string,
  code: string,
  level: string,
  tags: number[],
) {
  const existingFormation = await prisma.orm.public.Formation.where((row) =>
    whereFromObject(row, { title: { equals: title, mode: "insensitive" } }),
  ).first();

  if (existingFormation) {
    const error: any = {
      message: "Une formation avec ce nom existe déjà.",
      statusCode: 409,
    };
    throw error;
  }

  const existingAdmin = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  ).first();

  if (!existingAdmin) {
    const error: any = {
      message: "L'utilisateur n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const formation = await prisma.orm.public.Formation.select(
    "id",
    "title",
    "description",
    "code",
    "level",
    "createdAt",
  )
    .include("parcours", (related67) => related67.select("id"))
    .include("tags", (related68) =>
      related68.include("tag", (related69) => related69.select("id")),
    )
    .create({
      title,
      description,
      code,
      level,
      admin: (relation) => relation.connect({ id: existingAdmin.id }),
      tags: (relation) =>
        relation.create(tags.map((tagId) => ({ tagId }))),
    });

  return {
    ...formation,
    parcours: formation.parcours.length,
    tags: formation.tags.map((item) => item.tag!.id),
  };
}
