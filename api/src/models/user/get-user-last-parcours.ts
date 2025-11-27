import { prisma } from "../../utils/db";

/**
 * Return last parcours (max 2) for a contact identified by its MongoDB id.
 *
 * - Validates contact existence
 * - Protects against empty relations
 * - Converts binary thumb safely to base64 (if present)
 *
 * @param userId MongoDB id of the contact
 * @returns Array of { title, thumb } where thumb is base64 string or null
 * @throws { statusCode: number, message: string } when contact not found or on internal errors
 */
export default async function getUserLastParcours(userId: string) {
  try {
    const contact = await prisma.contact.findFirst({
      where: { idMdb: userId },
    });

    if (!contact) {
      throw {
        message: "L'utilisateur n'existe pas dans la liste des contacts.",
        statusCode: 404,
      };
    }

    const userParcoursId = await prisma.contactsOnParcours.findMany({
      where: { contactId: contact.id },
      select: { parcoursId: true },
    });

    const parcoursIds = userParcoursId.map((item) => item.parcoursId);

    // if no parcours linked, return empty array early
    if (parcoursIds.length === 0) return [];

    const userParcours = await prisma.parcours.findMany({
      where: {
        id: {
          in: parcoursIds,
        },
      },
      take: 2,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        title: true,
        thumb: true,
      },
    });

    const result = userParcours.map((item) => {
      let thumbBase64: string | null = null;

      // safe conversion: Buffer.isBuffer check and fallback if `.toString` exists
      try {
        if (
          item.thumb &&
          (Buffer.isBuffer(item.thumb) ||
            typeof (item.thumb as any).toString === "function")
        ) {
          thumbBase64 = (item.thumb as any).toString("base64");
        }
      } catch {
        thumbBase64 = null;
      }

      return {
        title: item.title,
        thumb: thumbBase64,
      };
    });

    return result;
  } catch (err: any) {
    // rethrow known errors, otherwise wrap as 500
    if (err && err.statusCode) throw err;
    throw { message: "Internal server error", statusCode: 500 };
  }
}
