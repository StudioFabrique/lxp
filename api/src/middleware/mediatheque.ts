import { Response, NextFunction } from "express";
import { prisma } from "../utils/db";
import CustomRequest from "../utils/interfaces/express/custom-request";

export default async function mediatheque(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  console.log("HELLO MIDDLEWARE");

  if (req.file) {
    console.log("FILE SPOTTED");

    try {
      const user = await prisma.admin.findFirst({
        where: {
          idMdb: req.auth!.userId,
        },
      });
      if (!user)
        throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
      await prisma.mediatheque.create({
        data: {
          type: "image",
          name: req.file.originalname,
          url: req.file.filename,
          author: { connect: { id: user!.id } },
          size: req.file.size,
          used: 1,
        },
      });
    } catch (error: any) {
      const message =
        error.message ||
        "Une erreur est survenue lors de l'enregistrement de l'image dans la base de données";
      return res.status(500).json({ message });
    }
  }
  next();
}
