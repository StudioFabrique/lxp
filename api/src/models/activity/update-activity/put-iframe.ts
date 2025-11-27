import { prisma } from "../../../utils/db";

export default async function putIframe(
  activityId: number,
  userId: string,
  title: string,
  description: string,
  url: string
) {
  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  const updatedActivity = await prisma.activity.update({
    where: { id: activityId },
    data: {
      title,
      type: "iframe",
      url,
      author: {
        connect: {
          id: existingAuthor.id,
        },
      },
    },
  });

  return updatedActivity;
}
