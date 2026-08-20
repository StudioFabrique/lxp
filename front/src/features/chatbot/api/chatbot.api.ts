import apiClient from "../../../lib/axios";
import type { ChatbotSource, ChatbotValues } from "../interfaces/chatbot";

export type PromptPayload = {
  prompt: string;
  fullPrompt: string;
  courseId?: number;
  clearHistory: boolean;
  textSelection: string | null;
};

export type PromptResponse = {
  text: string;
  type?: "normal" | "warning" | "error";
  mode?: string;
  sources?: ChatbotSource[];
};

export type DialogsResponse = {
  success: boolean;
  dialogs: ChatbotValues[];
};

const queries = {
  getDialogs: async (): Promise<DialogsResponse> => {
    const res = await apiClient.get<DialogsResponse>("/chatbot/dialogs");
    return res.data;
  },
};

const mutations = {
  sendPrompt: async (payload: PromptPayload): Promise<PromptResponse> => {
    const res = await apiClient.post<PromptResponse>(
      "/chatbot/prompt",
      payload,
    );
    return res.data;
  },
};

export const chatbotApi = { queries, mutations };
