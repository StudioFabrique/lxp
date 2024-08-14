import { Request, Response } from "express";
import { alreadyExist, creationSuccessfull } from "../../utils/constantes";
import { serverIssue } from "../../utils/constantes";
import createManyUsers from "../../models/user/create-many-users";

export default async function httpCreateManyUser(req: Request, res: Response) {
  let users = req.body;

  /* users.roles = [new Object((await Role.findOne({ role: "student" }))!._id)]; */

  try {
    const response = await createManyUsers(users, 3);

    return res
      .status(201)
      .json({ message: creationSuccessfull, usersCreated: response });
  } catch (e) {
    res.status(500).json({ message: serverIssue + e });
  }
}
