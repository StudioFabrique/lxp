import express from "express";
import { body, param, query } from "express-validator";
import path from "path";

import multer from "multer";
import { headerImageMaxSize } from "../../../config/images-sizes";
import httpGetAccomplishements from "../../../controllers/user/accomplishment/http-get-accomplishments";
import httpGetLastFeedbacks from "../../../controllers/user/feedback/http-get-last-feedbacks";
import httpGetLastFeedback from "../../../controllers/user/feedback/http-get-own-feedback";
import httpCreateManyUser from "../../../controllers/user/http-create-many-users";
import httpCreateUser from "../../../controllers/user/http-create-user";
import httpDeleteUser from "../../../controllers/user/http-delete-user";
import httpGetContacts from "../../../controllers/user/http-get-contacts";
import httpGetUserData from "../../../controllers/user/http-get-user-data";
import httpGetUserLastParcours from "../../../controllers/user/http-get-user-last-parcours";
import httpGetUsersByGroup from "../../../controllers/user/http-get-users-by-group";
import httpGetUsersByRank from "../../../controllers/user/http-get-users-by-rank";
import httpGetUsersByRole from "../../../controllers/user/http-get-users-by-role";
import httpGetUsersStats from "../../../controllers/user/http-get-users-stats";
import httpPostCheckActivationToken from "../../../controllers/user/http-post-check-activation-token";
import httpPutInvitation from "../../../controllers/user/http-put-invitation";
import httpPutPassword from "../../../controllers/user/http-put-password";
import httpSearchUser from "../../../controllers/user/http-search-user";
import httpUpdateManyUsersStatus from "../../../controllers/user/http-update-many-users-status";
import httpUpdateUser from "../../../controllers/user/http-update-user";
import httpUpdateUserRoles from "../../../controllers/user/http-update-user-roles";
import httpUpdateUserStatus from "../../../controllers/user/http-update-user-status";
import {
  paginationValidator,
  stringValidateGeneric,
} from "../../../helpers/custom-validators";
import activateAccount from "../../../middleware/activate-account";
import checkPermissions from "../../../middleware/check-permissions";
import { createFileUploadMiddleware } from "../../../middleware/fileUpload";
import jsonParser from "../../../middleware/json-parser";
import {
  getAllByRankValidator,
  manyUsersValidator,
  userValidator,
} from "../../../middleware/validators";
import postTeacherRouter from "./post-teacher";
import userProfileRouter from "./profile/user-profile.router";
import {
  getUsersByRoleValidator,
  postCheckEmailValidator,
  postPasswordValidator,
  tokenValidator,
  updateManyUsersStatusValidator,
  updateUserStatusValidator,
  userIdValidator,
} from "./user-validators";
import httpPutResetPassword from "../../../controllers/user/http-put-reset-password";
import httpPutResetPasswordEmail from "../../../controllers/user/http-put-reset-password-email";
import httpGetConnectedStudentParcoursWithAccomplishements from "../../../controllers/user/accomplishment/http-get-connected-student-parcours-with-accomplishments";
import httpPostManyInvitations from "../../../controllers/user/http-post-many-invitations";
import checkValidation from "../../../middleware/check-validation";
import rateLimiter from "../../../middleware/rate-limiter";
import httpPostHobby from "../../../controllers/user/hobby/http-post-hobby";
import httpDeleteHobby from "../../../controllers/user/hobby/http-delete-hobby";
import httpPostSocialNetwork from "../../../controllers/user/social-network/http-post-social-network";
import httpDeleteSocialNetwork from "../../../controllers/user/social-network/http-delete-social-network";

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

userRouter.put(
  "/update-many-status",
  checkPermissions("user"),
  updateManyUsersStatusValidator,
  httpUpdateManyUsersStatus
);

userRouter.put(
  "/update-user-status",
  checkPermissions("user"),
  updateUserStatusValidator,
  httpUpdateUserStatus
);

userRouter.get("/stats", checkPermissions("user"), httpGetUsersStats);

//  récupération de la liste des utilisateurs en fonction de leur rôle principal
userRouter.get(
  "/list/:role/:stype/:sdir",
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
    .withMessage("Un tableau d'identifiants d'utilisateurs est requis.")
    .custom((arr) => Array.isArray(arr) && arr.length > 0)
    .withMessage("Le tableau studentsToUpdate ne peut pas être vide."),
  body("usersToUpdate.*")
    .isMongoId()
    .withMessage(
      "Chaque élément de studentsToUpdate doit être un identifiant MongoDB valide."
    ),
  body("rolesId")
    .isArray()
    .withMessage("Un tableau d'identifiants de rôles est requis.")
    .custom((arr) => Array.isArray(arr) && arr.length > 0)
    .withMessage("Le tableau rolesId ne peut pas être vide."),
  body("rolesId.*")
    .isMongoId()
    .withMessage(
      "Chaque élément de rolesId doit être un identifiant MongoDB valide."
    ),
  httpUpdateUserRoles
);

