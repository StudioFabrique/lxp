import express, { Response } from "express";

import httpGetAllUsers from "../../controllers/user/admin-teacher/httpGetAllUsers";
import { param, query } from "express-validator";
import ac from "../../utils/services/permissions/accessControl";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import isUser from "../../middleware/is-user";

const userRouter = express.Router();

//  récupération de la liste des utilisateurs
userRouter.get(
  "/:role/:stype/:sdir",

  //  vérification du token et récupération du rôle de l'utilisateur
  isUser,

  //  vérification des permissions
  (req: CustomRequest, res: Response, next) => {
    const permission = ac.can(req.auth!.userRoles[0]).readAny("user");
    if (permission.granted) {
      next();
    } else {
      return res.status(403).json({ message: "dans le cul lulu" });
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
