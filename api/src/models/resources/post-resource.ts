import { mongo } from "mongoose";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

const getSoftColor = () => {
  // Plage entre 40 et 180 pour chaque composante
  const min = 40,
    max = 180;
  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);
  return `rgb(${r}, ${g}, ${b})`;
};

export default async function postResource(
  userId: string,
  title: string,
  description: string,
  tags: string[]
) {
  const existingResource = await prisma.resource.findFirst({
    where: { title },
  });

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  const mongoUser = await User.findById(userId);

  if (!mongoUser) throw { message: "Utilisateur non trouvé", status: 404 };

  if (existingResource)
    throw { message: "Une ressource portant ce nom existe déjà", status: 406 };

  const existingTagIds = await prisma.tag.findMany({
    where: { name: { in: tags, mode: "insensitive" } },
  });

  let remainingTags = tags.filter(
    (tag) =>
      !existingTagIds.some(
        (existingTag) => existingTag.name.toLowerCase() === tag.toLowerCase()
      )
  );

  const newTags = remainingTags.map((tag) => ({
    name: tag,
    color: getSoftColor(),
  }));

  await prisma.tag.createMany({
    data: newTags,
  });

  const newlyCreatedTags = await prisma.tag.findMany({
    where: { name: { in: remainingTags } },
  });

  const tagsToAdd = [...existingTagIds, ...newlyCreatedTags];

  await prisma.resource.create({
    data: {
      title,
      description,
      admin: { connect: { id: existingAuthor.id } },
      author: mongoUser.firstname + " " + mongoUser.lastname,
      tags: {
        create: tagsToAdd.map((tag) => {
          return { tag: { connect: { id: tag.id } } };
        }),
      },
    },
  });
  return { message: "Ressource créée avec succès", success: true };
}
