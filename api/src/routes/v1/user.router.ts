import express from "express";
import { body, param, query } from "express-validator";

import isUser from "../../middleware/is-user";
import { getAllValidator, userValidator } from "../../middleware/validators";
import httpCreateUser from "../../controllers/user/http-create-user";
import httpUpdateUserRoles from "../../controllers/user/http-update-user-roles";
import httpSearchUser from "../../controllers/user/http-search-user";
import httpGetUsersByRole from "../../controllers/user/http-get-users-by-role";
import httpGetUsersStats from "../../controllers/user/http-get-users-stats";
import httpUpdateUserStatus from "../../controllers/user/http-update-user";
import httpUpdateManyUsersStatus from "../../controllers/user/http-update-many-users-status";

const userRouter = express.Router();

// TODO: VALIDATORS
userRouter.put("/update-many-status", isUser, httpUpdateManyUsersStatus);

// TODO: VALIDATORS
userRouter.put("/update-user-status", isUser, httpUpdateUserStatus);

// TODO: VALIDATORS
userRouter.get("/stats", isUser, httpGetUsersStats);

//  récupération de la liste des utilisateurs en fonction de leur rôle principal
userRouter.get(
  "/:role/:stype/:sdir",
  //  vérification du token et récupération du rôle de l'utilisateur
  isUser,

  getAllValidator,
  httpGetUsersByRole
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
