import type { NextFunction, Response } from "express";

import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

export default function checkRoleRank(
  allowedRanks: readonly number[],
  message = "Cette opération est réservée aux administrateurs.",
) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ message: "Session absente" });
    if (!allowedRanks.includes(req.auth.userRoles[0]?.rank ?? 4)) {
      return res.status(403).json({ message });
    }
    next();
  };
}
