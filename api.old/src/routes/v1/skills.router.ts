import express from "express";
import isUser from "../../middleware/is-admin";
import httpGetAllUsers from "../../controllers/user/http-get-all-users";
import httpGetAllSkills from "../../controllers/skills/http-get-all-skills";
import checkPermissions from "../../middleware/check-permissions";

const skillsRouter = express.Router();

skillsRouter.get("/:stype/:sdir", checkPermissions("skill"), httpGetAllSkills);

export default skillsRouter;
