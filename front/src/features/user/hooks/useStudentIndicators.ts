import { useQuery } from "@tanstack/react-query";
import { indicatorsApi } from "../api/indicators.api";

/**
 * Charge les indicateurs d'un apprenant.
 *
 * Un seul appel pour l'ensemble : chaque indicateur porte son propre état de
 * disponibilité, un calcul en échec côté serveur n'empêche pas l'affichage
 * des autres.
 */
export default function useStudentIndicators(studentId: string) {
  const query = useQuery({
    queryKey: ["user", "indicators", studentId],
    queryFn: () => indicatorsApi.queries.getStudentIndicators(studentId),
    enabled: !!studentId,
  });

  return {
    indicators: query.data?.indicators ?? null,
    range: query.data
      ? { from: query.data.from, to: query.data.to }
      : null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
