import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { indicatorsApi } from "../api/indicators.api";

const DEFAULT_ERROR = "Le modèle de prédiction n'a pas pu être interrogé.";

/**
 * L'API renvoie une raison précise — service IA injoignable, modèle jamais
 * entraîné, droits insuffisants — qui doit remonter telle quelle : « erreur
 * inconnue » n'aiderait personne à savoir quoi faire.
 */
function predictionErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? DEFAULT_ERROR;
  }

  return DEFAULT_ERROR;
}

/**
 * Interroge le modèle IA sur les indicateurs d'un apprenant.
 *
 * Une mutation et non une requête : l'appel n'est lancé qu'à la demande
 * explicite d'un membre de l'équipe pédagogique. Charger une prédiction
 * d'abandon à l'ouverture de chaque fiche coûterait une inférence par visite,
 * et donnerait à un pronostic la place d'une donnée de suivi.
 *
 * `range` reprend la fenêtre des indicateurs affichés : la prédiction porte
 * ainsi sur exactement ce que l'utilisateur a sous les yeux.
 */
export default function useStudentPrediction(
  studentId: string,
  range?: { from: string; to: string } | null,
) {
  const mutation = useMutation({
    mutationFn: () =>
      indicatorsApi.mutations.predictStudentOutcome(
        studentId,
        range ?? undefined,
      ),
    onError: (error: unknown) => {
      toast.error(predictionErrorMessage(error));
    },
  });

  return {
    prediction: mutation.data ?? null,
    predict: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}
