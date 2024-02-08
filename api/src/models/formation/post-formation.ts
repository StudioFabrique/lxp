import { Tag } from "@prisma/client";
import { prisma } from "../../utils/db";

export default async function postFormation(
  userId: string,
  title: string,
  description: string,
  code: string,
  level: string,
  tags: number[]
) {
  const existingFormation = await prisma.formation.findFirst({
    where: { title },
  });

  if (existingFormation) {
    const error: any = {
      message: "Une formation avec ce nom existe déjà.",
      statusCode: 409,
    };
    throw error;
  }

  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin) {
    const error: any = {
      message: "L'utilisateur n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const formation = await prisma.formation.create({
    data: {
      title,
      description,
      code,
      level,
      admin: {
        connect: { id: existingAdmin.id },
      },
      tags: {
        create: tags.map((item: number) => {
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
      parcours: {
        select: {
          id: true,
        },
      },
      tags: { select: { tag: { select: { id: true } } } },
    },
  });

  return {
    ...formation,
    parcours: formation.parcours.length,
    tags: formation.tags.map((item) => item.tag.id),
  };
}
