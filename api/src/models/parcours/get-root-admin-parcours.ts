import { prisma } from "../../utils/db.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";

export default async function getRootAdminParcours() {
  const formations = await prisma.formation.findMany({
    select: {
      id: true,
      title: true,
      level: true,
      parcours: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          isPublished: true,
          thumb: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return formations.map((formation) => ({
    ...formation,
    parcours: formation.parcours.map((parcours) => ({
      ...parcours,
      thumb: imageToDataUrl(parcours.thumb),
    })),
  }));
}
