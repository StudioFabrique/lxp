import { sortArray } from "../../helpers/sortArray";
import { prisma } from "../../utils/db";
import { IConnectionInfos } from "../../utils/interfaces/db/connection-infos";
import User, { IUser } from "../../utils/interfaces/db/user";

/**
 * Retrieves comprehensive user data including connection history, parcours information, and completion statistics
 *
 * @param userId - The MongoDB user identifier
 * @returns Promise containing user data, parcours information, and completion percentage
 * @throws Error with message and statusCode if user is not found
 */
export default async function getUserData(userId: string) {
  // Fetch user data from MongoDB with populated relations, excluding sensitive fields
  let user = (await User.findOne(
    { _id: userId },
    {
      // Exclude sensitive and unnecessary fields from the response
      password: 0,
      emailVerified: 0,
      invitationSent: 0,
      studentFeedbacks: 0,
      graduations: 0,
      address: 0,
      nickname: 0,
      birthDate: 0,
      postCode: 0,
      city: 0,
    },
  )
    .populate("connectionInfos") // Include connection history data
    .populate("group", { image: 0 }) // Include group data but exclude images
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 }) // Include user roles
    .populate("hobbies")
    .populate("links")
    .lean()) as IUser;

  // Validate user existence
  if (!user) {
    throw { message: "L'apprenant n'existe pas.", statusCode: 404 };
  }

  // Process connection information for the last 15 days
  // Guard against missing connectionInfos
  let tmp: IConnectionInfos[] = (user.connectionInfos ??
    []) as IConnectionInfos[];

  // Calculate timestamp for 15 days ago
  const now = Date.now();

  // Filter connection infos to only include last 15 days
  tmp = tmp.filter((item: IConnectionInfos) => {
    const last = item?.lastConnection
      ? new Date(item.lastConnection).getTime()
      : 0;
    return last >= now - 60 * 24 * 3600 * 1000;
  });

  // Create array to store missing connection days
  let newInfos: Array<any> = [];

  // Fill in missing days with zero duration for complete 14-day history
  for (let delay = 14; delay > 0; delay--) {
    const date = new Date(now - delay * 24 * 3600 * 1000);

    // Check if connection info exists for this specific day
    const info = tmp.find((elem: any) => {
      const elemDate = elem?.lastConnection
        ? new Date(elem.lastConnection)
        : null;
      return elemDate
        ? elemDate.getDate() === date.getDate() &&
            elemDate.getMonth() === date.getMonth() &&
            elemDate.getFullYear() === date.getFullYear()
        : false;
    });

    // If no connection info found for this day, add entry with zero duration
    if (!info) {
      newInfos = [...newInfos, { lastConnection: date, duration: 0 }];
    }
  }

  // Merge actual connection data with filled missing days and sort by date
  tmp = sortArray([...tmp, ...newInfos], "lastConnection");

  // Update user object with processed connection information
  user = {
    ...user,
    connectionInfos: tmp,
  } as IUser;

  // Initialize parcours data and completion tracking
  let parcours: any = {};
  let parcoursCompletion = 0;

  // Process parcours information if user belongs to a group
  if (user.group && user.group.length > 0) {
    // Fetch the most recent parcours for the user's group from PostgreSQL
    const response = await prisma.group.findFirst({
      where: { idMdb: user.group[0]._id },
      select: {
        parcours: {
          select: {
            parcours: { select: { id: true, title: true, image: true } },
          },
          orderBy: {
            parcoursId: "desc", // Get the most recent parcours
          },
          take: 1, // Limit to one result
        },
      },
    });

    // Default total lessons count
    let totalLessonsCount = 0;

    // Process parcours data if found
    if (response && response.parcours && response.parcours.length > 0) {
      // Extract parcours object from the response
      parcours = response.parcours.map((item: any) => item.parcours)[0];

      // Fetch modules -> courses -> lessons structure for this parcours
      const parcoursStructure = await prisma.parcours.findMany({
        where: { id: parcours.id },
        select: {
          modules: {
            select: {
              courses: {
                select: {
                  lessons: {
                    select: { id: true }, // Only need lesson IDs
                  },
                },
              },
            },
          },
        },
      });

      // Flatten the nested arrays to compute the total number of lessons
      totalLessonsCount = parcoursStructure.reduce((accP, p) => {
        const modules = p.modules ?? [];
        const modulesCount = modules.reduce((accM, m) => {
          const courses = m.courses ?? [];
          const coursesCount = courses.reduce((accC, c) => {
            const lessons = c.lessons ?? [];
            return accC + lessons.length;
          }, 0);
          return accM + coursesCount;
        }, 0);
        return accP + modulesCount;
      }, 0);
    }

    // Find the student record in PostgreSQL using MongoDB user ID
    const student = await prisma.student.findFirst({
      where: { idMdb: userId },
    });

    // If student exists, fetch their finished lessons count safely
    let finishedLessonsCount = 0;
    if (student) {
      const studentWithLessons = await prisma.student.findUnique({
        where: { id: student.id },
        select: { lessonsRead: { select: { id: true } } },
      });
      finishedLessonsCount = studentWithLessons?.lessonsRead?.length ?? 0;
    }

    // Calculate completion percentage based on finished vs total lessons
    parcoursCompletion =
      totalLessonsCount > 0
        ? (finishedLessonsCount / totalLessonsCount) * 100
        : 0;

    // Convert parcours image from Buffer to base64 string if it exists
    if (parcours && parcours.image) {
      try {
        // Convert Buffer/Uint8Array to base64 string for frontend consumption
        const imageBuffer = Buffer.from(parcours.image);
        parcours = {
          ...parcours,
          image: imageBuffer.toString("base64"),
        };
      } catch {
        // ignore image conversion errors and leave image as-is
      }
    }
  }

  // Return comprehensive user data structure
  return {
    user,
    parcours: parcours ?? null,
    parcoursCompletion: parcoursCompletion,
  };
}
