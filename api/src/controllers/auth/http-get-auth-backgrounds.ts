import { type Request, type Response } from "express";
import getAuthBackgrounds from "../../models/auth/get-auth-backgrounds.ts";
import { logger } from "../../utils/logs/logger.ts";

export default async function httpGetAuthBackgrounds(req: Request, res: Response) {
  const theme = req.query.theme;
  if (theme !== "light" && theme !== "dark") {
    return res.status(400).json({ message: "Le thème doit être light ou dark." });
  }

  try {
    const photos = await getAuthBackgrounds(theme);
    res.setHeader(
      "Cache-Control",
      "public, max-age=21600, stale-while-revalidate=86400",
    );
    return res.status(200).json({ theme, photos });
  } catch (error) {
    logger.error("Unable to load Unsplash auth backgrounds:", error);
    return res.status(503).json({
      message: "Les images d'arrière-plan sont temporairement indisponibles.",
    });
  }
}
