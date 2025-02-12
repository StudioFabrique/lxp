import { prisma } from "../../../utils/db";
import CustomRequest from "../../../utils/interfaces/express/custom-request";

export default async function putAddResource(req: CustomRequest) {
  // Récupération des fichiers uploadés
  const uploadedFiles = req.files as Express.Multer.File[];
  if (!uploadedFiles || uploadedFiles.length === 0)
    throw { statusCode: 400, message: "Aucun fichier n'a été envoyé" };

  const { data } = req.body;
  const { activityId } = req.params;
  const userId = req.auth?.userId;

  const existingActivity = await prisma.activity.findFirst({
    where: { id: +activityId },
    select: { id: true, authorId: true, resourceActivities: true },
  });

  if (!existingActivity)
    throw { statusCode: 404, message: "L'activité n'existe pas." };

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  if (existingActivity.authorId !== existingAuthor.id)
    throw {
      statusCode: 406,
      message: "Vous n'êtes pas le propriétaire de la ressource.",
    };

  // Tableau pour stocker les nouvelles ressources
  let newResources: { label: string; url: string }[] = [];

  // Association des fichiers uploadés avec leurs métadonnées
  for (const resource of data) {
    const file = uploadedFiles.find(
      (file) => file.originalname === resource.filename
    );
    if (file) {
      newResources = [
        ...newResources,
        { label: resource.label, url: file.filename },
      ];
    }
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const updatedActivity = await prisma.activity.update({
      where: { id: +activityId },
      data: {
        resourceActivities: {
          create: newResources.map((resource, index) => ({
            label: resource.label,
            url: resource.url,
            order: existingActivity.resourceActivities.length + index,
          })),
        },
      },
    });

    console.log({ data });

    for (const resource of data) {
      const file = uploadedFiles.find(
        (file) => file.originalname === resource.filename
      );

      if (file) {
        console.log("step");

        await tx.mediatheque.create({
          data: {
            type: "resource",
            name: resource.filename,
            url: file.filename,
            size: file.size,
            used: 1,
            author: {
              connect: { id: existingAuthor.id },
            },
          },
        });
      }
    }
  });

  return;
}
