import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";

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
    return this.database.orm.public.Student.where({ idMdb }).first();
  }

  findEndingQuiz(courseId: number, studentId: number) {
    return this.database.orm.public.Quiz.where((quiz) =>
      and(
        quiz.courseId.eq(courseId),
        quiz.studentId.eq(studentId),
        quiz.type.eq("ending_course"),
        quiz.questions.some(),
      ),
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
    return this.database.orm.public.Module.where({ id: moduleId })
      .select("id", "title", "description", "quizInstructions")
      .first();
  }

  findPreliminaryQuiz(moduleId: number) {
    return this.database.orm.public.Quiz.where((quiz) =>
      and(
        quiz.moduleId.eq(moduleId),
        quiz.type.eq("preliminary"),
        quiz.questions.some(),
      ),
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
