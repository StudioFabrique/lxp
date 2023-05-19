import { Router } from "express";
import httpCreateGroup from "../../controllers/group/http-create-group";
import isUser from "../../middleware/is-user";
import httpGetAllGroups from "../../controllers/group/http-get-all-groups";
import { searchValidator } from "../../middleware/validators";

const groupRouter = Router();

groupRouter.get(
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
  searchValidator,
  httpGetAllGroups
);

groupRouter.post("/", isUser, httpCreateGroup);

export default groupRouter;
