import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";
import { assertCanManageTags, type TagActor } from "./tag-access.ts";

export default async function putTag(
  id: number,
  name: string,
  actor: TagActor,
) {
  const tag = await prisma.orm.public.Tag.where({ id })
    .select("createdBy")
    .first();

  if (!tag) {
    throw { statusCode: 404, message: "Le tag n'existe pas." };
  }

  assertCanManageTags(
    [tag],
    actor,
    "Vous ne pouvez modifier que les tags que vous avez créés.",
  );

  const updatedTag = await prisma.orm.public.Tag.where({
    id,
  })
    .update({ name })
    .then(requireDatabaseRow);
  return updatedTag;
}
