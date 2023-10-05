import { prisma } from "../../utils/db";

async function createParcours(parcours: any, userId: string) {
  const admin = await prisma.admin.findFirst({
    where: { idMdb: userId },
    select: { id: true },
  });

  if (!admin) {
    const error = new Error("L'utilsiateur n'existe pas");
    (error as any).statusCode = 403;
    throw error;
  }

  const newParcours = { ...parcours, admin };

  const existtingParcours = await prisma.parcours.findFirst({
    where: { title: newParcours.title },
  });

  if (existtingParcours) {
    const error = new Error("Un parcours avec ce titre existe déjà");
    (error as any).statusCode = 404;
    throw error;
  }

  const storedParcours = await prisma.parcours.create({
    data: {
      ...newParcours,
      admin: {
        connect: { id: newParcours.admin.id },
      },
      formation: {
        connect: { id: +newParcours.formation },
      },
    },
  });

  return storedParcours;
}

export default createParcours;
