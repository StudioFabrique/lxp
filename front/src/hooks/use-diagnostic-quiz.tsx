import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Quiz, Pair, ExternalApiQuiz } from "../utils/interfaces/quiz";
import hasPermission from "../utils/hasPermission";
import { Context } from "../store/context.store";
import useHttp from "./use-http";
import { BASE_API_URL } from "../config/urls";
import toast from "react-hot-toast";
import { Info } from "lucide-react";

interface ModuleInfoForDiagnostic {
  title?: string;
  description?: string;
}

export default function useDiagnosticQuiz(
  hasStartedModule: boolean,
  isModuleLoaded: boolean,
  moduleInfo: ModuleInfoForDiagnostic,
  onFinishInitialQuiz: () => void,
) {
  const { user } = useContext(Context);
  const { axiosInstance: axios } = useHttp();

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  const isFinished = useRef(false);

  const toastWarning = (message: string) => {
    toast.error(message, {
      icon: <Info />,
      style: {
        border: "1px solid #EA580C",
        padding: "16px",
        color: "#EA580C",
      },
      iconTheme: {
        primary: "#EA580C",
        secondary: "#FFEDD5",
      },
    });
  };

  const mapExternalToInternal = (external: ExternalApiQuiz): Quiz | null => {
    const base = {
      question: external.prompt,
      trueExplanation: external.explanation_correct,
      falseExplanation: external.explanation_wrong,
    };

    switch (external.type) {
      case "mcq":
        return {
          ...base,
          type: "mcq",
          data: {
            options: external.choices,
            answerIndex: external.answer_key,
          },
        };

      case "true_false":
        return {
          ...base,
          type: "true_false",
          data: { answer: external.answer_key },
        };

      case "matching": {
        let pairs: Pair[] = [];

        pairs = external.pairs;

        return {
          ...base,
          type: "matching",
          data: { pairs },
        };
      }

      case "ordering":
        return {
          ...base,
          type: "ordering",
          data: {
            items: external.ordering_items,
            order: external.ordering_answer,
          },
        };
      default:
        return null;
    }
  };

  const onLoadPreliminaryQuizzes = useCallback(async () => {
    setQuizzes([]);
    setCurrentIndex(0);
    setScore(0);
    setIsOpen(true);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsStreaming(true);

    if (!moduleInfo.title || !moduleInfo.description) {
      console.warn(
        "Module info (title, description, teacher_instructions) is required to load preliminary quizzes from the API.",
      );
      setIsStreaming(false);
      toastWarning(
        "Impossible de charger le diagnostic initial : informations du module manquantes.",
      );
      setIsOpen(false);
      return;
    }

    try {
      const response = await axios({
        method: "post",
        url: `${BASE_API_URL}/quiz/preliminary/stream?n=10`,
        data: {
          title: moduleInfo.title,
          description: moduleInfo.description,
          teacher_instructions:
            // À remplacer par une vraie donnée provenant du module une fois le formulaire des modules mis à jour pour inclure les instructions aux enseignants.
            "Questionnaire diagnostique en français, ton clair et pédagogique. Priorité aux prérequis et bases avant le module. Inclure uniquement des questions auto-corrigeables. Éviter l'ambiguïté.",
        },
        responseType: "stream",
        adapter: "fetch",
      });

      const stream = response.data as ReadableStream<Uint8Array>;
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleanLine = line.trim();

            if (!cleanLine.startsWith("data:")) continue;

            try {
              const jsonString = cleanLine.substring(5).trim();
              const payload = JSON.parse(jsonString);

              // Ignorer les événements de progress et done
              if ("event" in payload || "accepted" in payload) {
                if ("event" in payload) {
                  console.log(
                    `Diagnostic terminé : ${payload.total_questions} questions.`,
                  );
                }
                continue;
              }

              const mappedQuiz = mapExternalToInternal(payload);

              if (mappedQuiz) {
                setQuizzes((prev) =>
                  prev ? [...prev, mappedQuiz] : [mappedQuiz],
                );
              }
            } catch (e) {
              console.error(
                "Erreur de parsing JSON sur le chunk :",
                cleanLine,
                e,
              );
            }
          }
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du diagnostic initial:",
        error,
      );
      toastWarning(
        "Une erreur est survenue lors du chargement du diagnostic initial.",
      );
      setIsOpen(false);
    } finally {
      setIsStreaming(false);
    }
  }, [moduleInfo.title, moduleInfo.description, axios]);

  const onStartQuiz = () => {
    setIsStarted(true);
  };

  const onAnswerQuiz = (correct: boolean) => {
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const onNextQuiz = () => {
    if (quizzes && currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else if (isStreaming) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsOpen(false);
      isFinished.current = true;

      console.log(`Diagnostic terminé ! Score : ${score}/${quizzes?.length}`);
      onFinishInitialQuiz();
    }
  };

  useEffect(() => {
    if (!isModuleLoaded) return;

    const userIsAdmin =
      user?.permissions && hasPermission(user.permissions, "update", "lesson");

    console.log({
      hasStartedModule,
      isFinished: isFinished.current,
      userIsAdmin,
    });

    if (!hasStartedModule && !isFinished.current && !userIsAdmin) {
      onLoadPreliminaryQuizzes();
    } else if (!isFinished.current) {
      isFinished.current = true;
      onFinishInitialQuiz();
    }
  }, [
    hasStartedModule,
    isModuleLoaded,
    user?.permissions,
    moduleInfo.title,
    moduleInfo.description,
    onLoadPreliminaryQuizzes,
    onFinishInitialQuiz,
  ]);

  return {
    isOpen,
    isStarted,
    isStreaming,
    quizzes,
    currentQuiz: quizzes ? quizzes[currentIndex] : undefined,
    currentIndex,
    isAnswered,
    isCorrect,
    score,
    onStartQuiz,
    onAnswerQuiz,
    onNextQuiz,
  };
}
