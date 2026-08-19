import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import postContentReadHeartbeat from "../../models/content-read/post-content-read-heartbeat.ts";
import type { ContentType } from "../../config/content-read.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostContentReadHeartbeat(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Session absente ou expirée" });
  }

  try {
    const { type, id } = req.params;

    const contentRead = await postContentReadHeartbeat(
      type as ContentType,
      Number(id),
      userId,
    );

    if (!contentRead) {
      return res.status(204).send();
    }

    return res.status(200).json({ readTimeMs: contentRead.readTimeMs });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
