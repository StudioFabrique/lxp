import { Router } from "express";
import httpCreateGroup from "../../controllers/group/http-create-group";
import isUser from "../../middleware/is-admin";
import httpGetAllGroups from "../../controllers/group/http-get-all-groups";
import {
  getAllValidator,
  groupValidator,
  searchValidator,
} from "../../middleware/validators";
import httpSearchGroup from "../../controllers/group/http-search-group";
import httpAddUser from "../../controllers/group/http-add-users-group";

import fileUpload from "../../middleware/fileUpload";
import { check } from "express-validator";
import checkToken from "../../middleware/check-token";
import httpGetGroupsById from "../../controllers/group/http-get-groups-by-id";
import checkPermissions from "../../middleware/check-permissions";

const groupRouter = Router();

groupRouter.get(
  "/:role/:stype/:sdir",

  //  vérification du token et récupération du rôle de l'utilisateur
  checkPermissions(1, "group"),
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
  httpGetAllGroups
);

groupRouter.get(
  "/search/:role/:entity/:value/:stype/:sdir",
  checkPermissions(1, "group"),
  searchValidator,
  httpSearchGroup
);

groupRouter.post(
  "/",
  checkPermissions(1, "group"),
  // groupValidator,
  fileUpload.single("image"),
  httpCreateGroup
);

groupRouter.get("/users", checkPermissions(1, "group"));

groupRouter.post("/users", checkPermissions(1, "group"), httpAddUser);

groupRouter.post(
  "/groups",
  checkPermissions(1, "group"),
  // checkToken,
  httpGetGroupsById
);

export default groupRouter;
