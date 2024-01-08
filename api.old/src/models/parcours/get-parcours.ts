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
      if (parcours.thumb instanceof Buffer) {
        const base64thumb = parcours.thumb.toString("base64");
        const result = { ...parcours, thumb: base64thumb };
        return result;
      }
      return parcours;
    });
    return response;
  }
}

export default getParcours;
