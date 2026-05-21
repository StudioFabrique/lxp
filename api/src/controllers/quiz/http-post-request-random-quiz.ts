import { Request, Response } from "express";
import dotenv from "dotenv";
import CustomRequest from "../../utils/interfaces/express/custom-request";

dotenv.config();

/**
 * POST /quiz/random
 * Récupérer dans le body :
 * - content : une valeur de type texte sans aucune balise.
 * - past_questions : historique optionnel renvoyé par le client pour éviter les doublons
 *
 * Appelle l'API du docker IA en encapsulant le profil de l'utilisateur connecté
 */
export default async function httpPostRequestRandomQuiz(
  req: CustomRequest,
  res: Response,
) {
  try {
    const {
      content,
      temperature = 0.7,
      toxicity_threshold = 0.6,
      max_attempts = 4,
      past_questions = [],
    } = req.body;

    // Récupération sécurisée du userId
    const { userId } = req.auth ?? {};

    // Préparation du payload pour l'API de l'IA
    const iaPayload: Record<string, any> = {
      content,
      temperature,
      toxicity_threshold,
      max_attempts,
      past_questions,
    };

    if (userId) {
      iaPayload.profile = {
        user_id: String(userId),
      };
    }

    console.log(
      `Appel de l'API IA : ${process.env.DOCKER_IA_API_BASE_URL}/quiz/random`,
    );

    // Appel de l'API externe
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

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur backend lors du proxy /quiz/random :", error);
    return res
      .status(500)
      .json({ error: "Impossible de joindre l'API de génération IA." });
  }
}
