import { useMemo } from "react";

import { useRoleLabels } from "../role/hooks/useRoleLabels";
import { withInstanceRoleLabels } from "./intro-role";

/** Rôles de la présentation, nommés selon les libellés configurés pour l'instance. */
export const useIntroRoles = () => {
  const { labels } = useRoleLabels();
  return useMemo(() => withInstanceRoleLabels(labels), [labels]);
};
