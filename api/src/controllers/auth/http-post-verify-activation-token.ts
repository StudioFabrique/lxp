import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Role from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";

export default async function httpPostVerifyActivationToken(
  req: Request,
  res: Response,
) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Un token est requis." });
    }

    let data: any;
    try {
      data = jwt.verify(token.toString(), process.env.REGISTER_SECRET!);
    } catch {
      return res
        .status(401)
        .json({ message: "Le token est invalide ou a expiré." });
    }

    if (data.purpose !== "first-admin") {
      return res
        .status(401)
        .json({ message: "Le token n'est pas valide pour cette opération." });
    }

    const adminRole = await Role.findOne({ role: "admin" });
    if (!adminRole) {
      return res.status(200).json({ valid: true });
    }

    const adminCount = await User.countDocuments({
      roles: adminRole._id,
      isActive: true,
    });

    if (adminCount > 0) {
      return res.status(400).json({
        message:
          "Un administrateur existe déjà. Ce token n'est plus valide.",
      });
    }

    return res.status(200).json({ valid: true });
  } catch {
    return res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la vérification." });
  }
}
