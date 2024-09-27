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
    const decodedToken = jwt.verify(
      token,
      process.env.REGISTER_SECRET!,
      (err: any, data: any) => {
        if (err) console.log(err);
        if (data) {
          req.auth = { userId: data.userId, userRoles: data.userRoles };
        }
        next();
      },
    );
  } catch (error: any) {
    console.log({ error });
    return res.status(500).json({ message: "dans le cul lulu" });
  }
}
