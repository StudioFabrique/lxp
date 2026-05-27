import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { fastApiAgent } from "../../server";
import { fetch } from "undici";

export default async function httpPostPrompt(
  req: CustomRequest,
  res: Response,
) {
  try {
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const dockerIa = process.env.FASTAPI_URL || "http://localhost:8000";
    const fetchOptions: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: req.auth?.userId,
        question: req.body.prompt,
        course_slug: req.body.courseTitle,
        // max_tokens: req.body.max_tokens || 100,
      }),
    };

    // Ajouter l'agent mTLS si configuré pour HTTPS
    if (fastApiAgent && dockerIa.startsWith("https://")) {
      fetchOptions.dispatcher = fastApiAgent;
    }

    const response = await fetch(`${dockerIa}/ask`, fetchOptions);
    if (!response.ok) {
      return res.status(response.status).json({ error: "FastAPI error" });
    }

    // Stream la réponse
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } finally {
        reader.releaseLock();
        res.end();
      }
    }
  } catch (error) {
    console.error("Streaming error:", error);
    res.status(500).json(error);
  }
}
