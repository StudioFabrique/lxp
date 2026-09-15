import express from "express";
import httpGetAllSkills from "../../controllers/skills/http-get-all-skills.ts";
import checkPermissions from "../../middleware/check-permissions.ts";

const skillsRouter = express.Router();

skillsRouter.get("/:stype/:sdir", checkPermissions("skill"), httpGetAllSkills);

export default skillsRouter;
