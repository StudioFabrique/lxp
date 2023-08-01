import express from "express";
import httpGetFormation from "../../controllers/formation/http-get-formation";

const formationRouter = express.Router();

formationRouter.get("/", httpGetFormation);

export default formationRouter;
