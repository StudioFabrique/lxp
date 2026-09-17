import type { BonusSkill, Contact } from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getUnsplashPresentationImage } from "../../helpers/unsplash-presentation-image.ts";

async function putModuleParcours(
  module: string,
  thumb: Buffer | string | null,
  image: Buffer | string | null,
  userId: string,
) {
  const input = JSON.parse(module);
  const [parcours, user, admin] = await Promise.all([
    prisma.orm.public.Parcours.where({ id: +input.parcoursId })
      .include("contacts", (related21) =>
        related21.include("contact", (related22) =>
          related22.select("id", "idMdb"),
        ),
      )
      .include("bonusSkills", (related23) => related23.select("id"))
      .first(),
    User.findById(userId, { firstname: 1, lastname: 1 }),
    prisma.orm.public.Admin.where({ idMdb: userId }).first(),
  ]);

  if (!parcours) {
    throw { message: "Le parcours n'existe pas", statusCode: 404 };
  }
  if (!user || !admin) {
    throw { message: "Ressource inexistante", statusCode: 404 };
  }

  if (
    Array.isArray(input.formations) &&
    !input.formations.map(Number).includes(parcours.formationId)
  ) {
    throw {
      message: "Le parcours n'appartient pas à la formation sélectionnée.",
      statusCode: 400,
    };
  }

  const allowedContactIds = new Set(
    parcours.contacts.map(({ contact }) => contact!.idMdb),
  );
  const allowedSkillIds = new Set(parcours.bonusSkills.map(({ id }) => id));
  if (
    (input.contacts ?? []).some(
      (contact: Contact) => !allowedContactIds.has(contact.idMdb),
    ) ||
    (input.bonusSkills ?? []).some(
      (skill: BonusSkill) => !allowedSkillIds.has(skill.id),
    )
  ) {
    throw {
      message:
        "Les contacts et compétences doivent appartenir au parcours sélectionné.",
      statusCode: 400,
    };
  }

  const defaultImage = image
    ? null
    : await getUnsplashPresentationImage(input.title);
  const imageBytes = image
    ? Uint8Array.from(
        typeof image === "string" ? Buffer.from(image, "base64") : image,
      )
    : defaultImage
      ? Uint8Array.from(defaultImage)
      : null;
  const thumbBytes = thumb
    ? Uint8Array.from(
        typeof thumb === "string" ? Buffer.from(thumb, "base64") : thumb,
      )
    : defaultImage
      ? Uint8Array.from(defaultImage)
      : null;

  const created = await prisma.orm.public.Module.create({
    title: input.title,
    description: input.description,
    quizInstructions: input.quizInstructions,
    duration: +input.duration,
    minDate: input.minDate ? new Date(input.minDate).toISOString() : null,
    maxDate: input.maxDate ? new Date(input.maxDate).toISOString() : null,
    image: imageBytes as Uint8Array<ArrayBuffer> | null,
    thumb: thumbBytes as Uint8Array<ArrayBuffer> | null,
    author: `${user.firstname} ${user.lastname}`,
    adminId: admin.id,
    parcoursId: parcours.id,
    contacts: (relation) =>
      relation.create(
        (input.contacts ?? []).map((item: Contact) => ({
          contactId: parcours.contacts.find(
            ({ contact }) => contact?.idMdb === item.idMdb,
          )!.contact!.id,
        })),
      ),
    bonusSkills: (relation) =>
      relation.create(
        (input.bonusSkills ?? []).map((item: BonusSkill) => ({
          bonusSkillId: item.id,
        })),
      ),
  });

  return { updatedParcours: parcours, newModule: created };
}

export default putModuleParcours;
