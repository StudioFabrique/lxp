import { prisma } from "../../../utils/db";

export default async function updateText(
  activityId: number,
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
}
