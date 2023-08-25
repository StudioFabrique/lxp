import { prisma } from "../../utils/db";

async function createParcours(parcours: any /* userId: string */) {
  //  DEV ONLY
  const admin = 1;
  const newParcours = { ...parcours, admin };

  try {
    const storedParcours = await prisma.parcours.create({
      data: {
        ...newParcours,
        admin: {
          connect: { id: newParcours.admin },
        },
        formation: {
          connect: { id: newParcours.formation },
        },
      },
    });
    return storedParcours;
  } catch (error) {
    throw new Error("Un parcours avec ce titre existe déjà");
  }
}

export default createParcours;
