import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { sidebarItems } from "../../config/sidebarItems";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { getModulesLabel, isTeacherUser } from "../../utils/helpers/user-role";
import type StudentFeedback from "../../utils/interfaces/student-feedback";
import { dashboardAdminApi } from "../dashboard-admin/api/dashboard-admin.api";
import { useAdminDashboard } from "../dashboard-admin/hooks/use-admin-dashboard";
import type { IntroRoleOption } from "./intro-role";
import {
  buildNavEntries,
  buildTeamContent,
  type IntroSpaceContent,
} from "./intro-space-content";
import { useIntroSpaceReady } from "./useIntroSpaceReady";

/**
 * Contenu du dashboard de l'équipe (root, administrateur, pédagogique), lu avec
 * les mêmes requêtes et règles que le vrai dashboard.
 */
export const useIntroTeamContent = (role: IntroRoleOption) => {
  const ability = useContext(AbilityContext);
  const {
    user,
    welcomeTitle,
    welcomeMessage,
    parcours,
    modules,
    recommendedActions,
    isParcoursLoading,
    isModulesLoading,
    areRecommendationsLoading,
  } = useAdminDashboard();
  const isTeacher = isTeacherUser(user);

  const feedbacks = useQuery({
    queryKey: ["intro-presentation", "last-feedbacks"],
    queryFn: async () => {
      const data = await dashboardAdminApi.queries.getLastFeedbacks();
      return data.success ? (data.response as StudentFeedback[]) : [];
    },
    enabled: isTeacher,
  });

  const isReady = useIntroSpaceReady(
    isParcoursLoading ||
      isModulesLoading ||
      areRecommendationsLoading ||
      (isTeacher && feedbacks.isLoading),
  );

  const content = useMemo<IntroSpaceContent>(
    () =>
      buildTeamContent({
        role,
        person: { firstname: user?.firstname, lastname: user?.lastname },
        isTeacher,
        title: welcomeTitle,
        message: welcomeMessage,
        nav: buildNavEntries(sidebarItems.admin, {
          canRead: (item) => ability.can("read", item.subject),
          isTeacher,
          displayLabel: (item) =>
            item.key === "module" ? getModulesLabel(user, item.label) : item.label,
        }),
        recommended: recommendedActions,
        modules,
        modulesTitle: getModulesLabel(user, "Derniers modules créés"),
        parcours,
        feedbacks: feedbacks.data ?? [],
        canCreateFormation: ability.can("write", "formation"),
        canCreateParcours: ability.can("write", "parcours"),
      }),
    [
      ability,
      feedbacks.data,
      isTeacher,
      modules,
      parcours,
      recommendedActions,
      role,
      user,
      welcomeMessage,
      welcomeTitle,
    ],
  );

  return { content, isReady };
};
