import { Response, NextFunction } from "express";
import { badQuery } from "../utils/constantes";
import jwt from "jsonwebtoken";

import CustomRequest from "../utils/interfaces/express/custom-request";

export default function activateAccount(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.body;
    console.log({ token });
    if (!token) throw { satusCode: 400, message: badQuery };
    jwt.verify(token, process.env.REGISTER_SECRET!, (err: any, data: any) => {
      if (err) console.log(err.status);
      if (data) {
        console.log("token", data);
        console.log("role", data.userRoles[0].label);
        req.auth = { userId: data.userId, userRoles: data.userRoles };
      }
      next();
    });
  } catch (error: any) {
    console.log({ error });
    return res.status(500).json({ message: "Le lien n'est plus valide." });
  }
}
