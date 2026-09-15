import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/utils/db.ts";
import { ContentReadRepository } from "../src/models/content-read/content-read-repository.ts";
import getAssessmentsSummary from "../src/models/indicators/get-assessments-summary.ts";
import { IndicatorAnalysis, IndicatorAnalysisFeedback } from "../src/utils/interfaces/db/indicator-analysis.ts";
import { saveAnalysis } from "../src/models/indicators/analysis-history.ts";
import { requireAnalysisStaff, httpAnalysisFeedback, httpAnalysisHistory } from "../src/controllers/indicators/http-analysis-history.ts";
import httpPostIndicatorsPrediction from "../src/controllers/indicators/http-post-indicators-prediction.ts";
import { analysisFeedbackValidator, analysisHistoryValidator, indicatorsWindowValidator } from "../src/routes/v1/indicators/indicators-validators.ts";
import { aiApiClient } from "../src/services/ai/ai-api-client.ts";
import type CustomRequest from "../src/utils/interfaces/express/custom-request.ts";
import type { IndicatorPrediction } from "../src/models/indicators/predict-outcome.ts";

// Explicit opt-in; fixtures only run on the disposable indicators_test databases.
const integration = process.env.INDICATORS_TEST_DB === "1" ? describe : describe.skip;
const date = (value: string) => new Date(value);

