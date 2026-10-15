export type ChatbotSource = {
  course: string;
  section: string;
  activity: string;
  score: number;
  heading_path: string;
  lessonId?: number;
  moduleId?: number;
  activityId?: number;
};

export type ChatbotValues = {
  origin: "user" | "bot";
  message: string;
  date: Date;
  type?: "normal" | "warning" | "error";
  mode?: string;
  sources?: ChatbotSource[];
  textSelection?: string;
  /** Réponse préenregistrée du guide : elle n'est pas dans l'historique de la conversation, rien à agrandir. */
  preset?: boolean;
};
