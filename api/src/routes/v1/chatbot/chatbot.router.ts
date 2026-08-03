import Router from "express";
import httpPostPrompt from "../../../controllers/chatbot/http-post-prompt.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";
import httpPutDialogs from "../../../controllers/chatbot/http-put-dialogs.ts";
import httpGetDialogs from "../../../controllers/chatbot/http-get-dialogs.ts";
import {
  postDialogsValidator,
  postPromptValidator,
} from "./chatbot-validators.ts";

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
