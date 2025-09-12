import { prisma } from "../../utils/db";

export default async function getResourceDetails(resourceId: number) {
  const existingResource = await prisma.resource.findFirst({
    where: { id: resourceId },
    include: {
      bonusActivities: true,
      tags: {
        select: { tag: { select: { id: true, name: true, color: true } } },
      },
    },
  });

  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  const { bonusActivities, ...rest } = existingResource;
  return {
    ...rest,
    activities: bonusActivities,
    tags: existingResource.tags.map((t) => t.tag),
  };
}
