import { Router } from "express";
import httpCreateGroup from "../../controllers/group/http-create-group";
import httpGetAllGroups from "../../controllers/group/http-get-all-groups";
import {
  getAllValidator,
  groupValidator,
  searchValidator,
} from "../../middleware/validators";
import httpSearchGroup from "../../controllers/group/http-search-group";
import httpAddUser from "../../controllers/group/http-add-users-group";
import fileUpload from "../../middleware/fileUpload";
import httpGetGroupsById from "../../controllers/group/http-get-groups-by-id";
import checkPermissions from "../../middleware/check-permissions";
const groupRouter = Router();

groupRouter.get(
  "/:role/:stype/:sdir",

  //  vérification du token et récupération du rôle de l'utilisateur
  checkPermissions(),
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
  checkPermissions(),
  searchValidator,
  httpSearchGroup
);

groupRouter.post(
  "/",
  checkPermissions("group"),
  fileUpload.single("image"),
  groupValidator,
  httpCreateGroup
);

groupRouter.get("/users", checkPermissions("group"));

groupRouter.post("/users", checkPermissions("group"), httpAddUser);

groupRouter.post("/groups", checkPermissions("group"), httpGetGroupsById);

export default groupRouter;
