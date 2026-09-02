import { useEffect } from "react";
import { useParams } from "react-router";

import { scrollToTop } from "../../../utils/helpers/scroll-to-top";
import { normalizeImageSource } from "../../../utils/images/image-source";
import { useParcoursModules } from "./useParcoursModules";
import { useParcoursQuery } from "./useParcoursQuery";

export default function useParcoursView() {
  const { id } = useParams();
  const parcoursId = Number(id);
  const { data: parcours, isLoading, error: queryError } =
    useParcoursQuery(parcoursId);
  const { modules } = useParcoursModules(parcoursId);

  useEffect(() => {
    scrollToTop();
  }, []);

  const error = queryError
    ? ((queryError as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ?? "Erreur inconnue")
    : "";

  return {
    isLoading,
    error,
    image: normalizeImageSource(parcours?.image),
    parcours: {
      id: parcours?.id,
      formation: parcours?.formation,
      canManage: parcours?.canManage,
    },
    parcoursInfos: parcours ?? { title: "" },
    modules,
    studentCount: (parcours as typeof parcours & { studentCount?: number })
      ?.studentCount,
  };
}
