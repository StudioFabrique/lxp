import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createParcours(parcours: any, userId: string) {
  // récupération de l'identifiant de l'utilisateur qui effectue la requête
  const admin = await prisma.admin.findFirst({
    where: {
      idMdb: userId,
    },
  });

  // vérification de l'existence du créateur du parcours dans la bdd
  if (!admin) {
    throw new Error(`Owner with idMdb ${userId} not found.`);
  }

  // conversion de l'image en donnée enregistrable sous forme de Blob dans la bdd
  const imageBuffer = Buffer.from(parcours.image.split(",")[1], "base64");

  // mise à jour de l'objet parcours avec le Blob
  const newParcours = {
    title: parcours.title,
    description: parcours.description,
    degree: parcours.degree,
    startDate: new Date(parcours.startDate),
    endDate: new Date(parcours.endDate),
    image: imageBuffer,
    admin: admin.id,
    formation: 1,
  };

  // test pour savoir si on met le parcours à jour ou si on en créé un nouveau
  let isParcours = null;
  if (parcours.id) {
    isParcours = await prisma.parcours.findUnique({
      where: { id: parcours.id },
    });
  }

  // on récupère les ids des contacts auprès de la bdd sql
  const contacts = (
    await prisma.contact.findMany({
      where: {
        idMdb: {
          in: parcours.contacts,
        },
      },
    })
  ).map((item) => item.id);

  console.log({ contacts });

  // si le parcours existe pas on le met à jour
  if (isParcours) {
    const response = await updateParcours(newParcours, isParcours);
    return response.id;
    // sinon on en créé un nouveau
  } else {
    const response = await storeParcours(newParcours);
    return response.id;
  }

  async function storeParcours(parcoursToStore: any) {
    const storedParcours = await prisma.parcours.create({
      data: {
        ...parcoursToStore,
        tags: {
          create: parcours.tags.map((tag: any) => {
            return { tagId: parseInt(tag) };
          }),
        },
        contacts: {
          create: contacts.map((contact: any) => {
            return {
              contact: {
                connect: { id: contact },
              },
            };
          }),
        },
        admin: {
          connect: { id: parcoursToStore.admin },
        },
        formation: {
          connect: { id: 1 },
        },
      },
    });
    return storedParcours;
  }

  async function updateParcours(newParcours: any, existingParcours: any) {
    // on supprime les relations avec les tags et les contacts avant de les recréer avec les nouvelles données
    await prisma.tagsOnParcours.deleteMany({
      where: { parcoursId: existingParcours.id },
    });
    await prisma.contactsOnParcours.deleteMany({
      where: { parcoursId: existingParcours.id },
    });
    const updatedParcours = await prisma.parcours.update({
      where: { id: existingParcours.id },
      data: {
        ...newParcours,
        tags: {
          create: parcours.tags.map((tag: any) => {
            return { tagId: parseInt(tag) };
          }),
        },
        contacts: {
          create: contacts.map((teacher: any) => {
            return {
              teacher: {
                connect: { id: teacher },
              },
            };
          }),
        },
      },
    });
    return updatedParcours;
  }
}

export default createParcours;
