import { prisma } from "../../utils/db";
import Group from "../../utils/interfaces/db/group";

export default async function getCoursesTimeline(
  userIdMdb: string,
  minDate: string,
  maxDate: string,
  /**
   * allCourses - Si l'utilisateur est un admin, lui laisser le choix d'afficher tous les cours
   * ou ceux pour lesquels il est affecté en tant que formateur s'il est formateur.
   */
  showAllCourses?: boolean
) {
  // Recherche des groupes contenant les étudiants
  const groupsWhereStudentIs = await Group.find({ users: userIdMdb });
  const groupsIds: string[] = groupsWhereStudentIs.map((group) => group.id);

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

  const admins = await prisma.admin.findMany({
    where: {
      idMdb: userIdMdb,
    },
  });

  if (
    !(groupsIds.length > 0 || formateurContacts.length > 0 || admins.length > 0)
  )
    return null;

  // Trouver les cours dans les modules pour ces groupes
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      dates: true,
      module: {
        select: {
          id: true,
          // select parcours only if showAllCourses
          parcours: showAllCourses
            ? {
                select: {
                  title: true,
                  formation: { select: { title: true } },
                },
              }
            : false,
          module: { select: { title: true } },
        },
      },
      lessons: {
        select: {
          id: true,
        },
        take: 1,
      },
    },
    where: {
      isPublished: true,
      visibility: true,
      OR: [
        ...(admins.length > 0 && showAllCourses
          ? [
              {
                module: {
                  minDate: {
                    lte: new Date(maxDate).toISOString(),
                  },
                  maxDate: {
                    gte: new Date(minDate).toISOString(),
                  },
                },
              },
            ]
          : [
              {
                contacts: {
                  some: {
                    contactId: {
                      in: formateurContacts.map((contact) => contact.id),
                    },
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
                    isPublished: true,
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
              {
                module: {
                  parcours: {
                    isPublished: true,
                    groups: {
                      some: {
                        group: { idMdb: { in: groupsIds } },
                      },
                    },
                  },
                },
              },
            ]),
      ],
      module: {
        // Adjusted logic to check for overlap
        OR: [
          {
            minDate: {
              lte: new Date(maxDate).toISOString(),
            },
            maxDate: {
              gte: new Date(minDate).toISOString(),
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
      // Adjusted to include overlapping ranges
      if (
        new Date(date.minDate) <= new Date(maxDate) &&
        new Date(date.maxDate) >= new Date(minDate)
      ) {
        acc.push({
          id: course.id,
          moduleId: course.module.id,
          moduleTitle: course.module.module.title,
          title: course.title,
          minDate: date.minDate,
          maxDate: date.maxDate,
          firstLessonId: course.lessons[0]?.id,
          parcoursTitle:
            showAllCourses && course.module.parcours
              ? (course.module.parcours as any)[0]?.parcours?.title
              : undefined,
          formationTitle:
            showAllCourses && course.module.parcours
              ? (course.module.parcours as any)[0]?.parcours?.formation?.title
              : undefined,
        });
      }
    }
    return acc;
  }, []);

  return coursesFormatted;
}
