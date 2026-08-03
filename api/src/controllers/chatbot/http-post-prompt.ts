import { Response } from "express";
import processPrompt, {
  PromptProcessingError,
} from "../../models/chatbot/process-prompt";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpPostPrompt(req: CustomRequest, res: Response) {
  try {
    const { prompt, fullPrompt, courseId, clearHistory, textSelection } = req.body;
    const data = await processPrompt({
      userId: req.auth?.userId || "anonymous_student",
      prompt,
      fullPrompt,
      courseId,
      clearHistory,
      textSelection,
    });
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    if (error instanceof PromptProcessingError) {
      return res.status(error.statusCode).json(error.body);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
