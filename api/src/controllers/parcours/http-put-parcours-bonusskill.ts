import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import putParcoursSkills from "../../models/parcours/put-parcours-skills";

/**
 * Contrôleur pour mettre à jour les compétences bonus d'un parcours
 * @param req Requête HTTP contenant l'ID du parcours et la compétence à ajouter
 * @param res Réponse HTTP
 * @returns Réponse avec les compétences mises à jour ou message d'erreur
 */
async function httpPutParcoursSkill(req: Request, res: Response) {
  // Vérifie si la requête est valide
  const result = validationResult(req);

  // Retourne une erreur 400 si la requête n'est pas valide
  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    // Récupère l'ID du parcours et la compétence depuis le corps de la requête
    const { parcoursId, skill } = req.body;

    // Appelle le modèle pour mettre à jour les compétences
    const response = await putParcoursSkills(parseInt(parcoursId), skill);

    // Retourne les compétences mises à jour avec un statut 201 (Created)
    return res.status(201).json({ success: true, skills: response });
  } catch (error: any) {
    // En cas d'erreur, retourne un statut 500 avec le message d'erreur
    return res.status(500).json({ message: error.message });
  }
}

export default httpPutParcoursSkill;
