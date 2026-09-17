import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function getParcours(userId: string) {
  const contactWithParcours = await prisma.orm.public.Contact.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  )
    .include("parcours", (related62) =>
      related62.include("parcours", (related63) =>
        related63.select("id", "title"),
      ),
    )
    .first();

  if (!contactWithParcours || contactWithParcours.parcours.length === 0)
    throw {
      message: "L'utilisateur n'est associé à aucun parcours.",
      statusCode: 404,
    };

  let result: { id: number; title: string }[] = [];

  result = contactWithParcours.parcours.flatMap(({ parcours }) =>
    parcours ? [parcours] : [],
  );
  return result;
}
