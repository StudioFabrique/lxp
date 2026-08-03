import getCourseById from "../course/get-course-by-id";
import { trackTokens } from "../stats/trackTokens";
import { aiApiClient } from "../../services/ai/ai-api-client";
import {
  AiQuizQuestion,
  createQuizGenerationKey,
} from "../../services/quiz/quiz-question";
import { quizRepository } from "./quiz-repository";
import type { QuizStreamDoneEvent } from "../../services/quiz/quiz-stream";

export class QuizGenerationError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
  }
}

export async function getEndingQuizContext(courseId: number, userId: string) {
  const course = await getCourseById(courseId);
  if (!course) throw new QuizGenerationError(404, "Cours introuvable");
  if (!course.courseSlug) {
    throw new QuizGenerationError(
      409,
      "Les fonctionnalités IA de ce cours copié ne sont pas indexées.",
      "AI_CONTENT_NOT_INDEXED",
    );
  }
  const student = await quizRepository.findStudentByMongoId(userId);
  if (!student) {
    throw new QuizGenerationError(
      404,
      "Profil étudiant introuvable dans Postgres",
    );
  }
  return {
    course,
    student,
    cachedQuiz: await quizRepository.findEndingQuiz(courseId, student.id),
  };
}

export async function saveEndingQuestion(
  question: AiQuizQuestion,
  context: { quizId?: number; courseId: number; studentId: number; title: string },
) {
  let quizId = context.quizId;
  if (!quizId) {
    const quiz = await quizRepository.createEndingQuiz(
      `Quiz de fin - ${context.title}`,
      context.courseId,
      context.studentId,
    );
    quizId = quiz.id;
  }
  await quizRepository.saveQuestion(question, { quizId });
  return quizId;
}

export async function prepareEndingQuizGeneration(
  courseId: number,
  userId: string,
) {
  const { course, student, cachedQuiz } = await getEndingQuizContext(
    courseId,
    userId,
  );
  if (cachedQuiz?.questions.length) {
    return { kind: "cached" as const, questions: cachedQuiz.questions };
  }

  const stream = await aiApiClient.postStream("/quiz/generate/stream", {
    subject: userId,
    accept: "application/json",
    body: {
      course_slug: course.courseSlug,
      num_questions: 10,
      profile: { user_id: userId, course_id: String(courseId) },
    },
  });
  let quizId: number | undefined;
  return {
    kind: "stream" as const,
    stream,
    onQuestion: async (question: AiQuizQuestion) => {
      quizId = await saveEndingQuestion(question, {
        quizId,
        courseId,
        studentId: student.id,
        title: course.title,
      });
    },
    onDone: async (event: QuizStreamDoneEvent) => {
      const tokens = event.tokens?.total_tokens;
      if (tokens) await trackTokens(userId, tokens);
    },
  };
}

export async function getPreliminaryQuizContext(moduleId: number) {
  const module = await quizRepository.findPreliminaryModule(moduleId);
  if (!module) throw new QuizGenerationError(404, "Module non trouvé.");
  return {
    module,
    cachedQuiz: await quizRepository.findPreliminaryQuiz(module.id),
  };
}

export async function savePreliminaryQuestion(
  question: AiQuizQuestion,
  context: { quizId?: number; moduleId: number; title: string },
) {
  let quizId = context.quizId;
  if (!quizId) {
    const quiz = await quizRepository.createPreliminaryQuiz(
      `Quiz préliminaire - ${context.title}`,
      context.moduleId,
    );
    quizId = quiz.id;
  }
  await quizRepository.saveQuestion(question, { quizId });
  return quizId;
}

export async function preparePreliminaryQuizGeneration(
  moduleId: number,
  userId: string,
  questionCount: number,
) {
  const { module, cachedQuiz } = await getPreliminaryQuizContext(moduleId);
  if (cachedQuiz?.questions.length) {
    return { kind: "cached" as const, questions: cachedQuiz.questions };
  }

  const stream = await aiApiClient.postStream("/quiz/preliminary/stream", {
    subject: userId,
    accept: "text/event-stream",
    body: {
      n: questionCount,
      title: module.title,
      description: module.description,
      teacher_instructions: module.quizInstructions,
    },
  });
  let quizId: number | undefined;
  return {
    kind: "stream" as const,
    stream,
    onQuestion: async (question: AiQuizQuestion) => {
      quizId = await savePreliminaryQuestion(question, {
        quizId,
        moduleId: module.id,
        title: module.title,
      });
    },
  };
}

type RandomQuizInput = {
  content: string;
  temperature: number;
  toxicityThreshold: number;
  maxAttempts: number;
  pastQuestions: unknown[];
  userId?: string;
};

export async function generateRandomQuiz(input: RandomQuizInput) {
  const data = await aiApiClient.postJson<
    AiQuizQuestion & { tokens?: { total_tokens?: number } }
  >("/quiz/random", {
    subject: input.userId || "anonymous_student",
    body: {
      content: input.content,
      temperature: input.temperature,
      toxicity_threshold: input.toxicityThreshold,
      max_attempts: input.maxAttempts,
      past_questions: input.pastQuestions,
      ...(input.userId && { profile: { user_id: String(input.userId) } }),
    },
  });

  await quizRepository
    .saveStandaloneQuestion(data, createQuizGenerationKey())
    .catch((error) => console.error("Erreur de sauvegarde cache:", error));
  const tokens = data.tokens?.total_tokens;
  if (input.userId && tokens) await trackTokens(input.userId, tokens);
  return data;
}
