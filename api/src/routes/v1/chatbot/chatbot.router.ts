import Router from "express";
import httpPostPrompt from "../../../controllers/chatbot/http-post-prompt";
import checkToken from "../../../middleware/check-token";
import httpPutDialogs from "../../../controllers/chatbot/http-put-dialogs";
import httpGetDialogs from "../../../controllers/chatbot/http-get-dialogs";
import {
  postDialogsValidator,
  postPromptValidator,
} from "./chatbot-validators";

const chatbotRouter = Router();

chatbotRouter.post("/prompt", checkToken, postPromptValidator, httpPostPrompt);

chatbotRouter.post(
  "/dialogs",
  checkToken,
  postDialogsValidator,
  httpPutDialogs,
);

chatbotRouter.get("/dialogs", checkToken, httpGetDialogs);

export default chatbotRouter;
