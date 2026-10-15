import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../../profile/api/profile.api";
import { profileKeys } from "../../profile/api/profile.keys";
import {
  getRoleLabelForRank,
  resolveRoleLabels,
  toInlineRoleLabel,
} from "../helpers/role-labels";

/**
 * Libellés des rôles tels que configurés pour l'instance. Tant que les
 * paramètres ne sont pas chargés (ou en cas d'échec), les valeurs par défaut
 * s'affichent : l'interface n'attend jamais cette requête.
 */
export function useRoleLabels() {
  const { data: settings } = useQuery({
    queryKey: profileKeys.instanceSettings(),
    queryFn: profileApi.queries.getInstanceSettings,
    staleTime: 5 * 60 * 1000,
  });
  const labels = useMemo(
    () => resolveRoleLabels(settings?.roleLabels),
    [settings?.roleLabels],
  );
  const getRoleLabel = useCallback(
    (rank: number, fallback?: string) =>
      getRoleLabelForRank(labels, rank, fallback),
    [labels],
  );

  return {
    labels,
    getRoleLabel,
    /** Libellé du rang 2, au centre de nombreux écrans de parcours. */
    teamLabel: labels[2],
    /** Même libellé en minuscules, pour l'insérer dans une phrase. */
    teamInlineLabel: toInlineRoleLabel(labels[2]),
  };
}
