import express from "express";
import isUser from "../../middleware/is-admin";
import httpGetAllUsers from "../../controllers/user/http-get-all-users";
import httpGetAllSkills from "../../controllers/skills/http-get-all-skills";

const skillsRouter = express.Router();

skillsRouter.get("/:stype/:sdir", isUser, httpGetAllSkills);

export default skillsRouter;
