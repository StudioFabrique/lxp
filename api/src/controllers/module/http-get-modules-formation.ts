import { Request, Response } from "express";
import { prisma } from "../../utils/db";

/**
 * Basic module result type without metadata
 */
type Result = {
  /** Unique identifier for the module */
  id: number;
  /** Module title */
  title: string;
  /** Module description (optional) */
  description: string | null;
  /** Module thumbnail image encoded in base64 (optional) */
  thumb: string | null;
};

/**
 * Extended module result type including metadata information
 * Used when duplicate mode is enabled
 */
type ResultWithMetadatas = Result & {
  /** Array of metadata objects containing course and lesson information */
  metadatas: {
    /** Unique identifier for the metadata entry */
    id: number;
    /** Array of courses associated with this module metadata */
    courses: {
      /** Unique identifier for the course */
      id: number;
      /** Array of lessons within the course */
      lessons: { id: number; title: string }[];
    }[];
  }[];
};

/**
 * HTTP Controller: Get Modules for a Formation
 *
 * Retrieves all modules associated with a specific formation.
 * Can optionally include metadata (courses, contacts, bonus skills) when in duplicate mode.
 *
 * Route: GET /api/v1/modules/formation/:formationId/:duplicate
 *
 * Example without metadata:
 * GET /api/v1/modules/formation/123/false
 *
 * Example with metadata (for duplication):
 * GET /api/v1/modules/formation/123/true
 */
async function httpGetModuleFormation(req: Request, res: Response) {
  try {
    // Extract formation ID and duplicate flag from route parameters
    const { formationId, duplicate = false } = req.params;

    // Fetch all modules associated with the formation
    // Includes module details and all related metadata (parcours, courses, contacts, bonus skills)
    const modules = await prisma.modulesOnFormation.findMany({
      where: { formationId: +formationId },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            description: true,
            thumb: true,
            metadatas: {
              select: {
                id: true,
                // Include parcours information for each metadata
                parcours: { select: { id: true, title: true } },
                // Include all courses associated with this module
                courses: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                // Include contact persons for this module
                contacts: {
                  select: {
                    contact: {
                      select: {
                        id: true,
                        name: true,
                        role: true,
                      },
                    },
                  },
                },
                // Include bonus skills that can be earned from this module
                bonusSkills: {
                  select: {
                    bonusSkill: {
                      select: {
                        id: true,
                        description: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    /*
     * LEGACY CODE - Alternative query by module title (currently unused)
     *
     * This was previously used to fetch modules by title instead of formation ID.
     * Kept for reference in case this functionality needs to be restored.
     *
    const modules = await prisma.module.findMany({
      where: { title: moduleTitle as string },
      select: {
        id: true,
        title: true,
        description: true,
        thumb: true,
        metadatas: {
          select: {
            id: true,
            courses: {
              select: {
                id: true,
                title: true,
              },
            },
            contacts: {
              select: {
                contact: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
            },
            bonusSkills: {
              select: {
                bonusSkill: {
                  select: {
                    id: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    */

    // Initialize result variable to hold processed module data
    let result: Result[] | ResultWithMetadatas[] | null = null;

    // Process the result based on duplicate mode
    // When duplicate is false: return only basic module information
    // When duplicate is true: include metadata for module duplication
    result = !duplicate
      ? modules.map((item) => ({
          ...item.module,
          // Convert thumbnail buffer to base64 string for frontend consumption
          thumb: item.module.thumb
            ? Buffer.from(item.module!.thumb as any).toString("base64")
            : null,
        }))
      : modules.map((item) => ({
          ...item.module,
          // Convert thumbnail buffer to base64 string
          thumb: item.module.thumb
            ? Buffer.from(item.module!.thumb as any).toString("base64")
            : null,
          // Include all metadata when in duplicate mode
          metadatas: item.module.metadatas,
        }));

    // Return successful response with processed module data
    return res.status(200).json(result);
  } catch (error: any) {
    // Handle any errors and return 500 status with error message
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetModuleFormation;
