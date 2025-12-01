import { prisma } from "../../utils/db";

/**
 * Retrieves detailed information about a specific resource
 *
 * Fetches a resource by ID including its associated bonus activities,
 * resource bonus activities (ordered), and tags.
 *
 * @param resourceId - The unique identifier of the resource
 * @returns Resource details with activities and tags
 * @throws Error with statusCode 404 if resource doesn't exist
 *
 * @example
 * const resource = await getResourceDetails(123);
 * console.log(resource.activities); // Array of bonus activities
 * console.log(resource.tags); // Array of tags
 */
export default async function getResourceDetails(resourceId: number) {
  // Fetch resource with all related data
  const existingResource = await prisma.resource.findFirst({
    where: { id: resourceId },
    include: {
      // Include bonus activities ordered by their order field
      bonusActivities: {
        orderBy: { order: "asc" },
        include: {
          // Include resource bonus activities for each bonus activity
          resourceBonusActivities: {
            orderBy: { order: "asc" },
          },
        },
      },
      // Include only specific tag fields
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
    },
  });

  // Throw 404 error if resource not found
  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  // Destructure to separate bonus activities from other properties
  const { bonusActivities, ...rest } = existingResource;

  // Return formatted resource with renamed activities and flattened tags
  return {
    ...rest,
    activities: bonusActivities,
    tags: existingResource.tags.map((t) => t.tag),
  };
}
