import Router from "express";
import { http } from "winston";
import httpPostPrompt from "../../../controllers/chatbot/http-post-prompt";
import checkToken from "../../../middleware/check-token";
import { fastApiAgent } from "../../../server";

const chatbotRouter = Router();

chatbotRouter.post("/prompt", checkToken, httpPostPrompt);
chatbotRouter.get("/test-mongo", async (req, res) => {
  console.log("HELLO MONGO!");

  try {
    const result = await fetch("https://localhost:8443/test-mongo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Ajouter l'agent mTLS si configuré pour HTTPS
      ...(fastApiAgent ? { dispatcher: fastApiAgent } : {}),
    });
    const data = await result.json();
    return res.json(data);
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: "Failed to fetch data from FastAPI" });
  }
});

export default chatbotRouter;
