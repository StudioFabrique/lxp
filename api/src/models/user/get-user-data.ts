import { sortArray } from "../../helpers/sortArray.ts";
import { prisma } from "../../utils/db.ts";
import { type IConnectionInfos } from "../../utils/interfaces/db/connection-infos.ts";
import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import type { IGroup } from "../../utils/interfaces/db/group.ts";
import { getLearningContext } from "../learning-profile/learning-profile.ts";

type PopulatedUserData = Omit<IUser, "connectionInfos" | "group"> & {
  connectionInfos?: IConnectionInfos[];
  group?: IGroup[];
};

/**
 * Retrieves comprehensive user data including connection history, parcours information, and completion statistics
 *
 * @param userId - The MongoDB user identifier
 * @returns Promise containing user data, parcours information, and completion percentage
 * @throws Error with message and statusCode if user is not found
 */
export default async function getUserData(userId: string) {
  // Fetch user data from MongoDB with populated relations, excluding sensitive fields
  let user = await User.findOne(
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
    .populate("promptStats")
    .lean<PopulatedUserData | null>();

  // Validate user existence
  if (!user) {
    throw { message: "L'apprenant n'existe pas.", statusCode: 404 };
  }

  // Process connection information for the last 15 days
  // Guard against missing connectionInfos
  let tmp: IConnectionInfos[] = user.connectionInfos ?? [];

  // Calculate timestamp for 15 days ago
  const now = Date.now();

  // Filter connection infos to only include last 15 days
  tmp = tmp.filter((item: IConnectionInfos) => {
    const last = item?.lastConnection
      ? new Date(item.lastConnection).getTime()
      : 0;
    return last >= now - 30 * 24 * 3600 * 1000;
  });

  // Create array to store missing connection days
  let newInfos: Array<any> = [];

  // Fill in missing days with zero duration for complete 14-day history
  for (let delay = 30; delay > 0; delay--) {
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
  };

  // Initialize parcours data and completion tracking
  let parcours: any = {};
  let parcoursCompletion = 0;

  // Process parcours information if user belongs to a group
  if (user.group && user.group.length > 0) {
    const groupId = user.group[0]!._id.toString();
    // Fetch the most recent parcours for the user's group from PostgreSQL
    const response = await prisma.orm.public.Group.where({ idMdb: groupId })
      .include("parcours", (related46) =>
        related46
          .include("parcours", (related47) =>
            related47.select("id", "title", "image"),
          )
          .orderBy((row) => row.parcoursId.desc())
          .limit(1),
      )
      .first();

    // Default total lessons count
    let totalLessonsCount = 0;

    // Process parcours data if found
    if (response && response.parcours && response.parcours.length > 0) {
      // Extract parcours object from the response
      parcours = response.parcours.map((item: any) => item.parcours)[0];

      // Fetch modules -> courses -> lessons structure for this parcours
      const parcoursStructure = await prisma.orm.public.Parcours.where({
        id: parcours.id,
      })
        .include("modules", (related48) =>
          related48.include("courses", (related49) =>
            related49.include("lessons", (related50) => related50.select("id")),
          ),
        )
        .all();

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
  const learningContext = await getLearningContext(userId).catch(() => null);

  return {
    user,
    parcours: parcours ?? null,
    learningProfile: learningContext
      ? {
          profile: learningContext.profile,
          formations: learningContext.availableFormations,
        }
      : null,
  };
}
