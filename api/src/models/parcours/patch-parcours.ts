import { Prisma } from "@prisma/client";

import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { prisma } from "../../utils/db.ts";
import { removeParcoursContactsFromModules } from "./remove-parcours-contacts-from-modules.ts";

export type PatchParcoursPayload = {
  title?: string;
  description?: string | null;
  formationId?: number;
  startDate?: string | null;
  endDate?: string | null;
  virtualClass?: string | null;
  tagIds?: number[];
  contactIds?: number[];
  objectives?: string[];
};

async function patchParcours(
  parcoursId: number,
  payload: PatchParcoursPayload,
  userId: string,
) {
  const admin = await getAdmin(userId);

  const tagIds = [...new Set(payload.tagIds ?? [])];
  const contactIds = [...new Set(payload.contactIds ?? [])];

  const updated = await prisma.$transaction(async (tx) => {
    const existingParcours = await tx.parcours.findFirst({
      where: { id: parcoursId, adminId: admin.id },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        formationId: true,
        contacts: { select: { contactId: true } },
      },
    });

    if (!existingParcours) {
      throw {
        message: "Le parcours n'existe pas ou vous n'y avez pas accès.",
        statusCode: 404,
      };
    }

    if (payload.formationId !== undefined) {
      const formation = await tx.formation.findUnique({
        where: { id: payload.formationId },
        select: { id: true },
      });

      if (!formation) {
        throw { message: "La formation n'existe pas.", statusCode: 404 };
      }
    }

    if (payload.tagIds !== undefined) {
      const tagsCount = await tx.tag.count({ where: { id: { in: tagIds } } });
      if (tagsCount !== tagIds.length) {
        throw { message: "Un ou plusieurs tags n'existent pas.", statusCode: 404 };
      }
    }

    if (payload.contactIds !== undefined) {
      const contactsCount = await tx.contact.count({
        where: { id: { in: contactIds } },
      });
      if (contactsCount !== contactIds.length) {
        throw {
          message: "Un ou plusieurs contacts n'existent pas.",
          statusCode: 404,
        };
      }

      const retainedContactIds = new Set(contactIds);
      const removedContactIds = existingParcours.contacts
        .map(({ contactId }) => contactId)
        .filter((contactId) => !retainedContactIds.has(contactId));
      await removeParcoursContactsFromModules(
        tx,
        parcoursId,
        removedContactIds,
      );
    }
    const startDate =
      payload.startDate === undefined
        ? existingParcours.startDate
        : payload.startDate === null
          ? null
          : new Date(payload.startDate);
    const endDate =
      payload.endDate === undefined
        ? existingParcours.endDate
        : payload.endDate === null
          ? null
          : new Date(payload.endDate);

    if (startDate && endDate && startDate > endDate) {
      throw {
        message: "La date de fin doit être postérieure à la date de début.",
        statusCode: 400,
      };
    }

    const data: Prisma.ParcoursUpdateInput = {};
    if (payload.title !== undefined) data.title = payload.title;
    if (payload.description !== undefined) data.description = payload.description;
    if (payload.startDate !== undefined) data.startDate = startDate;
    if (payload.endDate !== undefined) data.endDate = endDate;
    if (payload.virtualClass !== undefined) {
      data.virtualClass = payload.virtualClass || null;
    }
    if (payload.formationId !== undefined) {
      data.formation = { connect: { id: payload.formationId } };
    }
    if (payload.tagIds !== undefined) {
      data.tags = {
        deleteMany: {},
        create: tagIds.map((id) => ({ tag: { connect: { id } } })),
      };
    }
    if (payload.contactIds !== undefined) {
      data.contacts = {
        deleteMany: {},
        create: contactIds.map((id) => ({ contact: { connect: { id } } })),
      };
    }
    if (payload.objectives !== undefined) {
      data.objectives = {
        deleteMany: {},
        create: payload.objectives.map((description) => ({ description })),
      };
    }

    if (payload.tagIds !== undefined && tagIds.length > 0) {
      const formationId = payload.formationId ?? existingParcours.formationId;
      await tx.tagsOnFormation.createMany({
        data: tagIds.map((tagId) => ({ tagId, formationId })),
        skipDuplicates: true,
      });
    }

    const updated = await tx.parcours.update({
      where: { id: parcoursId },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        virtualClass: true,
        formation: {
          select: {
            id: true,
            title: true,
            level: true,
            tags: { select: { tag: true } },
          },
        },
        tags: { select: { tag: true } },
        contacts: { select: { contact: true } },
        objectives: {
          orderBy: { id: "asc" },
          select: { id: true, description: true },
        },
      },
    });

    return updated;
  });

  const contacts = await enrichContactsWithNames(
    updated.contacts.map(({ contact }) => contact),
  );
  return {
    ...updated,
    tags: updated.tags.map(({ tag }) => tag),
    contacts,
  };
}

export default patchParcours;
