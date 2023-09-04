import { prisma } from "../../utils/db";

async function createParcours(parcours: any, userId: string) {
  try {
    const admin = await prisma.admin.findFirst({
      where: { idMdb: userId },
      select: { id: true },
    });
    console.log({ admin });

    if (!admin) {
      throw { message: "L'utilisateur n'existe pas", status: 403 };
    }

    const newParcours = { ...parcours, admin };

    const existtingParcours = await prisma.parcours.findFirst({
      where: { title: newParcours.title },
    });

    if (existtingParcours) {
      throw { message: "Un parcours avec ce titre existe déjà", status: 424 };
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
    console.log({ storedParcours });

    return storedParcours;
  } catch (error: any) {
    throw error;
  }
}

export default createParcours;
