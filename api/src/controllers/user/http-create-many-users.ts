import { Request, Response } from "express";
import { alreadyExist, creationSuccessfull } from "../../utils/constantes";
import { serverIssue } from "../../utils/constantes";
import { IUser } from "../../utils/interfaces/db/user";
import createManyUsers from "../../models/user/create-many-users";

export default async function httpCreateManyUser(req: Request, res: Response) {
  let users = req.body;

  /* users.roles = [new Object((await Role.findOne({ role: "student" }))!._id)]; */

  users = users.map((user: any) => ({
    ...user,
    firstname: user.firstname.toLowerCase(),
    lastname: user.lastname.toLowerCase(),
    nickname: user.nickname?.toLowerCase(),
  }));

  try {
    const response = await createManyUsers(users);

    if (response) {
      return res
        .status(201)
        .json({ message: creationSuccessfull, usersCreated: response });
    }

    res.status(409).json({ message: alreadyExist });
    return;
  } catch (e) {
    res.status(500).json({ message: serverIssue + e });
  }
}
