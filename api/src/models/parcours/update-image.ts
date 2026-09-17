import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { prisma } from "../../utils/db.ts";

async function updateImage(parcoursId: number, image: any, thumb: any) {
  const result = await prisma.orm.public.Parcours.where({
    id: parcoursId,
  })
    .update({ image, thumb })
    .then(requireDatabaseRow);
  if (!result) {
    const error = new Error("Le parcours n'existe pas");
    (error as any).status = 404;
    throw error;
  }

  return result;
}

export default updateImage;
