import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";
import { includeCreatorContact } from "../formation/module-contact-ids.ts";

async function putModule(
  module: any,
  image?: Buffer,
  thumb?: Buffer,
  userId?: string,
) {
  const [existingModule, currentContact] = await Promise.all([
    prisma.orm.public.Module.where((row) =>
      whereFromObject(row, { id: module.id }),
    )
      .include("parcours", (related202) =>
        related202
          .include("contacts", (related203) => related203.select("contactId"))
          .include("bonusSkills", (related204) => related204.select("id")),
      )
      .first(),
    userId
      ? prisma.orm.public.Contact.where((row) =>
          whereFromObject(row, { idMdb: userId }),
        )
          .select("id")
          .first()
      : null,
  ]);
  if (!existingModule) {
    throw { message: "Le module n'existe pas.", statusCode: 404 };
  }
  const selectedContactIds = [...new Set<number>(module.contactsIds ?? [])];
  const bonusSkillIds = [...new Set<number>(module.bonusSkillsIds ?? [])];
  const allowedContactIds = new Set(
    existingModule.parcours!.contacts.map(({ contactId }) => contactId),
  );
  const allowedSkillIds = new Set(
    existingModule.parcours!.bonusSkills.map(({ id }) => id),
  );
  if (
    selectedContactIds.some((id) => !allowedContactIds.has(id)) ||
    bonusSkillIds.some((id) => !allowedSkillIds.has(id))
  ) {
    throw {
      message:
        "Les contacts et compétences doivent appartenir au parcours du module.",
      statusCode: 400,
    };
  }
  const contactIds = includeCreatorContact(
    selectedContactIds,
    allowedContactIds,
    currentContact?.id,
  );

  const updated = await prisma.transaction(async (tx) => {
    await tx.orm.public.ContactsOnModule.where((row) =>
      whereFromObject(row, { moduleId: module.id }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await tx.orm.public.BonusSkillsOnModule.where((row) =>
      whereFromObject(row, { moduleId: module.id }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));

    return tx.orm.public.Module.where((row) =>
      whereFromObject(row, { id: module.id }),
    )
      .select(
        "id",
        "title",
        "description",
        "quizInstructions",
        "duration",
        "minDate",
        "maxDate",
        "thumb",
      )
      .include("contacts", (related205) =>
        related205.include("contact", (related206) =>
          related206.select("id", "idMdb", "role"),
        ),
      )
      .include("bonusSkills", (related207) =>
        related207.include("bonusSkill", (related208) =>
          related208.select("id", "description", "badge"),
        ),
      )
      .update({
        title: module.title,
        description: module.description ?? "",
        quizInstructions: module.quizInstructions ?? "",
        duration: +module.duration,
        ...(image
          ? {
              image: Uint8Array.from(image) as Uint8Array<ArrayBuffer>,
              thumb: thumb
                ? (Uint8Array.from(thumb) as Uint8Array<ArrayBuffer>)
                : undefined,
            }
          : {}),
        contacts: (relation) =>
          relation.create(
            contactIds.map((contactId: number) => ({ contactId })),
          ),
        bonusSkills: (relation) =>
          relation.create(
            bonusSkillIds.map((bonusSkillId: number) => ({ bonusSkillId })),
          ),
      })
      .then(requireDatabaseRow);
  });
  const contacts = await enrichContactsWithNames(
    updated.contacts.map(({ contact }) => contact),
  );

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    quizInstructions: updated.quizInstructions,
    duration: updated.duration ?? 1,
    thumb: updated.thumb
      ? Buffer.from(updated.thumb as any).toString("base64")
      : null,
    contacts,
    skills: updated.bonusSkills.map(({ bonusSkill }) => bonusSkill),
  };
}

export default putModule;
