import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

/**
 * POST /quiz/random
 * Récupérer dans le body
 * - content : une valeur de type texte sans aucune balise.
 *
 * Appeler l'api du docker IA et envoyer le "content" tout en définissant des constantes (treshold etc..)
 */
export default async function httpPostRequestRandomQuiz(
  req: Request,
  res: Response,
) {
  try {
    // Récupération des paramètres du body selon la documentation "Random Quiz.md"
    const {
      content,
      temperature = 0.7,
      toxicity_threshold = 0.6,
      max_attempts = 4,
      //   profile,
      //   past_questions = [],
    } = req.body;

    // Préparation du payload pour l'API de l'IA
    const iaPayload = {
      content,
      temperature,
      toxicity_threshold,
      max_attempts,
      //   profile,
      //   past_questions,
    };

    console.log(`${process.env.DOCKER_IA_API_BASE_URL}/quiz/random`);

    // Appel de l'API externe (Docker IA) avec le fetch natif de Node
    const response = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/quiz/random`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(iaPayload),
      },
    );

    // Récupération de la réponse JSON renvoyée par l'IA
    const data = await response.json();

    // Gestion des erreurs de l'IA (ex: code 400 si le texte est flaggé comme toxique)
    if (!response.ok) {
      console.error(
        `Erreur API IA au endpoint /quiz/random (${response.status}):`,
        data,
      );
      return res.status(response.status).json(data);
    }

    // Succès : on retourne la question générée avec le "session_meta"
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur backend lors du proxy /quiz/random :", error);
    return res
      .status(500)
      .json({ error: "Impossible de joindre l'API de génération IA." });
  }
}
