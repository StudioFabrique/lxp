import { Router } from "express";
import httpCreateModule from "../../controllers/module/http-create-module";
import httpGetAllModules from "../../controllers/module/http-get-all-modules";
import httpUpdateModule from "../../controllers/module/http-update-module";
import httpDeleteModule from "../../controllers/module/http-delete-module";
import httpUpdateDatesModule from "../../controllers/module/http-update-dates-module";
import fileUpload from "../../middleware/fileUpload";
import httpUpdateDurationModule from "../../controllers/module/http-update-duration-module";

const moduleRouter = Router();

moduleRouter.get("/:parcoursId", httpGetAllModules);
moduleRouter.post("/", fileUpload.single("image"), httpCreateModule);
moduleRouter.put("/", httpUpdateModule);
moduleRouter.put("/dates", httpUpdateDatesModule);
moduleRouter.put("/duration", httpUpdateDurationModule);
moduleRouter.delete("/:id", httpDeleteModule);

export default moduleRouter;
