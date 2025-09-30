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
      isActive: 0,
      studentFeedbacks: 0,
      graduations: 0,
      links: 0,
      hobbies: 0,
    }
  )
    .populate("connectionInfos") // Include connection history data
    .populate("group", { image: 0 }) // Include group data but exclude images
    .populate("roles") // Include user roles
    .lean()) as IUser;

  // Validate user existence
  if (!user) {
    throw { message: "L'apprenant n'existe pas.", statusCode: 404 };
  }

  // Process connection information for the last 15 days
  let tmp = user.connectionInfos;

  // Calculate timestamp for 15 days ago
  const now = new Date().getTime();

  // Filter connection infos to only include last 15 days
  tmp = tmp.filter(
    (item: IConnectionInfos) =>
      new Date(item.lastConnection).getTime() >= now - 15 * 24 * 3600 * 1000
  );

  // Create array to store missing connection days
  let newInfos = Array<any>();

  // Fill in missing days with zero duration for complete 14-day history
  for (let delay = 14; delay > 0; delay--) {
    const date = new Date(now - delay * 24 * 3600 * 1000);

    // Check if connection info exists for this specific day
    const info = tmp.find(
      (elem: any) => elem.lastConnection.getDate() === date.getDate()
    );

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
    let response = await prisma.group.findFirst({
      where: { idMdb: user.group[0]._id },
      select: {
        parcours: {
          select: {
            parcours: true,
          },
          orderBy: {
            parcoursId: "desc", // Get the most recent parcours
          },
          take: 1, // Limit to one result
        },
      },
    });

    // Array to store all lesson IDs in the parcours
    let lessonsIds: Array<any> = [];

    // Process parcours data if found
    if (response && response.parcours.length > 0) {
      // Extract parcours object from the response
      parcours = response.parcours.map((item: any) => item.parcours)[0];

      // Fetch all lesson IDs within this parcours by traversing the hierarchy:
      // parcours -> modules -> courses -> lessons
      lessonsIds = await prisma.parcours.findMany({
        where: { id: parcours.id },
        select: {
          modules: {
            select: {
              moduleMetadata: {
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
          },
        },
      });
    }

    // Find the student record in PostgreSQL using MongoDB user ID
    const student = await prisma.student.findFirst({
      where: { idMdb: userId },
    });

    // Get count of lessons that the student has finished reading
    const finishedLessons = await prisma.student.findMany({
      where: { id: student!.id },
      select: { lessonsRead: { select: { id: true } } },
    });

    // Calculate completion percentage based on finished vs total lessons
    parcoursCompletion = (finishedLessons.length / lessonsIds.length) * 100;

    // Convert parcours image from Buffer to base64 string if it exists
    if (parcours && parcours.image) {
      parcours = {
        ...parcours,
        image: parcours.image.toString("base64"),
      };
    }
  }

  // Return comprehensive user data structure
  return {
    user,
    parcours: parcours ?? null,
    parcoursCompletion: parcoursCompletion,
  };
}
