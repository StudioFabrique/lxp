import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

/**
 * Données d'identité de l'apprenant affichées dans la vue administrateur.
 *
 * Les indicateurs chiffrés ne sont plus calculés ici : temps de connexion et
 * tokens étaient agrégés dans le navigateur, avec un arrondi à l'heure
 * supérieure qui faussait l'affichage. Ils viennent maintenant de
 * `useStudentIndicators`.
 */
const useTeacher = (studentId: string) => {
  const studentQuery = useQuery({
    queryKey: ["user", "data", studentId],
    queryFn: () => userApi.queries.getUserData(studentId),
    enabled: !!studentId,
  });

  const student = studentQuery.data?.user ?? null;
  const parcours = studentQuery.data?.parcours ?? null;
  const imageUrl = parcours?.image
    ? `data:image/jpeg;base64,${parcours.image}`
    : "/images/parcours-default.webp";

  return {
    imageUrl,
    student,
    parcours,
    isLoading: studentQuery.isLoading,
    isError: studentQuery.isError,
  };
};

export default useTeacher;
