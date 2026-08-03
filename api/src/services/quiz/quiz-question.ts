import { randomUUID } from "crypto";
import type { Prisma, QuizQuestion } from "@prisma/client";

export interface AiQuizQuestion {
  id?: string | number | null;
  type: string;
  prompt: string;
  difficulty?: string | null;
  explanation_correct?: string | null;
  explanation_wrong?: string | null;
  tags?: string[] | null;
  [key: string]: unknown;
}

export type StoredQuizQuestion = Pick<
  QuizQuestion,
  | "externalId"
  | "type"
  | "prompt"
  | "difficulty"
  | "explanationTrue"
  | "explanationWrong"
  | "tags"
  | "data"
>;

export function isAiQuizQuestion(value: unknown): value is AiQuizQuestion {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.type === "string" &&
    typeof candidate.prompt === "string"
  );
}

export function toQuizQuestionCreateData(
  question: AiQuizQuestion,
): Omit<Prisma.QuizQuestionUncheckedCreateInput, "quizId" | "contentHash"> {
  const {
    id,
    type,
    prompt,
    difficulty,
    explanation_correct,
    explanation_wrong,
    tags,
    tokens: _tokens,
    event: _event,
    ...specificData
  } = question;

  return {
    externalId: id == null ? null : String(id),
    type,
    prompt,
    difficulty: difficulty || "medium",
    explanationTrue: explanation_correct ?? null,
    explanationWrong: explanation_wrong ?? null,
    tags: tags || [],
    data: specificData as Prisma.InputJsonValue,
  };
}

export function toQuizApiQuestion(question: StoredQuizQuestion) {
  const specificData =
    question.data &&
    typeof question.data === "object" &&
    !Array.isArray(question.data)
      ? question.data
      : {};

  return {
    id: question.externalId,
    type: question.type,
    prompt: question.prompt,
    difficulty: question.difficulty,
    explanation_correct: question.explanationTrue,
    explanation_wrong: question.explanationWrong,
    tags: question.tags,
    ...specificData,
  };
}

/**
 * Les questions random doivent rester renouvelables (mauvaise réponse ou
 * signalement). La colonne historique `contentHash` sert donc ici d'identifiant
 * de génération unique, comme avant le refactoring.
 */
export function createQuizGenerationKey() {
  return randomUUID().replace(/-/g, "");
}
