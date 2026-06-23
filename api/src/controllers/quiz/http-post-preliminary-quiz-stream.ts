import { Request, Response } from "express";
import { Readable, Transform } from "stream";
import dotenv from "dotenv";
import { prisma } from "../../utils/db";
import { sign } from "jsonwebtoken";

dotenv.config();

interface ModuleInfo {
  title: string;
}

export default async function httpPostPreliminaryQuizStream(
  req: Request,
  res: Response,
) {
  const { n = 5 } = req.query;
  const { title } = req.body as ModuleInfo;

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
    const module = await prisma.module.findFirst({
      where: { title: title },
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

    // Création d'un stream de capture pour sauvegarder les questions
    let accumulatedData = "";
    const captureStream = new Transform({
      transform(chunk, encoding, callback) {
        accumulatedData += chunk.toString();
        this.push(chunk); // On laisse passer le flux pour le client
        callback();
      },
    });

    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.pipe(captureStream).pipe(res);

    // Sauvegarde asynchrone une fois le stream terminé
    captureStream.on("finish", async () => {
      try {
        const lines = accumulatedData.split("\n");
        const questionsToSave = [];

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const jsonStr = line.replace("data:", "").trim();
          try {
            const parsed = JSON.parse(jsonStr);
            // On filtre les événements de type question
            if (parsed && !parsed.event && parsed.prompt) {
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
              questionsToSave.push({
                externalId: id,
                type,
                prompt,
                difficulty: difficulty || "medium",
                explanationTrue: explanation_correct,
                explanationWrong: explanation_wrong,
                tags: tags || [],
                data: specificData,
              });
            }
          } catch {}
        }

        if (questionsToSave.length > 0) {
          await prisma.quiz.create({
            data: {
              title: `Quiz préliminaire - ${module.title}`,
              type: "preliminary",
              moduleId: module.id,
              questions: { create: questionsToSave },
            },
          });
          console.log(`Quiz sauvegardé en BDD pour le module ${module.id}`);
        }
      } catch (e) {
        console.error("Erreur sauvegarde auto-quiz:", e);
      }
    });
  } catch (error) {
    console.error("Erreur backend:", error);
    res.status(500).json({ error: "Erreur lors du traitement." });
  }
}
