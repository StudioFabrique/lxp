import { Request, Response } from "express";

export default async function httpAddUserGroup(req: Request, res: Response) {
  const { groupValidator, usersId } = req.body;
}
