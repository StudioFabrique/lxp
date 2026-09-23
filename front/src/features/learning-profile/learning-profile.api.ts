import apiClient from "../../lib/axios";
import type {
  FormationLevel,
  LearningContext,
  LearningPace,
  LearningPreference,
} from "./types";

export const learningProfileApi = {
  get: async (): Promise<LearningContext> => {
    const response = await apiClient.get<LearningContext>(
      "/user/profile/learning",
    );
    return response.data;
  },
  update: async (payload: {
    pace?: LearningPace;
    preferences?: LearningPreference[];
    currentStep?: string;
    action?: "start" | "confirm";
  }): Promise<LearningContext> => {
    const response = await apiClient.patch<LearningContext>(
      "/user/profile/learning",
      payload,
    );
    return response.data;
  },
  updateModule: async (
    moduleId: number,
    level: FormationLevel,
  ): Promise<LearningContext> => {
    const response = await apiClient.put<LearningContext>(
      `/user/profile/learning/modules/${moduleId}`,
      { level },
    );
    return response.data;
  },
};

export const learningProfileKey = ["learning-profile"] as const;
