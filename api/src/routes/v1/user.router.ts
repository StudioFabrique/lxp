import express from "express";

import httpGetAllUsers from "../../controllers/user/http-get-all-users";
import { body, param, query } from "express-validator";
import isUser from "../../middleware/is-user";
import httpUpdateStudentRoles from "../../controllers/user/http-update-student-roles";
import { getAllValidator, userValidator } from "../../middleware/validators";
import httpCreateUser from "../../controllers/user/http-create-user";
import httpUpdateUserRoles from "../../controllers/user/http-update-user-roles";
import httpSearchUser from "../../controllers/user/http-search-user";

const userRouter = express.Router();

//  récupération de la liste des utilisateurs en fonction de leur rôle principal
userRouter.get(
  "/:role/:stype/:sdir",

  //  vérification du token et récupération du rôle de l'utilisateur
  isUser,
  /* 
  //  vérification des permissions
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (await hasPermission(req.auth!.userRoles[0], "read", "user")) {
      next();
    } else {
      return res.status(400).json({ message: noAccess });
    }
  }, */

  getAllValidator,
  httpGetAllUsers
);

userRouter.put(
  "/user-roles",
  // validators
  body("usersToUpdate")
    .isArray()
    .notEmpty()
    .withMessage("Le tableau studentsToUpdate ne peut pas être vide."),
  body("usersToUpdate.*")
    .isString()
    .withMessage(
      "Chaque élément de studentsToUpdate doit être une chaîne de caractères."
    )
    .trim()
    .escape(),
  body("rolesId")
    .isArray()
    .notEmpty()
    .withMessage("Le tableau rolesId ne peut pas être vide."),
  body("rolesId.*")
    .isString()
    .withMessage(
      "Chaque élément de rolesId doit être une chaîne de caractères."
    )
    .trim()
    .escape(),
  isUser,
  httpUpdateUserRoles
);

userRouter.post("/", isUser, userValidator, httpCreateUser);

userRouter.get(
  "/search/:role/:entity/:value/:stype/:sdir",

  //  validators
  param("search").isString().trim().escape(),
  param("role").isString().trim().escape(),
  param("entity").isString().trim().escape(),
  param("value").isString().trim().escape(),
  param("stype").isString().trim().escape(),
  param("sdir").isString().trim().escape(),
  query("page").trim().escape().isInt(),
  query("limit").trim().escape().isInt(),

  httpSearchUser
);

export default userRouter;
