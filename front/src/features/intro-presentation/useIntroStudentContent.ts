import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { sidebarItems } from "../../config/sidebarItems";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { AuthContext } from "../../store/AuthProvider";
import { dashboardStudentApi } from "../dashboard-student/api/dashboard-student.api";
import { useStudentDashboard } from "../dashboard-student/hooks/use-student-dashboard";
import type { IntroRoleOption } from "./intro-role";
import {
  buildNavEntries,
  buildStudentContent,
  type IntroSpaceContent,
} from "./intro-space-content";
import { useIntroSpaceReady } from "./useIntroSpaceReady";

/** Contenu du dashboard apprenant, lu avec les mêmes requêtes que le vrai dashboard. */
export const useIntroStudentContent = (role: IntroRoleOption) => {
  const ability = useContext(AbilityContext);
  const { user } = useContext(AuthContext);
  const { welcomeTitle, welcomeMessage, lastLesson, learningContext } =
    useStudentDashboard();

  const parcours = useQuery({
    queryKey: ["parcours-as-student"],
    queryFn: dashboardStudentApi.queries.getParcoursAsStudent,
  });

  const isReady = useIntroSpaceReady(
    learningContext.isLoading || parcours.isLoading,
  );

  const content = useMemo<IntroSpaceContent>(
    () =>
      buildStudentContent({
        role,
        person: { firstname: user?.firstname, lastname: user?.lastname },
        title: welcomeTitle,
        message: welcomeMessage,
        nav: buildNavEntries(sidebarItems.student, {
          canRead: (item) => ability.can("read", item.subject),
          isTeacher: false,
        }),
        lastLesson: lastLesson
          ? {
              course: lastLesson.lesson.course?.title,
              lesson: lastLesson.lesson.title,
            }
          : undefined,
        parcours: (parcours.data ?? []).map((item) => ({
          title: item.title,
          formation: item.formation?.title,
        })),
      }),
    [ability, lastLesson, parcours.data, role, user, welcomeMessage, welcomeTitle],
  );

  return { content, isReady };
};
