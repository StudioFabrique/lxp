import { prisma } from "../../utils/db.ts";

export default async function getParcours(userId: string) {
  const contactWithParcours = await prisma.contact.findFirst({
    where: { idMdb: userId },
    select: {
      parcours: {
        select: { parcours: { select: { id: true, title: true } } },
      },
    },
  });

  if (!contactWithParcours || contactWithParcours.parcours.length === 0)
    throw {
      message: "L'utilisateur n'est associé à aucun parcours.",
      statusCode: 404,
    };

  let result: { id: number; title: string }[] = [];

  result = contactWithParcours.parcours.map(
    (item: { parcours: { id: number; title: string } }) => item.parcours,
  );
  return result;
}
