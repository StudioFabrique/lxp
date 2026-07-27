import { Request, Response } from "express";
import { pipeline, Readable, Transform } from "stream";
import dotenv from "dotenv";
import { prisma } from "../../utils/db";
import { sign } from "jsonwebtoken";

dotenv.config();

interface ModuleInfo {
  moduleId: number;
}

export default async function httpPostPreliminaryQuizStream(
  req: Request,
  res: Response,
) {
  const { n = 5 } = req.query;
  const { moduleId } = req.body as ModuleInfo;

  const dockerIa =
    process.env.DOCKER_IA_API_BASE_URL || "http://localhost:8000";

  const secret = process.env.DOCKER_IA_AUTH_SECRET;

  if (!secret)
    return res.status(500).json({
      error:
        "Internal server error : Le secret JWT pour le docker IA n'est pas configuré",
    });

  const token = sign(
    {
      sub: "student",
      userRoles: [{ role: "admin" }],
    },
    secret,
  );

  try {
    // 1. Recherche du module
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: {
        id: true,
        title: true,
        description: true,
        quizInstructions: true,
      },
    });

    if (!module) throw new Error("Module non trouvé.");

    // 2. Tentative de récupération depuis le cache BDD
    const existingQuizz = await prisma.quiz.findFirst({
      where: { moduleId: module.id, type: "preliminary" },
      include: { questions: true },
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (existingQuizz && existingQuizz.questions.length > 0) {
      console.log(`Cache HIT pour le module: ${module.title}`);

      // Streaming depuis la base
      for (const q of existingQuizz.questions) {
        const payload = {
          id: q.externalId,
          type: q.type,
          prompt: q.prompt,
          difficulty: q.difficulty,
          explanation_correct: q.explanationTrue,
          explanation_wrong: q.explanationWrong,
          tags: q.tags,
          ...(q.data as any),
        };
        res.write(`event: question\ndata: ${JSON.stringify(payload)}\n\n`);
      }
      res.write('event: done\ndata: {"status": "cached"}\n\n');
      return res.end();
    }

    // 3. Cache MISS : Appel de l'IA + Capture
    console.log(`Cache MISS pour le module: ${module.title}. Appel IA.`);

    const iaPayload = {
      n: Number(n),
      title: module.title,
      description: module.description,
      teacher_instructions: module.quizInstructions,
    };

    const response = await fetch(
      `${process.env.DOCKER_IA_API_BASE_URL}/quiz/preliminary/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify(iaPayload),
      },
    );

    if (!response.ok) throw new Error(`Erreur API IA: ${response.statusText}`);

    // Créer le quiz avant de relayer les questions. Chaque question est ensuite
    // persistée avant que son chunk ne soit envoyé au client : sans cela, un
    // apprenant pouvait signaler une question déjà affichée alors que la
    // sauvegarde (effectuée auparavant à la fin du stream) n'avait pas encore
    // commencé.
    const generatedQuiz = await prisma.quiz.create({
      data: {
        title: `Quiz préliminaire - ${module.title}`,
        type: "preliminary",
        moduleId: module.id,
      },
    });

    let lineBuffer = "";

    const saveQuestionFromLine = async (line: string) => {
      if (!line.startsWith("data:")) return;

      const jsonStr = line.replace(/^data:\s*/, "").trim();
      if (!jsonStr) return;

      try {
        const parsed = JSON.parse(jsonStr);
        if (!parsed || parsed.event || !parsed.prompt) return;

        const {
          id,
          type,
          prompt,
          difficulty,
          explanation_correct,
          explanation_wrong,
          tags,
          ...specificData
        } = parsed;

        await prisma.quizQuestion.create({
          data: {
            quizId: generatedQuiz.id,
            externalId: String(id),
            type,
            prompt,
            difficulty: difficulty || "medium",
            explanationTrue: explanation_correct,
            explanationWrong: explanation_wrong,
            tags: tags || [],
            data: specificData,
          },
        });
      } catch (error) {
        // Les événements non JSON ne sont pas des questions. Une erreur Prisma,
        // en revanche, doit interrompre le stream pour ne jamais afficher une
        // question impossible à signaler.
        if (error instanceof SyntaxError) return;
        throw error;
      }
    };

    const captureStream = new Transform({
      transform(chunk, encoding, callback) {
        const chunkText = chunk.toString();
        lineBuffer += chunkText;

        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop() || "";

        Promise.all(lines.map(saveQuestionFromLine))
          .then(() => {
            this.push(chunk);
            callback();
          })
          .catch(callback);
      },
      flush(callback) {
        saveQuestionFromLine(lineBuffer).then(() => callback(), callback);
      },
    });

    const nodeStream = Readable.fromWeb(response.body as any);
    pipeline(nodeStream, captureStream, res, (streamError) => {
      if (streamError) {
        console.error(
          "Erreur lors de la persistance du quiz préliminaire :",
          streamError,
        );
      }
    });
  } catch (error) {
    console.error("Erreur backend:", error);
    res.status(500).json({ error: "Erreur lors du traitement." });
  }
}
