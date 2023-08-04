import express from "express";
import { body, param, query } from "express-validator";

import isUser from "../../../middleware/is-user";
import { getAllValidator, userValidator } from "../../../middleware/validators";
import httpCreateUser from "../../../controllers/user/http-create-user";
import httpUpdateUserRoles from "../../../controllers/user/http-update-user-roles";
import httpSearchUser from "../../../controllers/user/http-search-user";
import httpGetUsersByRole from "../../../controllers/user/http-get-users-by-role";
import httpGetUsersStats from "../../../controllers/user/http-get-users-stats";
import httpUpdateUserStatus from "../../../controllers/user/http-update-user";
import httpUpdateManyUsersStatus from "../../../controllers/user/http-update-many-users-status";
import httpGetContacts from "../../../controllers/user/http-get-contacts";
import postTeacherRouter from "./post-teacher";

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
  param("search").isAlpha().notEmpty().trim().escape(),
  param("role").isAlpha().notEmpty().trim().escape(),
  param("entity").isAlpha().notEmpty().trim().escape(),
  param("value").isAlpha().notEmpty().trim().escape(),
  param("stype").isAlpha().notEmpty().trim().escape(),
  param("sdir").isAlpha().notEmpty().trim().escape(),
  query("page").notEmpty().trim().escape().isInt(),
  query("limit").notEmpty().trim().escape().isInt(),

  httpSearchUser
);
userRouter.use("/new-teacher", postTeacherRouter);

userRouter.get("/contacts", httpGetContacts);

export default userRouter;