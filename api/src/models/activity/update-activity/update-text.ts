import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "../../../utils/db";

export default async function updateText(
  activityId: number,
  value: string,
  url: string,
  order: number
) {
  const existingActivity = await prisma.activity.findFirst({
    where: { id: activityId },
  });
  if (!existingActivity) {
    const error = new Error("L'activité n'existe pas.");
    (error as any).stautsCode = 404;
    throw error;
  }
  const uniqueID: string = uuidv4();
  const fileName: string = uniqueID + new Date().getTime() + ".mdx";

  console.log({ value });

  try {
    const file = fs.writeFileSync(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "activities",
        fileName
      ),
      value
    );

    console.log({ existingActivity });

    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        ...existingActivity,
        url: fileName,
        order,
      },
    });

    await fs.promises.unlink(
      path.join(__dirname, "..", "..", "..", "..", "uploads", "activities", url)
    );
    console.log("Fichier supprimé :", url);

    return updatedActivity;
  } catch (error: any) {
    throw new Error(
      "Le document n'a pas pu être mis à jour, réessayez plus tard svp..."
    );
  }
}
