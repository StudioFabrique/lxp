import { type Request, type Response } from "express";
import getLessonsStats from "../../models/stats/get-lessons-stats.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpGetLessonsStats(req: Request, res: Response) {
  try {
    const response = await getLessonsStats();
    return res.status(200).json({
      message: response.length === 0 ? "Aucune stats pour les leçons." : "",
      success: true,
      response,
    });
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
