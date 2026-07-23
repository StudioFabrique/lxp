import Router from "express";
import httpPostPrompt from "../../../controllers/chatbot/http-post-prompt";
import checkPermissions from "../../../middleware/check-permissions";
import httpPutDialogs from "../../../controllers/chatbot/http-put-dialogs";
import httpGetDialogs from "../../../controllers/chatbot/http-get-dialogs";
import {
  postDialogsValidator,
  postPromptValidator,
} from "./chatbot-validators";

const chatbotRouter = Router();

chatbotRouter.post(
  "/prompt",
  checkPermissions("chatbot", "write"),
  postPromptValidator,
  httpPostPrompt,
);

chatbotRouter.post(
  "/dialogs",
  checkPermissions("chatbot", "write"),
  postDialogsValidator,
  httpPutDialogs,
);

chatbotRouter.get(
  "/dialogs",
  checkPermissions("chatbot", "read"),
  httpGetDialogs,
);

export default chatbotRouter;
