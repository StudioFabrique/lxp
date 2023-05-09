import express, { Response } from "express";

import httpGetAllUsers from "../../controllers/user/admin-teacher/httpGetAllUsers";
import { param, query } from "express-validator";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import isUser from "../../middleware/is-user";
import hasPermission from "../../middleware/hasPermission";
import { noAccess } from "../../utils/constantes";

const userRouter = express.Router();

//  récupération de la liste des utilisateurs
userRouter.get(
  "/:role/:stype/:sdir",

  //  vérification du token et récupération du rôle de l'utilisateur
  isUser,

  //  vérification des permissions
  async (req: CustomRequest, res: Response, next) => {
    if (await hasPermission(req.auth!.userRoles[0], "read", "user")) {
      next();
    } else {
      return res.status(400).json({ message: noAccess });
    }
  },

  //  assainissement des données entrantes
  param("role").trim().escape(),
  param("stype").trim().escape(),
  param("sdir").trim().escape(),
  query("page").trim().escape().isInt(),
  query("limit").trim().escape().isInt(),

  httpGetAllUsers
);

export default userRouter;
