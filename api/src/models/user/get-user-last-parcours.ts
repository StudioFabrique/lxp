import { prisma } from "../../utils/db";

export default async function getUserLastParcours(userId: string) {
  const contact = await prisma.contact.findFirst({
    where: { idMdb: userId },
  });

  console.log({ userId, contact });

  if (!contact) {
    const error: any = {
      message: "L'utilisateur n'existe pas dans la liste des contacts.",
      statusCode: 404,
    };
    throw error;
  }

  const userParcoursId = await prisma.contactsOnParcours.findMany({
    where: { contactId: contact.id },
    select: { parcoursId: true },
  });

  const userParcours = await prisma.parcours.findMany({
    where: {
      id: {
        in: userParcoursId.map((item) => item.parcoursId),
      },
    },
    take: 2,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      thumb: true,
    },
  });

  const result = userParcours.map((item) => ({
    ...item,
    thumb: item.thumb?.toString("base64" ?? null),
  }));

  return userParcours;
}
