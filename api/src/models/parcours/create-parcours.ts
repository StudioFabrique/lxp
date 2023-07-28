import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createParcours(parcours: any /* userId: string */) {
  //  DEV ONLY
  const admin = 1;

  // récupération de l'identifiant de l'utilisateur qui effectue la requête
  /*   const admin = await prisma.admin.findFirst({
    where: {
      idMdb: userId,
    },
  }); */

  /*   // vérification de l'existence du créateur du parcours dans la bdd
  if (!admin) {
    throw new Error(`Owner with idMdb ${userId} not found.`);
  } */

  // conversion de l'image en donnée enregistrable sous forme de Blob dans la bdd
  //const imageBuffer = Buffer.from(parcours.image.split(",")[1], "base64");

  // mise à jour de l'objet parcours avec le Blob
  const newParcours = { ...parcours, admin };
  //newParcours.image = imageBuffer;

  /* {
    title: parcours.title,
    description: parcours.description,
    degree: parcours.degree,
    startDate: new Date(parcours.startDate),
    endDate: new Date(parcours.endDate),
    image: imageBuffer,
    admin: admin.id,
    formation: 1,
  }; */

  // on récupère les ids des contacts auprès de la bdd sql
  /*   const contacts = (
    await prisma.contact.findMany({
      where: {
        idMdb: {
          in: parcours.contacts,
        },
      },
    })
  ).map((item) => item.id); */

  try {
    const storedParcours = await prisma.parcours.create({
      data: {
        ...newParcours,
        /* tags: {
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
        }, */
        admin: {
          connect: { id: newParcours.admin },
        },
        formation: {
          connect: { id: newParcours.formation },
        },
      },
    });
    return storedParcours;
  } catch (error) {
    throw new Error("Un parcours avec ce titre existe déjà");
  }

  /* sync function updateParcours(newParcours: any, existingParcours: any) {
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
          create: contacts.map((contact: any) => {
            return {
              contact: {
                connect: { id: contact },
              },
            };
          }),
        },
        admin: {
          connect: { id: newParcours.admin },
        },
        formation: {
          connect: { id: 1 },
        },
      },
    });
    return updatedParcours;
  } */
}

export default createParcours;
