import apiClient from "../../../lib/axios";
import type { IndicatorsResponse } from "../interfaces/indicators";

export const queries = {
  /** Tous les indicateurs d'un apprenant en un seul appel. */
  getStudentIndicators: async (
    studentId: string,
    range?: { from?: string; to?: string },
  ): Promise<IndicatorsResponse> => {
    const res = await apiClient.get<IndicatorsResponse>(
      `/indicators/${studentId}`,
      { params: range },
    );
    return res.data;
  },
};

export const indicatorsApi = { queries };
