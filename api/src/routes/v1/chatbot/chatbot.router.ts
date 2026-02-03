import Router, { Request } from "express";
import { http } from "winston";
import httpPostPrompt from "../../../controllers/chatbot/http-post-prompt";
import checkToken from "../../../middleware/check-token";
import { fastApiAgent } from "../../../server";
import httpPutDialogs from "../../../controllers/chatbot/http-put-dialogs";
import httpGetDialogs from "../../../controllers/chatbot/http-get-dialogs";

const chatbotRouter = Router();

// Récupère le token JWT de l'utilisateur depuis les cookies pour le forwarder à FastAPI
const getFastApiHeaders = (req: Request) => ({
  "Content-Type": "application/json",
  // Forward le token utilisateur pour que FastAPI puisse identifier l'utilisateur
  ...(req.cookies?.accessToken
    ? { Authorization: `Bearer ${req.cookies.accessToken}` }
    : {}),
});

chatbotRouter.post("/prompt", checkToken, httpPostPrompt);

// Ces routes nécessitent une authentification pour forwarder le token utilisateur
chatbotRouter.get("/test-mongo", checkToken, async (req, res) => {
  console.log("HELLO MONGO!");

  try {
    const result = await fetch("https://localhost:8443/test-mongo", {
      method: "GET",
      headers: getFastApiHeaders(req),
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

chatbotRouter.get("/test-pg", checkToken, async (req, res) => {
  console.log("HELLO PG!");

  try {
    const result = await fetch("https://localhost:8443/test-pg", {
      method: "GET",
      headers: getFastApiHeaders(req),
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

chatbotRouter.put("/dialogs", checkToken, httpPutDialogs);

chatbotRouter.get("/dialogs", checkToken, httpGetDialogs);

export default chatbotRouter;
