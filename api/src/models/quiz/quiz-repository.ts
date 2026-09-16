import { prisma } from "../../utils/db.ts";
import { whereFromObject } from "../../utils/prisma-query.ts";
import {
  type AiQuizQuestion,
  toQuizQuestionCreateData,
} from "../../services/quiz/quiz-question.ts";

export class QuizRepository {
  private readonly database: typeof prisma;

  constructor(database: typeof prisma = prisma) {
    this.database = database;
  }

  findStudentByMongoId(idMdb: string) {
    return this.database.orm.public.Student.where((student) =>
      whereFromObject(student, { idMdb }),
    ).first();
  }

  findEndingQuiz(courseId: number, studentId: number) {
    return this.database.orm.public.Quiz.where((quiz) =>
      whereFromObject(quiz, {
        courseId,
        studentId,
        type: "ending_course",
        questions: { some: {} },
      }),
    )
      .include("questions")
      .first();
  }

  createEndingQuiz(title: string, courseId: number, studentId: number) {
    return this.database.orm.public.Quiz.create({
      title,
      type: "ending_course",
      courseId,
      studentId,
    });
  }

  findPreliminaryModule(moduleId: number) {
    return this.database.orm.public.Module.where((module) =>
      whereFromObject(module, { id: moduleId }),
    )
      .select("id", "title", "description", "quizInstructions")
      .first();
  }

  findPreliminaryQuiz(moduleId: number) {
    return this.database.orm.public.Quiz.where((quiz) =>
      whereFromObject(quiz, {
        moduleId,
        type: "preliminary",
        questions: { some: {} },
      }),
    )
      .include("questions")
      .first();
  }

  createPreliminaryQuiz(title: string, moduleId: number) {
    return this.database.orm.public.Quiz.create({
      title,
      type: "preliminary",
      moduleId,
    });
  }

  saveQuestion(question: AiQuizQuestion, relation: { quizId?: number } = {}) {
    return this.database.orm.public.QuizQuestion.create({
      ...toQuizQuestionCreateData(question),
      ...relation,
    });
  }

  saveStandaloneQuestion(question: AiQuizQuestion, contentHash: string) {
    return this.database.orm.public.QuizQuestion.create({
      ...toQuizQuestionCreateData(question),
      contentHash,
    });
  }
}

export const quizRepository = new QuizRepository();
