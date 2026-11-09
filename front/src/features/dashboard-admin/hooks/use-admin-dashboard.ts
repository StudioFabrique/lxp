import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../store/AuthProvider";
import { formatWelcomeTitle } from "../../../utils/helpers/welcome-title";
import { dashboardAdminApi } from "../api/dashboard-admin.api";

const defaultTitle = "Bonjour {firstname} !";
const adminDescription =
  "Bienvenue dans votre panneau d'administration, l'outil central pour gérer et surveiller tous les aspects de l'apprentissage de vos apprenants";
const teacherDescription =
  "Bienvenue dans votre espace pédagogique, retrouvez vos contenus et accompagnez vos apprenants";

export function useAdminDashboard() {
  const { user } = useContext(AuthContext);
  const userRank = user?.roles.length ? (user.roles[0]?.rank ?? 4) : 4;
  const isAdministrator = userRank <= 1;
  const isRoot = userRank === 0;
  const isTeacher = userRank === 2;

  const { data: parcours = [], isLoading: isParcoursLoading } = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
  });

  const { data: modules = [], isLoading: isModulesLoading } = useQuery({
    queryKey: ["dashboard", "last-modules"],
    queryFn: dashboardAdminApi.queries.getLastModules,
  });

  const teachersCount = useQuery({
    queryKey: ["dashboard", "onboarding", "users", "teacher"],
    queryFn: () => dashboardAdminApi.queries.getUsersCountByRole("teacher"),
    enabled: isAdministrator,
  });

  const adminsCount = useQuery({
    queryKey: ["dashboard", "onboarding", "users", "admin"],
    queryFn: () => dashboardAdminApi.queries.getUsersCountByRole("admin"),
    enabled: isRoot,
  });

  const studentsCount = useQuery({
    queryKey: ["dashboard", "onboarding", "users", "student"],
    queryFn: () => dashboardAdminApi.queries.getUsersCountByRole("student"),
    enabled: isAdministrator || isTeacher,
  });

  const groupsCount = useQuery({
    queryKey: ["dashboard", "onboarding", "groups"],
    queryFn: dashboardAdminApi.queries.getStudentGroupsCount,
    enabled: isAdministrator || isTeacher,
  });

  const areCountsLoading =
    (isAdministrator && teachersCount.isLoading) ||
    (isRoot && adminsCount.isLoading) ||
    ((isAdministrator || isTeacher) &&
      (studentsCount.isLoading || groupsCount.isLoading));
  return {
    user,
    welcomeTitle: formatWelcomeTitle(defaultTitle, user),
    welcomeMessage: isTeacher ? teacherDescription : adminDescription,
    parcours,
    modules,
    isRoot,
    teachersCount: teachersCount.data,
    adminsCount: adminsCount.data,
    studentsCount: studentsCount.data,
    groupsCount: groupsCount.data,
    isParcoursLoading,
    isModulesLoading,
    areCountsLoading,
  };
}
