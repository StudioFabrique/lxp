import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";
import { getUnsplashPresentationImage } from "../../helpers/unsplash-presentation-image";

async function postModule(
  moduleToAdd: any,
  thumb: Buffer | string | null,
  image: Buffer | string | null,
  userId: string,
) {
  if (!moduleToAdd.parcoursId) {
    throw {
      statusCode: 400,
      message: "Un parcours est obligatoire pour créer un module.",
    };
  }

  const [parcours, user, admin] = await Promise.all([
    prisma.parcours.findUnique({
      where: { id: +moduleToAdd.parcoursId },
      include: {
        formation: true,
        contacts: { select: { contactId: true } },
        bonusSkills: { select: { id: true } },
      },
    }),
    User.findById(userId, { firstname: 1, lastname: 1 }),
    prisma.admin.findFirst({ where: { idMdb: userId } }),
  ]);

  if (!parcours) throw { statusCode: 404, message: "Parcours introuvable." };
  if (parcours.formationId !== +moduleToAdd.formationId) {
    throw {
      statusCode: 400,
      message: "Le parcours n'appartient pas à la formation sélectionnée.",
    };
  }
  if (!user || !admin) {
    throw { statusCode: 404, message: "Administrateur introuvable." };
  }

  const contactIds = [...new Set<number>(moduleToAdd.contacts ?? [])];
  const skillIds = [...new Set<number>(moduleToAdd.skills ?? [])];
  const allowedContactIds = new Set(
    parcours.contacts.map(({ contactId }) => contactId),
  );
  const allowedSkillIds = new Set(parcours.bonusSkills.map(({ id }) => id));
  if (
    contactIds.some((id) => !allowedContactIds.has(id)) ||
    skillIds.some((id) => !allowedSkillIds.has(id))
  ) {
    throw {
      statusCode: 400,
      message:
        "Les contacts et compétences doivent appartenir au parcours sélectionné.",
    };
  }

  const duplicate = await prisma.module.findFirst({
    where: {
      parcours: { formationId: parcours.formationId },
      title: { equals: moduleToAdd.title.trim(), mode: "insensitive" },
    },
    select: { id: true },
  });
  if (duplicate) {
    throw { statusCode: 406, message: "MODULE_ALREADY_EXISTS" };
  }

  const defaultImage = image
    ? null
    : await getUnsplashPresentationImage(moduleToAdd.title);
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

  const created = await prisma.module.create({
    data: {
      title: moduleToAdd.title.trim(),
      description: moduleToAdd.description,
      quizInstructions: moduleToAdd.quizInstructions,
      duration: moduleToAdd.duration ?? 0,
      image: imageBytes as Uint8Array<ArrayBuffer> | null,
      thumb: thumbBytes as Uint8Array<ArrayBuffer> | null,
      author: `${user.firstname} ${user.lastname}`,
      adminId: admin.id,
      parcoursId: parcours.id,
      contacts: {
        create: contactIds.map((contactId: number) => ({
          contact: { connect: { id: contactId } },
        })),
      },
      bonusSkills: {
        create: skillIds.map((skillId: number) => ({
          bonusSkill: { connect: { id: skillId } },
        })),
      },
    },
    include: {
      contacts: { include: { contact: true } },
      bonusSkills: { include: { bonusSkill: true } },
    },
  });

  return {
    ...created,
    thumb: created.thumb
      ? Buffer.from(created.thumb as any).toString("base64")
      : null,
    image: undefined,
    contacts: created.contacts.map(({ contact }) => contact),
    skills: created.bonusSkills.map(({ bonusSkill }) => bonusSkill),
  };
}

export default postModule;
