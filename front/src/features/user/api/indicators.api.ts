import apiClient from "../../../lib/axios";
import type {
  IndicatorsPrediction,
  IndicatorsResponse,
} from "../interfaces/indicators";

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

export const mutations = {
  /**
   * Soumet les indicateurs de l'apprenant au modèle IA et en récupère l'issue
   * estimée ainsi que les alertes déclenchées.
   *
   * En POST : chaque appel lance une inférence sur le service IA, ce n'est pas
   * une lecture. La fenêtre est celle des indicateurs affichés, pour que la
   * prédiction porte sur la même période.
   */
  predictStudentOutcome: async (
    studentId: string,
    range?: { from?: string; to?: string },
  ): Promise<IndicatorsPrediction> => {
    const res = await apiClient.post<IndicatorsPrediction>(
      `/indicators/${studentId}/prediction`,
      null,
      { params: range },
    );
    return res.data;
  },
};

export const indicatorsApi = { queries, mutations };
