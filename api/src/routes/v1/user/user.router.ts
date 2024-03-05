import express from "express";
import { body, param, query } from "express-validator";
import path from "path";

import {
  getAllByRankValidator,
  manyUsersValidator,
  userValidator,
} from "../../../middleware/validators";
import httpCreateUser from "../../../controllers/user/http-create-user";
import httpUpdateUserRoles from "../../../controllers/user/http-update-user-roles";
import httpSearchUser from "../../../controllers/user/http-search-user";
import httpGetUsersByRole from "../../../controllers/user/http-get-users-by-role";
import httpGetUsersStats from "../../../controllers/user/http-get-users-stats";
import httpUpdateUserStatus from "../../../controllers/user/http-update-user-status";
import httpUpdateManyUsersStatus from "../../../controllers/user/http-update-many-users-status";
import httpGetContacts from "../../../controllers/user/http-get-contacts";
import postTeacherRouter from "./post-teacher";
import httpCreateManyUser from "../../../controllers/user/http-create-many-users";
import httpGetUsersByGroup from "../../../controllers/user/http-get-users-by-group";
import checkPermissions from "../../../middleware/check-permissions";
import httpGetUsersByRank from "../../../controllers/user/http-get-users-by-rank";
import multer from "multer";
import userProfileRouter from "./profile/user-profile.router";
import hobbyRouter from "./hobby/hobby.router";
import { getUsersByRoleValidator } from "./user-validators";
import { paginationValidator } from "../../../helpers/custom-validators";
import httpGetUserLastParcours from "../../../controllers/user/http-get-user-last-parcours";
import httpGetUserData from "../../../controllers/user/http-get-user-data";
import httpGetAccomplishements from "../../../controllers/user/accomplishment/http-get-accomplishments";
import httpGetLastFeedback from "../../../controllers/user/feedback/http-get-own-feedback";
import httpGetLastFeedbacks from "../../../controllers/user/feedback/http-get-last-feedbacks";

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "..", "..", "uploads"));
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      const newFileName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
      cb(null, file.fieldname + "-" + newFileName);
    } else {
      return;
    }
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } });

// TODO: VALIDATORS
userRouter.put(
  "/update-many-status",
  checkPermissions("user"),
  httpUpdateManyUsersStatus
);

// TODO: VALIDATORS
userRouter.put(
  "/update-user-status",
  checkPermissions("user"),
  httpUpdateUserStatus
);

// TODO: VALIDATORS
userRouter.get("/stats", checkPermissions("user"), httpGetUsersStats);

//  récupération de la liste des utilisateurs en fonction de leur rôle principal
userRouter.get(
  "/:role/:stype/:sdir",
  checkPermissions("user"),
  getUsersByRoleValidator,
  paginationValidator,
  httpGetUsersByRole
);

//  récupération de la liste des utilisateurs en fonction de leur rang de leur rôle
userRouter.get(
  "/byRank/:rank/:stype/:sdir",
  checkPermissions("user"),
  getAllByRankValidator,
  httpGetUsersByRank
);

userRouter.put(
  "/user-roles",
  checkPermissions("user"),
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
  httpUpdateUserRoles
);

userRouter.post(
  "/",
  checkPermissions("user"),
  upload.single("image"),
  userValidator(
    body("user.roleId")
      .exists()
      .notEmpty()
      .isString()
      .trim()
      .escape()
      .withMessage("firstname ou lastname non conforme")
  ),
  httpCreateUser
);

userRouter.post(
  "/many",
  checkPermissions("user"),
  manyUsersValidator,
  httpCreateManyUser
);

userRouter.get(
  "/search/:role/:entity/:value/:stype/:sdir",
  checkPermissions("user"),
  //  validators
  param("search").isString().notEmpty().trim().escape(),
  param("role").isString().notEmpty().trim().escape(),
  param("entity").isString().notEmpty().trim().escape(),
  param("value").isString().notEmpty().trim().escape(),
  param("stype").isString().notEmpty().trim().escape(),
  param("sdir").isString().notEmpty().trim().escape(),
  query("page").notEmpty().trim().escape().isInt(),
  query("limit").notEmpty().trim().escape().isInt(),

  httpSearchUser
);

userRouter.use("/new-teacher", checkPermissions("user"), postTeacherRouter);

userRouter.get(
  "/contacts",
  checkPermissions("user"),
  // checkToken,
  httpGetContacts
);

// Rechercher des groupes en fonctions d'une liste d'ids de groupes passé en body et populate les users
userRouter.post(
  "/group",
  checkPermissions("user"),
  // checkToken,
  httpGetUsersByGroup
);

userRouter.use("/profile", checkPermissions("default"), userProfileRouter);

userRouter.use("/hobby", checkPermissions("default"), hobbyRouter);

// retourne les deux derniers parcours auquel l'utilisateur participe en tant que contact
userRouter.get(
  "/last-parcours",
  checkPermissions("parcours"),
  httpGetUserLastParcours
);

// retourne les informations d'un utilisateur ainsi que ses rôles et son temps de connexion
userRouter.get("/data/:userId", checkPermissions("user"), httpGetUserData);

userRouter.get(
  "/own-feedback",
  checkPermissions("default"),
  httpGetLastFeedback
);

// réceupère les accomplissements de tous les autres étudiants étant dans le même groupe que l'étudiant connnecté.
userRouter.get(
  "/accomplishment",
  checkPermissions("default"),
  httpGetAccomplishements
);

// retourne la liste des derniers feedbacks enregistrés
userRouter.get(
  "/last-feedbacks/:notReviewed",
  checkPermissions("default"),
  httpGetLastFeedbacks
);

export default userRouter;
