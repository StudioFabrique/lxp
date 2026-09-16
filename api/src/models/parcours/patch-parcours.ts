import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import type { Models } from "../../prisma/contract.d.ts";

import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { prisma } from "../../utils/db.ts";
import { assertCanUnassignTags, canUnassignTag } from "../tag/tag-access.ts";
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

export type PatchParcoursActor = {
  userId: string;
  rank: number;
};

async function patchParcours(
  parcoursId: number,
  payload: PatchParcoursPayload,
  actor: PatchParcoursActor,
) {
  const isAdmin = actor.rank <= 1;
  const updatedFields = Object.entries(payload)
    .filter(([, value]) => value !== undefined)
    .map(([field]) => field);

  if (
    !isAdmin &&
    (actor.rank !== 2 ||
      updatedFields.length !== 1 ||
      updatedFields[0] !== "tagIds")
  ) {
    throw {
      message: "Vous n'êtes pas autorisé à modifier ces informations.",
      statusCode: 403,
    };
  }

  const admin = isAdmin ? await getAdmin(actor.userId) : null;

  const tagIds = [...new Set(payload.tagIds ?? [])];
  const contactIds = [...new Set(payload.contactIds ?? [])];

  const updated = await prisma.transaction(async (tx) => {
    const existingParcours = await tx.orm.public.Parcours.where((row) =>
      whereFromObject(row, {
        id: parcoursId,
        ...(admin
          ? { adminId: admin.id }
          : {
              contacts: {
                some: { contact: { idMdb: actor.userId } },
              },
            }),
      }),
    )
      .select("id", "startDate", "endDate", "formationId")
      .include("tags", (related0) => related0.select("tagId", "addedBy"))
      .include("contacts", (related1) => related1.select("contactId"))
      .first();

    if (!existingParcours) {
      throw {
        message: "Le parcours n'existe pas ou vous n'y avez pas accès.",
        statusCode: 404,
      };
    }

    if (payload.formationId !== undefined) {
      const formation = await tx.orm.public.Formation.where((row) =>
        whereFromObject(row, { id: payload.formationId }),
      )
        .select("id")
        .first();

      if (!formation) {
        throw { message: "La formation n'existe pas.", statusCode: 404 };
      }
    }

    if (payload.tagIds !== undefined) {
      const tagsCount = await tx.orm.public.Tag.where((row) =>
        whereFromObject(row, { id: { in: tagIds } }),
      )
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total);
      if (tagsCount !== tagIds.length) {
        throw {
          message: "Un ou plusieurs tags n'existent pas.",
          statusCode: 404,
        };
      }

      const requestedTagIds = new Set(tagIds);
      const existingTagIds = new Set(
        existingParcours.tags.map(({ tagId }) => tagId),
      );
      const removedAssignments = existingParcours.tags.filter(
        ({ tagId }) => !requestedTagIds.has(tagId),
      );

      if (!isAdmin) {
        assertCanUnassignTags(removedAssignments, {
          userId: actor.userId,
          isAdmin: false,
        });
      }

      const removedTagIds = removedAssignments.map(({ tagId }) => tagId);
      if (removedTagIds.length > 0) {
        await tx.orm.public.TagsOnParcours.where((row) =>
          whereFromObject(row, { parcoursId, tagId: { in: removedTagIds } }),
        )
          .deleteAndCount()
          .then((count) => ({ count }));
      }

      const addedTagIds = tagIds.filter((tagId) => !existingTagIds.has(tagId));
      if (addedTagIds.length > 0) {
        await tx.orm.public.TagsOnParcours.createAndCount(
          addedTagIds.map((tagId) => ({
            parcoursId,
            tagId,
            addedBy: isAdmin ? null : actor.userId,
          })),
        ).then((count) => ({ count }));
      }
    }

    if (payload.contactIds !== undefined) {
      const contactsCount = await tx.orm.public.Contact.where((row) =>
        whereFromObject(row, { id: { in: contactIds } }),
      )
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total);
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
          : new Date(payload.startDate).toISOString();
    const endDate =
      payload.endDate === undefined
        ? existingParcours.endDate
        : payload.endDate === null
          ? null
          : new Date(payload.endDate).toISOString();

    if (startDate && endDate && startDate > endDate) {
      throw {
        message: "La date de fin doit être postérieure à la date de début.",
        statusCode: 400,
      };
    }

    const data: Partial<
      Pick<
        Models.public_Parcours,
        "title" | "description" | "startDate" | "endDate" | "virtualClass" | "formationId" | "updatedAt"
      >
    > = {};
    if (payload.title !== undefined) data.title = payload.title;
    if (payload.description !== undefined)
      data.description = payload.description;
    if (payload.startDate !== undefined) data.startDate = startDate;
    if (payload.endDate !== undefined) data.endDate = endDate;
    if (payload.virtualClass !== undefined) {
      data.virtualClass = payload.virtualClass || null;
    }
    if (payload.formationId !== undefined) {
      data.formationId = payload.formationId;
    }
    if (
      payload.tagIds !== undefined ||
      payload.contactIds !== undefined ||
      payload.objectives !== undefined
    ) {
      data.updatedAt = new Date().toISOString();
    }
    if (payload.contactIds !== undefined) {
      await tx.orm.public.ContactsOnParcours.where((row) =>
        whereFromObject(row, { parcoursId }),
      ).deleteAndCount();
      if (contactIds.length > 0) {
        await tx.orm.public.ContactsOnParcours.createAndCount(
          contactIds.map((contactId) => ({ parcoursId, contactId })),
        );
      }
    }
    if (payload.objectives !== undefined) {
      await tx.orm.public.Objective.where((row) =>
        whereFromObject(row, { parcoursId }),
      ).deleteAndCount();
      if (payload.objectives.length > 0) {
        await tx.orm.public.Objective.createAndCount(
          payload.objectives.map((description) => ({ parcoursId, description })),
        );
      }
    }

    if (payload.tagIds !== undefined && tagIds.length > 0) {
      const formationId = payload.formationId ?? existingParcours.formationId;
      const formationTags = await tx.orm.public.TagsOnFormation.where((row) =>
        whereFromObject(row, { formationId }),
      )
        .select("tagId")
        .all();
      const assignedIds = new Set(formationTags.map(({ tagId }) => tagId));
      const missingIds = tagIds.filter((tagId) => !assignedIds.has(tagId));
      if (missingIds.length > 0) {
        await tx.orm.public.TagsOnFormation.createAndCount(
          missingIds.map((tagId) => ({ tagId, formationId })),
        );
      }
    }

    const updated = await tx.orm.public.Parcours.where((row) =>
      whereFromObject(row, { id: parcoursId }),
    )
      .select(
        "id",
        "title",
        "description",
        "startDate",
        "endDate",
        "virtualClass",
      )
      .include("formation", (related2) =>
        related2
          .select("id", "title", "level")
          .include("tags", (related3) => related3.include("tag")),
      )
      .include("tags", (related4) => related4.select("addedBy").include("tag"))
      .include("contacts", (related5) => related5.include("contact"))
      .include("objectives", (related6) =>
        related6.select("id", "description").orderBy((row) => row.id.asc()),
      )
      .update(data)
      .then(requireDatabaseRow);

    return updated;
  });

  const contacts = await enrichContactsWithNames(
    updated.contacts.map(({ contact }) => contact),
  );
  return {
    ...updated,
    tags: updated.tags.map(({ tag, addedBy }) => ({
      ...tag,
      canUnassign: canUnassignTag(
        { addedBy },
        { userId: actor.userId, isAdmin },
      ),
    })),
    contacts,
  };
}

export default patchParcours;