userRouter.post(
  "/",
  checkPermissions("user"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  userValidator(true),
  httpCreateUser
);

//  vérification de l'existence d'un compte utilisateur et envoi du mail de réinitialisation (public)
userRouter.put(
  "/reset-password",
  checkValidation(postCheckEmailValidator),
  httpPutResetPasswordEmail
);

userRouter.put(
  "/:id",
  checkPermissions("user"),
  createFileUploadMiddleware(headerImageMaxSize),
  jsonParser,
  userValidator(true),
  httpUpdateUser
);

userRouter.delete(
  "/:id",
  checkPermissions("user"),
  param("id").isString().trim().escape(),
  httpDeleteUser
);

// Création de plusieurs utilisateurs à la chaine
// renvoie en réponse les utilisateurs créés et déjà créés
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
  paginationValidator,
  param("role")
    .isString()
    .withMessage("Le paramètre 'role' est requis.")
    .custom(stringValidateGeneric)
    .withMessage("Le paramètre 'role' contient des caractères non autorisés."),
  param("entity")
    .isString()
    .withMessage("Le paramètre 'entity' est requis.")
    .custom(stringValidateGeneric)
    .withMessage(
      "Le paramètre 'entity' contient des caractères non autorisés."
    ),
  param("value")
    .isString()
    .withMessage("Le paramètre 'value' est requis.")
    .custom(stringValidateGeneric)
    .withMessage("Le paramètre 'value' contient des caractères non autorisés."),
  httpSearchUser
);

userRouter.use("/new-teacher", checkPermissions("user"), postTeacherRouter);

userRouter.get("/contacts", checkPermissions("user"), httpGetContacts);

// Rechercher des groupes en fonctions d'une liste d'ids de groupes passé en body et populate les users
userRouter.post("/group", checkPermissions("user"), httpGetUsersByGroup);

userRouter.use("/profile", checkPermissions("cursus"), userProfileRouter);

// Centres d'intérêts d'un étudiant (création, suppression)
userRouter.post("/hobby", checkPermissions("cursus"), httpPostHobby);

// Réseaux sociaux d'un étudiant (création, suppression)
userRouter.post(
  "/social-network",
  checkPermissions("cursus"),
  httpPostSocialNetwork
);

// retourne les deux derniers parcours auquel l'utilisateur participe en tant que contact
userRouter.get(
  "/last-parcours",
  checkPermissions("parcours"),
  httpGetUserLastParcours
);

// retourne les informations d'un utilisateur ainsi que ses rôles et son temps de connexion
userRouter.get(
  "/data/:userId",
  checkPermissions("user"),
  param("userId").isMongoId().withMessage("Identifiant d'utilisateur invalide"),
  httpGetUserData
);

userRouter.get(
  "/own-feedback",
  checkPermissions("cursus"),
  httpGetLastFeedback
);

// récupère les accomplissements de tous les autres étudiants étant dans le même groupe que l'étudiant connnecté.
userRouter.get(
  "/accomplishment",
  checkPermissions("cursus"),
  httpGetAccomplishements
);

// récupère les accomplissements de l'étudiant connnecté.
userRouter.get(
  "/my-accomplishment",
  checkPermissions("cursus"),
  httpGetConnectedStudentParcoursWithAccomplishements
);

// retourne la liste des derniers feedbacks enregistrés
userRouter.get(
  "/last-feedbacks/:notReviewed",
  checkPermissions("cursus"),
  param("notReviewed")
    .isBoolean()
    .withMessage("Le paramètre 'notReviewed' doit être un booléen."),
  httpGetLastFeedbacks
);

//  met à jour le mot d'un passe d'un nouvel utilisateur
userRouter.post(
  "/activate",
  activateAccount,
  postPasswordValidator,
  httpPutPassword
);

// envoie un email d'activation à un utilisateur nouvellement créé'
userRouter.put(
  "/invitation/:userId",
  rateLimiter(5, 60_000),
  userIdValidator,
  checkPermissions("user"),
  httpPutInvitation
);

// envoie un email de réinitialisation de mot de passe à un utilisateur (admin)
userRouter.put(
  "/reset-password/:userId",
  userIdValidator,
  checkPermissions("user"),
  httpPutResetPassword
);

// vérifie la validité du lien d'activation de compte'
userRouter.post(
  "/check-invitation",
  tokenValidator,
  activateAccount,
  httpPostCheckActivationToken
);

// Send activations emails to multiple users
userRouter.post(
  "/invitations",
  rateLimiter(3, 60_000),
  checkPermissions("user"),
  httpPostManyInvitations
);

userRouter.delete("/hobby/:id", checkPermissions("cursus"), httpDeleteHobby);

userRouter.delete(
  "/social-network/:id",
  checkPermissions("cursus"),
  httpDeleteSocialNetwork
);

export default userRouter;
