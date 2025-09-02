import Router from "express";
import { http } from "winston";
import httpPostPrompt from "../../../controllers/chatbot/http-post-prompt";
import checkToken from "../../../middleware/check-token";

const chatbotRouter = Router();

chatbotRouter.post("/prompt", checkToken, httpPostPrompt);

export default chatbotRouter;
