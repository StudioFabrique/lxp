import Router, { Request } from "express";
import httpPostPrompt from "../../../controllers/chatbot/http-post-prompt";
import checkToken from "../../../middleware/check-token";
import httpPutDialogs from "../../../controllers/chatbot/http-put-dialogs";
import httpGetDialogs from "../../../controllers/chatbot/http-get-dialogs";
import {
  postDialogsValidator,
  postPromptValidator,
} from "./chatbot-validators";

const chatbotRouter = Router();

// Récupère le token JWT de l'utilisateur depuis les cookies pour le forwarder à FastAPI
const getFastApiHeaders = (req: Request) => ({
  "Content-Type": "application/json",
  // Forward le token utilisateur pour que FastAPI puisse identifier l'utilisateur
  ...(req.cookies?.accessToken
    ? { Authorization: `Bearer ${req.cookies.accessToken}` }
    : {}),
});

chatbotRouter.post("/prompt", checkToken, postPromptValidator, httpPostPrompt);

chatbotRouter.post(
  "/dialogs",
  checkToken,
  postDialogsValidator,
  httpPutDialogs,
);

chatbotRouter.get("/dialogs", checkToken, httpGetDialogs);

export default chatbotRouter;
