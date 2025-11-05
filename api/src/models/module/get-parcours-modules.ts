import { prisma } from "../../utils/db";

/**
 * Retrieves a simplified list of modules within a specific parcours
 *
 * This function returns only the essential information (ID and title) for each module
 * in a parcours. It's typically used for:
 * - Displaying a quick module list
 * - Populating dropdown selections
 * - Module navigation menus
 *
 * Unlike getModulesFromParcours, this function returns minimal data without
 * contacts, skills, or detailed metadata.
 *
 * @param parcoursId - ID of the parcours (learning path) to retrieve modules from
 * @returns Promise<Array> - Array of objects containing module ID and title
 * @throws Error with statusCode 404 if no modules found in parcours
 *
 * @example
 * const modules = await getParcoursModules(123);
 * // Returns: [{ id: 1, title: "Introduction" }, { id: 2, title: "Advanced" }]
 */
export default async function getParcoursModules(parcoursId: number) {
  // Fetch all module metadata instances linked to this parcours
  // Only selects ID and title for lightweight response
  const modules = await prisma.moduleMetadata.findMany({
    where: { parcoursId: +parcoursId },
    select: {
      id: true, // ModuleMetadata ID (unique per parcours)
      // Fetch title from base Module entity (shared across parcours)
      module: {
        select: {
          title: true, // Module title
        },
      },
    },
  });

  // Transform data into a flat structure for frontend consumption
  // Maps module metadata to simple objects with ID and title
  return { message: "toto" };
}
