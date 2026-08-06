import { prisma } from "../../utils/db.ts";

export default async function deleteManyTags(tagsIds: string[]) {
  try {
    // Convert string IDs to numbers since the schema uses Int
    const numericTagIds = tagsIds.map((id) => parseInt(id));

    await prisma.$transaction([
      // Delete all relations first
      prisma.tagsOnCourse.deleteMany({
        where: {
          tagId: { in: numericTagIds },
        },
      }),
      prisma.tagsOnFormation.deleteMany({
        where: {
          tagId: { in: numericTagIds },
        },
      }),
      prisma.tagsOnParcours.deleteMany({
        where: {
          tagId: { in: numericTagIds },
        },
      }),
      // Update lessons to remove references to deleted tags
      prisma.lesson.updateMany({
        where: {
          tagId: { in: numericTagIds },
        },
        data: {
          // You might want to set a default tag ID here
          tagId: 1, // or some default value
        },
      }),
      // Finally delete the tags
      prisma.tag.deleteMany({
        where: {
          id: { in: numericTagIds },
        },
      }),
    ]);

    return [];
  } catch (error) {
    return [];
  }
}
