import { useCallback, useMemo, useRef } from "react";
import apiClient from "../../../lib/axios";
import type { UserAnswer } from "../interfaces/quiz";

type AttemptOrigin = "self_test" | "ending_course" | "preliminary";

type AttemptScope = {
  courseId?: number;
  moduleId?: number;
};

/**
 * Persiste le déroulé d'un quiz : ouverture, réponses, clôture.
 *
 * Jusqu'ici, score et réponses ne vivaient que dans le state React et
 * disparaissaient à la fermeture de la modale — d'où l'impossibilité de
 * calculer le moindre taux de réussite.
 *
 * Le serveur corrige lui-même les réponses : on ne lui envoie que la réponse
 * brute de l'apprenant, jamais le `isCorrect` calculé dans le navigateur.
 *
 * Tous les appels sont silencieux en cas d'échec : le suivi statistique ne
 * doit jamais interrompre un quiz en cours.
 */
export default function useQuizAttemptTracking() {
  const attemptIdRef = useRef<number | null>(null);

  const start = useCallback(
    async (origin: AttemptOrigin, scope: AttemptScope) => {
      attemptIdRef.current = null;
      try {
        const res = await apiClient.post<{ id: number }>("/quiz/attempt", {
          origin,
          ...scope,
        });
        // 204 : l'utilisateur n'est pas suivi (formateur, administrateur).
        attemptIdRef.current = res.data?.id ?? null;
      } catch {
        attemptIdRef.current = null;
      }
    },
    [],
  );

  const recordAnswer = useCallback(
    (externalId: string, userAnswer: UserAnswer) => {
      const attemptId = attemptIdRef.current;
      if (!attemptId) return;

      // Les questions « random » injectées après une mauvaise réponse
      // n'appartiennent à aucun quiz persisté : l'API répond 404 et la
      // réponse est simplement ignorée.
      apiClient
        .post(`/quiz/attempt/${attemptId}/answer`, { externalId, userAnswer })
        .catch(() => undefined);
    },
    [],
  );

  const finish = useCallback(() => {
    const attemptId = attemptIdRef.current;
    if (!attemptId) return;

    attemptIdRef.current = null;
    apiClient
      .put(`/quiz/attempt/${attemptId}/finish`)
      .catch(() => undefined);
  }, []);

  // Référence stable : les hooks appelants la déclarent en dépendance de
  // leurs `useCallback`, un objet recréé à chaque rendu les invaliderait.
  return useMemo(
    () => ({ start, recordAnswer, finish }),
    [start, recordAnswer, finish],
  );
}
