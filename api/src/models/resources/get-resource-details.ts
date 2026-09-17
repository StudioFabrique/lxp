import { prisma } from "../../utils/db.ts";

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
  const existingResource = await prisma.orm.public.Resource.where({
    id: resourceId,
  })
    .include("bonusActivities", (related27) =>
      related27
        .include("resourceBonusActivities", (related28) =>
          related28.orderBy((row) => row.order.asc()),
        )
        .orderBy((row) => row.order.asc()),
    )
    .include("tags", (related29) =>
      related29.include("tag", (related30) =>
        related30.select("id", "name", "color"),
      ),
    )
    .first();

  // Throw 404 error if resource not found
  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  // Destructure to separate bonus activities from other properties
  const { bonusActivities, ...rest } = existingResource;

  // Return formatted resource with renamed activities and flattened tags
  return {
    ...rest,
    activities: bonusActivities.map((activity) => ({
      ...activity,
      resourceActivities: activity.resourceBonusActivities,
    })),
    tags: existingResource.tags.map((t) => t.tag),
  };
}
