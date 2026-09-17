import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { prisma } from "../../utils/db.ts";

async function putVirtualClass(
  parcoursId: string,
  virtualClass: string,
  userId: string,
) {
  const admin = await getAdmin(userId);
  const id = parseInt(parcoursId);

  const response = await prisma.orm.public.Parcours.where({
    id,
    adminId: admin.id,
  })
    .update({ virtualClass })
    .then(requireDatabaseRow);
  return response;
}

export default putVirtualClass;
