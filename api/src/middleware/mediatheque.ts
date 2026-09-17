import { type Response, type NextFunction } from "express";
import { prisma } from "../utils/db.ts";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

export default function mediatheque(type: string) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.file) {
      try {
        const user = await prisma.orm.public.Admin.where({
          idMdb: req.auth!.userId,
        }).first();
        if (!user)
          throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

        await prisma.orm.public.Mediatheque.create({
          type,
          name: req.file.originalname,
          url: req.file.filename,
          author: (relation) => relation.connect({ id: user.id }),
          size: req.file.size,
          used: 1,
        });
      } catch (error: any) {
        const message =
          error.message ||
          "Une erreur est survenue lors de l'enregistrement du fichier.";
        return res.status(500).json({ message });
      }
    }
    next();
  };
}
