import { prisma } from "../../utils/db";
import Group from "../../utils/interfaces/db/group";

export default async function getCoursesTimeline(
  userIdMdb: string,
  minDate: string,
  maxDate: string,
) {
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });

  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  if (!(groupIds.length > 0)) return null;

  // Find courses in modules for those groups
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      dates: true,
      module: { select: { title: true } },
    },
    where: {
      module: {
        AND: [
          {
            minDate: {
              lte: new Date(maxDate).toISOString(),
            },
            maxDate: {
              gte: new Date(minDate).toISOString(),
            },
          },
          {
            parcours: {
              every: {
                parcours: {
                  groups: {
                    some: {
                      group: { idMdb: { in: groupIds } },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
    orderBy: {
      dates: "asc",
    },
  });

  const coursesFormatted = courses.reduce<any>((acc, course) => {
    for (const date of course.dates as {
      minDate: string;
      maxDate: string;
    }[]) {
      if (
        new Date(date.minDate) >= new Date(minDate) &&
        new Date(date.maxDate) <= new Date(maxDate)
      ) {
        acc.push({
          id: course.id,
          moduleTitle: course.module.title,
          title: course.title,
          minDate: date.minDate,
          maxDate: date.maxDate,
        });
      }
    }
    return acc;
  }, []);

  return coursesFormatted;
}
