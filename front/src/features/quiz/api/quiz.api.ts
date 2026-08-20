import apiClient from "../../../lib/axios";

export type QuizAttemptScope = {
  moduleId?: number;
  courseId?: number;
  activityId?: number;
};

export type QuizAttemptOrigin = string;

const queries = {
  /**
   * Génère une question aléatoire à partir du contenu d'une activité.
   *
   * La forme de la réponse est celle du service IA : sa conversion vers le
   * modèle interne reste dans les hooks, qui en portent déjà le mapping.
   */
  requestRandomQuestion: async (content?: string) => {
    const res = await apiClient.post("/quiz/random", { content });
    return res.data;
  },

  /**
   * Quiz diagnostique servi en flux : les questions arrivent une par une.
   * L'appelant consomme le `ReadableStream` renvoyé.
   */
  streamPreliminaryQuiz: async (
    moduleId: number,
    questionCount = 10,
  ): Promise<ReadableStream<Uint8Array>> => {
    const res = await apiClient({
      method: "post",
      url: `/quiz/preliminary/stream?n=${questionCount}`,
      data: { moduleId },
      responseType: "stream",
      adapter: "fetch",
    });
    return res.data as ReadableStream<Uint8Array>;
  },

  /** Quiz de fin de cours, servi en flux comme le diagnostique. */
  streamEndingQuiz: async (
    courseId: number,
  ): Promise<ReadableStream<Uint8Array>> => {
    const res = await apiClient({
      method: "get",
      url: `/quiz/course/ending/stream/${courseId}`,
      responseType: "stream",
      adapter: "fetch",
    });
    return res.data as ReadableStream<Uint8Array>;
  },
};

const mutations = {
  reportQuestion: async (externalId: string, comment: string) => {
    const res = await apiClient.post("/quiz/question/report", {
      externalId,
      comment,
    });
    return res.data;
  },

  /** Renvoie `null` quand l'utilisateur n'est pas suivi (204). */
  beginAttempt: async (
    origin: QuizAttemptOrigin,
    scope: QuizAttemptScope,
  ): Promise<{ id: number } | null> => {
    const res = await apiClient.post<{ id: number }>("/quiz/attempt", {
      origin,
      ...scope,
    });
    return res.status === 204 ? null : res.data;
  },

  recordAnswer: async (
    attemptId: number,
    externalId: string,
    userAnswer: unknown,
  ) => {
    const res = await apiClient.post(`/quiz/attempt/${attemptId}/answer`, {
      externalId,
      userAnswer,
    });
    return res.data;
  },

  finishAttempt: async (attemptId: number) => {
    const res = await apiClient.put(`/quiz/attempt/${attemptId}/finish`);
    return res.data;
  },
};

export const quizApi = { queries, mutations };
