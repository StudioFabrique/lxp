export interface QuizMcq {
  options: string[];
  answerIndex: number;
}

export interface QuizTrFa {
  answer: boolean;
}

export type Pair = { left: string; right: string };

export interface QuizMatching {
  pairs: Pair[];
}

export interface QuizOrdering {
  items: string[];
  order: number[];
}

export interface QuizBase {
  question: string;
  trueExplanation: string;
  falseExplanation: string;
}

export type Quiz = QuizBase &
  (
    | {
        type: "mcq";
        data: QuizMcq;
      }
    | {
        type: "true_false";
        data: QuizTrFa;
      }
    | {
        type: "matching";
        data: QuizMatching;
      }
    | {
        type: "ordering";
        data: QuizOrdering;
      }
  );

// --- Interfaces pour l'API externe (SSE) ---

// Base commune à toutes les questions renvoyées par l'API IA
export interface ExternalApiQuizBase {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  explanation_correct: string;
  explanation_wrong: string;
  choice_feedback?: string[];
  evidence?: string[];
  tags?: string[];
}

export interface ExternalApiQuizMcq extends ExternalApiQuizBase {
  type: "mcq";
  choices: string[];
  answer_key: number;
}

export interface ExternalApiQuizTrueFalse extends ExternalApiQuizBase {
  type: "true_false";
  choices: null;
  answer_key: boolean;
}

export interface ExternalApiQuizMatching extends ExternalApiQuizBase {
  type: "matching";
  choices: { left: string[]; right: string[] };
  answer_key: number[];
}

export interface ExternalApiQuizOrdering extends ExternalApiQuizBase {
  type: "ordering";
  choices: string[];
  answer_key: number[];
}

// L'union discriminante : TypeScript saura deviner le bon type selon la valeur de `type`
export type ExternalApiQuiz =
  | ExternalApiQuizMcq
  | ExternalApiQuizTrueFalse
  | ExternalApiQuizMatching
  | ExternalApiQuizOrdering;

// L'événement spécial de fin de flux
export interface ExternalApiDoneEvent {
  event: "done";
  total_questions: number;
  content_richness: string;
  elapsed_sec: number;
}

// Le payload brut reçu dans le Stream (soit une question, soit l'événement de fin)
export type ExternalApiStreamPayload = ExternalApiQuiz | ExternalApiDoneEvent;
