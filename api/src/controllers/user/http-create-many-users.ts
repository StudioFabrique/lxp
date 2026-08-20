import { type Request, type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import createManyUsers from "../../models/user/create-many-users.ts";

/**
 * Compte rendu de l'import : le silence sur les lignes écartées était le
 * problème principal. Un fichier entièrement composé de doublons se soldait
 * par « étudiants enregistrés », sans que rien n'ait été créé.
 */
function importSummary({
  createdCount,
  alreadyExistingCount,
  invalidCount,
}: {
  createdCount: number;
  alreadyExistingCount: number;
  invalidCount: number;
}) {
  const parts: string[] = [];

  parts.push(
    createdCount === 0
      ? "Aucun nouvel utilisateur créé"
      : `${createdCount} utilisateur${createdCount > 1 ? "s" : ""} créé${
          createdCount > 1 ? "s" : ""
        }`,
  );

  if (alreadyExistingCount > 0) {
    parts.push(
      `${alreadyExistingCount} adresse${
        alreadyExistingCount > 1 ? "s" : ""
      } email déjà enregistrée${alreadyExistingCount > 1 ? "s" : ""}`,
    );
  }

  if (invalidCount > 0) {
    parts.push(
      `${invalidCount} ligne${invalidCount > 1 ? "s" : ""} sans adresse email`,
    );
  }

  return `${parts.join(", ")}.`;
}

export default async function httpCreateManyUser(req: Request, res: Response) {
  const users = req.body;

  try {
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: badQuery });
    }

    const response = await createManyUsers(users, 3);

    return res.status(201).json({
      message: importSummary(response),
      usersCreated: response.users,
      createdCount: response.createdCount,
      alreadyExistingCount: response.alreadyExistingCount,
      invalidCount: response.invalidCount,
    });
  } catch (error: any) {
    return res
      .status(error?.statusCode ?? 500)
      .json({ message: error?.statusCode ? error.message : serverIssue });
  }
}
