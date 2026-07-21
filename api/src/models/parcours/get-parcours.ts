import { prisma } from "../../utils/db";

async function getParcours() {
  const parcoursList = await prisma.parcours.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      formation: { select: { title: true, level: true } },
      admin: { select: { idMdb: true } },
      author: true,
      isPublished: true,
      visibility: true,
      thumb: true,
    },
  });

  if (!parcoursList) {
    throw new Error(`Data not found.`);
  }
  if (parcoursList) {
    const response = parcoursList.map((parcours) => {
      if (parcours.thumb && typeof parcours.thumb !== "string") {
        const base64thumb = Buffer.from(parcours.thumb as any).toString("base64");
        return { ...parcours, thumb: base64thumb };
      }
      return parcours;
    });
    return response;
  }
}

export default getParcours;
