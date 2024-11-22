import { prisma } from "../../utils/db";
import Group from "../../utils/interfaces/db/group";

export default async function getCoursesTimeline(
  userIdMdb: string,
  minDate: string,
  maxDate: string,
) {
  // Recherche des groupes contenant les étudiants
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });
  const groupIds: string[] = groupsWhereStudentIs.map((group) => group.id);

  // Recherche du formateur (dans le cas où l'utilisateur est un formateur)
  const formateurContacts = await prisma.contact.findMany({
    where: {
      idMdb: userIdMdb,
      courses: {
        some: {
          courseId: {
            not: undefined,
          },
        },
      },
    },
  });

  if (!(groupIds.length > 0 || formateurContacts.length > 0)) return null;

  // Find courses in modules for those groups
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      dates: true,
      module: { select: { id: true, title: true } },
    },
    where: {
      OR: [
        {
          contacts: {
            some: {
              contactId: { in: formateurContacts.map((contact) => contact.id) },
            },
          },
          module: {
            contacts: {
              some: {
                contactId: {
                  in: formateurContacts.map((contact) => contact.id),
                },
              },
            },
            parcours: {
              some: {
                parcours: {
                  contacts: {
                    some: {
                      contactId: {
                        in: formateurContacts.map((contact) => contact.id),
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          module: {
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
        },
      ],
      module: {
        minDate: {
          lte: new Date(maxDate).toISOString(),
        },
        maxDate: {
          gte: new Date(minDate).toISOString(),
        },
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
          moduleId: course.module.id,
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
