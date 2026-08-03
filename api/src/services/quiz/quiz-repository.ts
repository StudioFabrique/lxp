import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../utils/db";
import {
  AiQuizQuestion,
  toQuizQuestionCreateData,
} from "./quiz-question";

export class QuizRepository {
  constructor(private readonly database: PrismaClient = prisma) {}

  findStudentByMongoId(idMdb: string) {
    return this.database.student.findFirst({ where: { idMdb } });
  }

  findEndingQuiz(courseId: number, studentId: number) {
    return this.database.quiz.findFirst({
      where: {
        courseId,
        studentId,
        type: "ending_course",
        questions: { some: {} },
      },
      include: { questions: true },
    });
  }

  createEndingQuiz(title: string, courseId: number, studentId: number) {
    return this.database.quiz.create({
      data: { title, type: "ending_course", courseId, studentId },
    });
  }

  findPreliminaryModule(moduleId: number) {
    return this.database.module.findUnique({
      where: { id: moduleId },
      select: {
        id: true,
        title: true,
        description: true,
        quizInstructions: true,
      },
    });
  }

  findPreliminaryQuiz(moduleId: number) {
    return this.database.quiz.findFirst({
      where: {
        moduleId,
        type: "preliminary",
        questions: { some: {} },
      },
      include: { questions: true },
    });
  }

  createPreliminaryQuiz(title: string, moduleId: number) {
    return this.database.quiz.create({
      data: { title, type: "preliminary", moduleId },
    });
  }

  saveQuestion(
    question: AiQuizQuestion,
    relation: Pick<Prisma.QuizQuestionUncheckedCreateInput, "quizId"> = {},
  ) {
    return this.database.quizQuestion.create({
      data: { ...toQuizQuestionCreateData(question), ...relation },
    });
  }

  saveStandaloneQuestion(question: AiQuizQuestion, contentHash: string) {
    return this.database.quizQuestion.create({
      data: { ...toQuizQuestionCreateData(question), contentHash },
    });
  }
}

export const quizRepository = new QuizRepository();
