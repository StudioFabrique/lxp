import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { BASE_API_URL } from "../../../config/urls";
import { profileApi } from "../api/profile.api";
import { profileKeys } from "../api/profile.keys";

/**
 * Lien vers la consultation des journaux (VictoriaLogs, servie par l'API).
 * À monter pour le root uniquement : le lien n'apparaît que si l'instance a
 * déployé la couche d'observabilité (jamais en démonstration).
 */
export default function ObservabilityLink() {
  const { data } = useQuery({
    queryKey: profileKeys.observabilityStatus(),
    queryFn: profileApi.queries.getObservabilityStatus,
    staleTime: 5 * 60_000,
    retry: false,
  });

  if (!data?.enabled) return null;

  return (
    <a
      href={`${BASE_API_URL}/observability/select/vmui/`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline btn-sm mt-2 h-8 min-h-8 w-full gap-2 text-xs"
    >
      <ScrollText className="size-3.5 shrink-0" aria-hidden="true" />
      Journaux de l’instance
      <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
    </a>
  );
}
