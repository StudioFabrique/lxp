import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

const useTeacher = (studentId: string) => {
  const studentQuery = useQuery({
    queryKey: ["user", "data", studentId],
    queryFn: () => userApi.queries.getUserData(studentId),
    enabled: !!studentId,
  });

  const progressionQuery = useQuery({
    queryKey: ["user", "progression", studentId],
    queryFn: () => userApi.queries.getUserProgression(studentId),
    enabled: !!studentId,
  });

  const student = studentQuery.data?.user ?? null;
  const parcours = studentQuery.data?.parcours ?? null;
  const completionModules = progressionQuery.data?.data?.result ?? [];
  const parcoursCompletion =
    progressionQuery.data?.data?.parcoursCompletion ?? 0;
  const imageUrl = parcours?.image
    ? `data:image/jpeg;base64,${parcours.image}`
    : "/images/parcours-default.webp";

  const totalConnectionTime = useMemo(() => {
    const totalDuration =
      student?.connectionInfos?.reduce(
        (total, connection) => total + connection.duration,
        0,
      ) ?? 0;

    return Math.ceil(totalDuration / 3600000);
  }, [student]);

  const totalTokens = useMemo(
    () =>
      studentQuery.data?.totalTokens ??
      student?.promptStats?.reduce(
        (total, stat) => total + stat.tokensUsed,
        0,
      ) ??
      0,
    [student, studentQuery.data?.totalTokens],
  );

  return {
    imageUrl,
    student,
    parcours,
    parcoursCompletion,
    totalConnectionTime,
    totalTokens,
    completionModules,
    isLoading: studentQuery.isLoading || progressionQuery.isLoading,
    isError: studentQuery.isError,
  };
};

export default useTeacher;
