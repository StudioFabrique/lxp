import express from "express";
import { body, param, query } from "express-validator";

import isUser from "../../../middleware/is-admin";
import {
  getAllValidator,
  manyUsersValidator,
  userValidator,
} from "../../../middleware/validators";
import httpCreateUser from "../../../controllers/user/http-create-user";
import httpUpdateUserRoles from "../../../controllers/user/http-update-user-roles";
import httpSearchUser from "../../../controllers/user/http-search-user";
import httpGetUsersByRole from "../../../controllers/user/http-get-users-by-role";
import httpGetUsersStats from "../../../controllers/user/http-get-users-stats";
import httpUpdateUserStatus from "../../../controllers/user/http-update-user";
import httpUpdateManyUsersStatus from "../../../controllers/user/http-update-many-users-status";
import httpGetContacts from "../../../controllers/user/http-get-contacts";
import postTeacherRouter from "./post-teacher";
import httpCreateManyUser from "../../../controllers/user/http-create-many-users";
import checkToken from "../../../middleware/check-token";
import httpGetUsersByGroup from "../../../controllers/user/http-get-users-by-group";
import checkPermissions from "../../../middleware/check-permissions";

const userRouter = express.Router();

// TODO: VALIDATORS
userRouter.put(
  "/update-many-status",
  checkPermissions(1, "user"),
  httpUpdateManyUsersStatus
);

// TODO: VALIDATORS
userRouter.put(
  "/update-user-status",
  checkPermissions(1, "user"),
  httpUpdateUserStatus
);

// TODO: VALIDATORS
userRouter.get("/stats", checkPermissions(1, "user"), httpGetUsersStats);

//  récupération de la liste des utilisateurs en fonction de leur rôle principal
userRouter.get(
  "/:role/:stype/:sdir",
  checkPermissions(1, "user"),
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
  checkPermissions(1, "user"),
  httpUpdateUserRoles
);

userRouter.post(
  "/",
  checkPermissions(1, "user"),
  userValidator,
  httpCreateUser
);

userRouter.post(
  "/many",
  checkPermissions(1, "user"),
  manyUsersValidator,
  httpCreateManyUser
);

userRouter.get(
  "/search/:role/:entity/:value/:stype/:sdir",

  //  validators
  param("search").isString().notEmpty().trim().escape(),
  param("role").isString().notEmpty().trim().escape(),
  param("entity").isString().notEmpty().trim().escape(),
  param("value").isString().notEmpty().trim().escape(),
  param("stype").isString().notEmpty().trim().escape(),
  param("sdir").isString().notEmpty().trim().escape(),
  query("page").notEmpty().trim().escape().isInt(),
  query("limit").notEmpty().trim().escape().isInt(),
  checkPermissions(1, "user"),
  httpSearchUser
);
userRouter.use("/new-teacher", checkPermissions(1, "user"), postTeacherRouter);

userRouter.get(
  "/contacts",
  checkPermissions(1, "user"),
  // checkToken,
  httpGetContacts
);

userRouter.post(
  "/group",
  checkPermissions(1, "user"),
  // checkToken,
  httpGetUsersByGroup
);

export default userRouter;
