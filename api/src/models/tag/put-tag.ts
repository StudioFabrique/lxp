import { prisma } from "../../utils/db.ts";
import {
  assertCanManageTags,
  type TagActor,
} from "./tag-access.ts";

export default async function putTag(
  id: number,
  name: string,
  actor: TagActor,
) {
  const tag = await prisma.tag.findUnique({
    where: { id },
    select: { createdBy: true },
  });

  if (!tag) {
    throw { statusCode: 404, message: "Le tag n'existe pas." };
  }

  assertCanManageTags(
    [tag],
    actor,
    "Vous ne pouvez modifier que les tags que vous avez créés.",
  );

  const updatedTag = await prisma.tag.update({
    where: {
      id,
    },
    data: {
      // Ne jamais réattribuer le tag : un administrateur peut le corriger sans
      // retirer son ownership à l'équipe pédagogique qui l'a créé.
      name,
    },
  });
  return updatedTag;
}
