import apiClient from "../../../lib/axios";
import type StudentFeedback from "../../../utils/interfaces/student-feedback";

const queries = {
  getLastFeedbacks: async (): Promise<StudentFeedback[]> => {
    const res = await apiClient.get("/user/last-feedbacks/true");
    return res.data.response;
  },
};

export const feedbacksApi = {
  queries,
};
