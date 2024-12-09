import { prisma } from "../../../utils/db";
import CustomRequest from "../../../utils/interfaces/express/custom-request";

export default async function putReorderResource(req: CustomRequest) {
  const data = req.body;
  const { activityId } = req.params;
  const userId = req.auth?.userId;

  const existingActivity = await prisma.activity.findFirst({
    where: { id: +activityId },
    select: {
      id: true,
      authorId: true,
      resourceActivities: true,
    },
  });

  if (!existingActivity)
    throw { statusCode: 404, message: "L'activité n'existe pas." };

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  if (existingActivity.authorId !== existingAuthor.id)
    throw {
      statusCode: 406,
      message: "Vous n'êtes pas le propriétaire de la ressource.",
    };

  const transaction = await prisma.$transaction(async (tx) => {
    for (const [index, resourceId] of data.entries()) {
      await tx.resourceActivity.update({
        where: { id: resourceId },
        data: { order: index },
      });
    }
  });

  return transaction;
}
