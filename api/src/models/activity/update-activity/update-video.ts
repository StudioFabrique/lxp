import { prisma } from "../../../utils/db";
import path from "path";
import fs from "fs";

export default async function updateVideo(
  activityId: number,
  title: string,
  description: string,
  url: string
) {
  const existingActivity = await prisma.activity.findFirst({
    where: { id: activityId },
  });
  if (!existingActivity) {
    const error = new Error("L'activité n'existe pas.");
    (error as any).stautsCode = 404;
    throw error;
  }

  console.log({ url });

  const updatedActivity = await prisma.activity.update({
    where: { id: activityId },
    data: {
      ...existingActivity,
      title,
      description,
      url,
    },
  });

  if (!existingActivity.url.startsWith("http")) {
    await fs.promises.unlink(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "activities",
        "videos",
        existingActivity.url
      )
    );
    console.log("Fichier supprimé :", url);
  }
  return updatedActivity;
}
