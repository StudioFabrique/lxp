import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../store/AuthProvider";
import { formatWelcomeTitle } from "../../../utils/helpers/welcome-title";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import { profileApi } from "../../profile/api/profile.api";
import { dashboardAdminApi } from "../api/dashboard-admin.api";
import { buildRecommendedActions } from "../components/build-recommended-actions";

const defaultTitle = "Bonjour, {firstname} {lastname} !";
const adminDescription =
  "Bienvenue dans votre panneau d'administration, l'outil central pour gérer et surveiller tous les aspects de l'apprentissage de vos apprenants";
const teacherDescription =
  "Bienvenue dans votre espace pédagogique, retrouvez vos contenus et accompagnez vos apprenants";

export function useAdminDashboard() {
  const { user } = useContext(AuthContext);
  const { status: onboardingStatus, canStart: canStartOnboarding } =
    useOnboarding();
  const userRank = user?.roles.length ? (user.roles[0]?.rank ?? 4) : 4;
  const isAdministrator = userRank <= 1;
  const isRoot = userRank === 0;
  const isTeacher = userRank === 2;

  const { data: instanceSettings, isLoading: isInstanceSettingsLoading } = useQuery({
    queryKey: ["instance-settings"],
    queryFn: profileApi.queries.getInstanceSettings,
  });

  const { data: parcours = [], isLoading: isParcoursLoading } = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
  });

  const { data: modules = [], isLoading: isModulesLoading } = useQuery({
    queryKey: ["dashboard", "last-modules"],
    queryFn: dashboardAdminApi.queries.getLastModules,
  });

  const teachersCount = useQuery({
    queryKey: ["dashboard", "recommended-actions", "users", "teacher"],
    queryFn: () => dashboardAdminApi.queries.getUsersCountByRole("teacher"),
    enabled: isAdministrator,
  });

  const adminsCount = useQuery({
    queryKey: ["dashboard", "recommended-actions", "users", "admin"],
    queryFn: () => dashboardAdminApi.queries.getUsersCountByRole("admin"),
    enabled: isRoot,
  });

  const studentsCount = useQuery({
    queryKey: ["dashboard", "recommended-actions", "users", "student"],
    queryFn: () => dashboardAdminApi.queries.getUsersCountByRole("student"),
    enabled: isTeacher,
  });

  const groupsCount = useQuery({
    queryKey: ["dashboard", "recommended-actions", "groups"],
    queryFn: dashboardAdminApi.queries.getStudentGroupsCount,
    enabled: isTeacher,
  });

  const recommendedActions = buildRecommendedActions({
    userRank,
    teachersCount: teachersCount.data,
    adminsCount: adminsCount.data,
    studentsCount: studentsCount.data,
    groupsCount: groupsCount.data,
    hasLogo: instanceSettings?.hasLogo,
    parcours,
  });

  const areRecommendationsLoading =
    (isAdministrator && teachersCount.isLoading) ||
    (isRoot && adminsCount.isLoading) ||
    (isRoot && isInstanceSettingsLoading) ||
    (isTeacher &&
      (studentsCount.isLoading || groupsCount.isLoading || isParcoursLoading));
  return {
    user,
    showOnboardingWelcome:
      onboardingStatus === "pending" && canStartOnboarding,
    welcomeTitle: formatWelcomeTitle(defaultTitle, user),
    welcomeMessage: isTeacher ? teacherDescription : adminDescription,
    parcours,
    modules,
    recommendedActions,
    isParcoursLoading,
    isModulesLoading,
    areRecommendationsLoading,
  };
}
