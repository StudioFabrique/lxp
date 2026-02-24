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
