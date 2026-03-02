import { Request, Response } from "express";
import { Readable } from "stream";
import getCourseById from "../../models/course/get-course-by-id";

/**
 * Récupérer un set de quiz généré par IA (5 questions) pour une fin de cours sous forme de stream : GET /quiz/course/ending/stream/:courseId
 * - courseId sera utilisé pour contextualiser les questions du quiz (le titre du cours ,quelles sont les notions abordées dans le cours, etc..)
 *
 * L'endpoint doit répondre en streamant les questions une par une au fur et à mesure de leur génération par l'IA.
 */
export default async function httpGetEndingCourseQuizStream(
  req: Request,
  res: Response,
) {
  const { courseId } = req.params;

  try {
    const course = await getCourseById(+courseId);

    if (!course) {
      return res.status(404).json({ error: "Cours introuvable" });
    }

    const quizzesRequestPayload = {
      course_name: course.title,
      activity_content: course.content,
      max_per_level: 3,
    };

    // Appel de l'API externe avec le fetch natif de Node
    const response = await fetch(
      `https://${process.env.DOCKER_IA_API_BASE_URL}/quiz/generate/stream`,
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
    // Readable.fromWeb est disponible à partir de Node.js 17/18
    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(res);
  } catch (error) {
    console.error("Erreur backend lors du proxy stream:", error);
    res
      .status(500)
      .json({ error: "Impossible de joindre l'API de génération" });
  }
}
