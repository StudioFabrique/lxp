import { Request, Response } from "express";
import { Readable } from "stream";
import getCourseById from "../../models/course/get-course-by-id";
import dotenv from "dotenv";
import CustomRequest from "../../utils/interfaces/express/custom-request";

dotenv.config();

/**
 * GET /quiz/course/ending/stream/:courseId
 * Récupérer un set de quiz généré par IA (5 questions) pour une fin de cours sous forme de stream
 * - courseId sera utilisé pour contextualiser les questions du quiz (le titre du cours, quelles sont les notions abordées dans le cours, etc.)
 */
export default async function httpGetEndingCourseQuizStream(
  req: CustomRequest,
  res: Response,
) {
  const { courseId } = req.params;
  const { userId } = req.auth ?? {}; // Récupération de l'identifiant utilisateur issu du token

  try {
    const course = await getCourseById(+courseId);

    if (!course) {
      return res.status(404).json({ error: "Cours introuvable" });
    }

    // Construction du payload aligné avec la documentation de l'API IA
    const quizzesRequestPayload = {
      course_name: course.title,
      activity_content: course.content,
      model: "ministral-14b-2512",
      profile: {
        user_id: userId ? String(userId) : undefined,
        course_id: String(courseId),
        // Plus tard ajouter : experience_label, weak_concepts, etc.
      },
    };

    // Appel de l'API externe avec le fetch natif de Node
    const response = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/quiz/generate/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(quizzesRequestPayload),
      },
    );

    if (!response.ok) {
      throw new Error(`Erreur API externe: ${response.statusText}`);
    }

    // Préparation de la réponse Express pour du streaming
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    // Conversion du stream Web (fetch) en stream Node et envoi au client
    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(res);
  } catch (error) {
    console.error("Erreur backend lors du proxy stream:", error);
    res
      .status(500)
      .json({ error: "Impossible de joindre l'API de génération" });
  }
}
