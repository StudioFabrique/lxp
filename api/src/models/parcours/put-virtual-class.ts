import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function putVirtualClass(
  parcoursId: string,
  virtualClass: string,
  userId: string
) {
  const admin = getAdmin(userId);
  const id = parseInt(parcoursId);

  const response = await prisma.parcours.update({
    where: { id, adminId: (await admin).id },
    data: { virtualClass },
  });
  return response;
}

export default putVirtualClass;
