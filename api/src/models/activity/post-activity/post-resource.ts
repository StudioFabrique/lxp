import { prisma } from "../../../utils/db";
import CustomRequest from "../../../utils/interfaces/express/custom-request";

export default async function postActivityResource(req: CustomRequest) {
  // Récupération des fichiers uploadés
  const uploadedFiles = req.files as Express.Multer.File[];
  if (!uploadedFiles || uploadedFiles.length === 0)
    throw { statusCode: 400, message: "Aucun fichier n'a été envoyé" };

  // Extraction des données de la requête
  const { data } = req.body;
  const { lessonId } = req.params;
  const userId = req.auth?.userId;

  console.log({ data });

  // Vérification de la cohérence entre les fichiers et les données
  if (data.length !== uploadedFiles.length)
    throw {
      statusCode: 400,
      message:
        "Le nombre de fichiers envoyés ne correspond pas au nombre de ressources",
    };

  // Recherche de la leçon existante
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: +lessonId },
    select: { id: true, title: true, activities: true },
  });

  // Vérification de l'existence de la leçon
  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  // Recherche de l'auteur dans la base de données
  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  // Vérification de l'existence de l'auteur
  if (!existingAuthor) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

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

  let result: any = {};

  const transaction = await prisma.$transaction(async (tx) => {
    // Création d'une nouvelle activité de type ressource
    const newActivity = await tx.activity.create({
      data: {
        title: "Ressources",
        lessonId: +lessonId,
        type: "resource",
        order: existingLesson.activities.length,
        url: "",
        authorId: existingAuthor.id,
      },
    });

    // Enregistrement des ressources dans la base de données
    result = await tx.resourceActivity.createMany({
      data: newResources.map((resource, index) => ({
        label: resource.label,
        url: resource.url,
        activityId: newActivity.id,
        order: index,
      })),
    });

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
  return { result };
}
