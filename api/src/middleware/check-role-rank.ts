import type { NextFunction, Response } from "express";

import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

export default function checkRoleRank(allowedRanks: readonly number[]) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ message: "Session absente" });
    if (!req.auth.userRoles.some(({ rank }) => allowedRanks.includes(rank))) {
      return res.status(403).json({
        message: "Cette opération est réservée aux administrateurs.",
      });
    }
    next();
  };
}
