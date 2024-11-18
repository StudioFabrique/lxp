import { prisma } from "../../../utils/db";
import path from "path";
import fs from "fs";

export default async function putActivityImage(
  activityId: number,
  userId: string,
  title: string,
  description: string,
  filename: string | null
) {
  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });
  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  const existingActivity = await prisma.activity.findFirst({
    where: { id: activityId },
  });

  if (!existingActivity)
    throw { statusCode: 404, message: "L'activité n'existe pas." };

  const oldFilename = existingActivity.url;

  const updatedActivity = await prisma.activity.update({
    where: { id: activityId },
    data: {
      title,
      description,
      url: filename ?? existingActivity.url,
    },
  });

  if (filename) {
    await fs.promises.unlink(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "activities",
        "images",
        oldFilename
      )
    );
  }

  return updatedActivity;
}