integration("Indicateurs et retours sur bases isolées", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const staffId = new mongoose.Types.ObjectId().toString();
  let studentId: number;
  let courseId: number;
  let analysisId: string;
  const app = express();
  app.use(express.json());
  // Session déjà authentifiée : tests des contrôles métier, pas du login.
  app.use((req: CustomRequest, _res, next) => {
    if (req.headers["x-test-rank"]) req.auth = {
      userId: staffId, userRoles: [{ rank: Number(req.headers["x-test-rank"]) }],
    } as CustomRequest["auth"];
    next();
  });
  app.post("/:userId/prediction", requireAnalysisStaff, indicatorsWindowValidator, httpPostIndicatorsPrediction);
  app.get("/:userId/analyses", requireAnalysisStaff, analysisHistoryValidator, httpAnalysisHistory);
  app.post("/:userId/analyses/:analysisId/feedback", requireAnalysisStaff, analysisFeedbackValidator, httpAnalysisFeedback);

  beforeAll(async () => {
    for (const key of ["DATABASE_URL", "MONGO_LOCAL_URL"]) {
      const url = new URL(process.env[key]!);
      if (url.hostname !== "127.0.0.1" || url.pathname !== "/indicators_test") throw new Error("Tests require isolated loopback indicators_test databases");
    }
    await mongoose.connect(process.env.MONGO_LOCAL_URL!);
    studentId = (await prisma.student.create({ data: { idMdb: userId } })).id;
    const admin = await prisma.admin.create({ data: { idMdb: staffId } });
    const formation = await prisma.formation.create({ data: { title: randomUUID(), level: "test", adminId: admin.id } });
    const parcours = await prisma.parcours.create({ data: { title: randomUUID(), author: staffId, adminId: admin.id, formationId: formation.id } });
    const module = await prisma.module.create({ data: { title: "test", author: staffId, adminId: admin.id, parcoursId: parcours.id } });
    courseId = (await prisma.course.create({ data: { title: "test", author: staffId, adminId: admin.id, moduleId: module.id, order: 0, dates: [] } })).id;
    const quiz = await prisma.quiz.create({ data: { title: "test", type: "random" } });
    await prisma.quizAttempt.createMany({ data: [
      { studentId, quizId: quiz.id, origin: "self_test", startedAt: date("2026-08-17"), finishedAt: date("2026-08-18"), totalQuestions: 10, correctAnswers: 8 },
      { studentId, quizId: quiz.id, origin: "self_test", startedAt: date("2026-08-19"), finishedAt: date("2026-08-25"), totalQuestions: 10, correctAnswers: 0 },
      { studentId, quizId: quiz.id, origin: "self_test", startedAt: date("2026-08-19"), totalQuestions: 10, correctAnswers: 10 },
    ] });
    const assignment = await prisma.courseAssignment.create({ data: { courseId, dueAt: date("2026-08-20"), instructions: "test", maxScore: 20 } });
    await prisma.assignmentSubmission.create({ data: { assignmentId: assignment.id, studentId, submittedAt: date("2026-08-20"), grade: 16, gradedAt: date("2026-08-25") } });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await prisma.$disconnect();
    await mongoose.disconnect();
  });

  it("compte les remises mais exclut les notes et quiz terminés après la période", async () => {
    const result = await getAssessmentsSummary({ userIdMdb: userId, studentId, from: date("2026-08-19"), to: date("2026-08-22") });
    expect(result).toEqual({ periodCount: 1, cumulativeCount: 2, passRate: 1, scoreEvolution: null });
    const later = await getAssessmentsSummary({ userIdMdb: userId, studentId, from: date("2026-08-19"), to: date("2026-08-30") });
    expect(later).toMatchObject({ periodCount: 2, cumulativeCount: 3, passRate: 0.667 });
  });

  it("crédite une seule fois des battements simultanés et découpe la fenêtre", async () => {
    const from = date("2026-08-20T10:00:00Z");
    const to = date("2026-08-20T10:00:30Z");
    await prisma.courseRead.create({ data: { courseId, studentId, beganAt: from, lastOpenedAt: from, readTimeMs: 900_000 } });
    const repo = new ContentReadRepository();
    await Promise.all([repo.addReadTime("course", courseId, studentId, to), repo.addReadTime("course", courseId, studentId, to)]);
    expect(await prisma.contentReadCredit.count({ where: { studentId, type: "course" } })).toBe(1);
    expect(await repo.sumReadTime("course", studentId, from, to)).toBe(30_000);
    expect(await repo.sumReadTime("course", studentId, date("2026-08-20T10:00:10Z"), date("2026-08-20T10:00:20Z"))).toBe(10_000);
    expect((await repo.find("course", courseId, studentId))?.readTimeMs).toBe(930_000);
  });

  it("enregistre les entrées réelles et la version du modèle avant de rendre l'analyse", async () => {
    jest.spyOn(aiApiClient, "postJson").mockResolvedValue({
      outcome: { prediction: "graduate", probabilities: { graduate: 0.8, fail: 0.1, dropout: 0.1 } },
      alert: { effective_level: 0, fired: [] },
      model: { artifact_sha256: "test-model-hash", champion_name: "test" },
      evaluated_at: "2026-08-30T12:00:00Z",
    });
    const response = await request(app).post(`/${userId}/prediction?from=2026-08-19&to=2026-08-22`).set("x-test-rank", "2").expect(200);
    analysisId = response.body.analysisId;
    const stored = await IndicatorAnalysis.findById(analysisId).lean();
    expect(stored?.snapshot.indicators.pass_rate).toBe(1);
    expect(stored?.snapshot.model.artifactSha256).toBe("test-model-hash");
    expect(stored?.authorId).toBe(staffId);
    const history = await request(app).get(`/${userId}/analyses`).set("x-test-rank", "2").expect(200);
    expect(history.body.items[0].analysisId).toBe(analysisId);
  });

  it("refuse les apprenants, les identifiants invalides et les issues mal datées", async () => {
    await request(app).get(`/${userId}/analyses`).expect(401);
    await request(app).get(`/${userId}/analyses`).set("x-test-rank", "3").expect(403);
    const path = `/${userId}/analyses/${analysisId}/feedback`;
    await request(app).post(path).set("x-test-rank", "3").send({ verdict: "appropriate" }).expect(403);
    await request(app).post(path).set("x-test-rank", "2").send({ verdict: "wrong" }).expect(400);
    await request(app).post(path).set("x-test-rank", "2").send({ verdict: "appropriate", observedOutcome: "graduate" }).expect(400);
    await request(app).post(path).set("x-test-rank", "2").send({ verdict: "appropriate", observedOutcome: "graduate", observedAt: "2026-08-01" }).expect(400);
    await request(app).post(path).set("x-test-rank", "2").send({ verdict: "appropriate", observedOutcome: "graduate", observedAt: "2099-01-01" }).expect(400);
    await request(app).post(`/${staffId}/analyses/${analysisId}/feedback`).set("x-test-rank", "2").send({ verdict: "appropriate" }).expect(404);
    await request(app).post(`/${userId}/analyses/invalid/feedback`).set("x-test-rank", "2").send({ verdict: "appropriate" }).expect(400);
  });

  it("conserve les retours successifs sans remplacer la prédiction", async () => {
    const path = `/${userId}/analyses/${analysisId}/feedback`;
    await request(app).post(path).set("x-test-rank", "2").send({ verdict: "underestimated", comment: "À revoir" }).expect(201);
    await request(app).post(path).set("x-test-rank", "2").send({ verdict: "appropriate", observedOutcome: "graduate", observedAt: "2026-09-01T12:00:00Z" }).expect(201);
    expect(await IndicatorAnalysisFeedback.countDocuments({ analysisId })).toBe(2);
    const history = await request(app).get(`/${userId}/analyses`).set("x-test-rank", "2").expect(200);
    expect(history.body.items[0].feedback).toHaveLength(2);
    expect(history.body.items[0].outcome.prediction).toBe("graduate");
  });

  it("pagine l'historique sans mélanger les apprenants ni perdre une analyse", async () => {
    const stored = await IndicatorAnalysis.findById(analysisId).lean();
    for (let i = 0; i < 20; i++) await saveAnalysis(stored!.snapshot as IndicatorPrediction, staffId);
    const first = await request(app).get(`/${userId}/analyses`).set("x-test-rank", "2").expect(200);
    expect(first.body.items).toHaveLength(20);
    const second = await request(app).get(`/${userId}/analyses?before=${first.body.nextCursor}`).set("x-test-rank", "2").expect(200);
    expect(second.body.items).toHaveLength(1);
    expect(second.body.items[0].analysisId).toBe(analysisId);
    const other = await request(app).get(`/${staffId}/analyses`).set("x-test-rank", "2").expect(200);
    expect(other.body.items).toEqual([]);
  });
});
