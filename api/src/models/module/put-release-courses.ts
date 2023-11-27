import { prisma } from "../../utils/db";

export default async function putReleaseCourses(coursesIds: number[]) {
  for (const courseId of coursesIds) {
    const result = await prisma.course.update({
      where: { id: courseId },
      data: { moduleId: undefined }, // Set moduleId to null to remove the relation
    });
    console.log({ result });
  }
}
