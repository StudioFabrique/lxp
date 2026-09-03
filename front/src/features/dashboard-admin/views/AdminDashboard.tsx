import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardAdminApi } from "../api/dashboard-admin.api";
import { AuthContext } from "../../../store/AuthProvider";
import RoleRankGuard from "../../../components/guards/RoleRankGuard";
import LastParcours from "../components/last-parcours";
import LastFeedback from "../components/last-feedback";
import TeacherLessonsQualityStats from "../components/teacher-lessons-quality-stats/teacher-lessons-quality-stats";
import LastModules from "../components/last-modules";
import Header from "../../../components/headers/Header";
import OnboardingWelcome from "../../onboarding/OnboardingWelcome";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import RecommendedActions from "../components/recommended-actions";
import { buildRecommendedActions } from "../components/build-recommended-actions";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { status: onboardingStatus } = useOnboarding();
  const showOnboardingWelcome = onboardingStatus === "pending";
  const userRank = user?.roles.length
    ? Math.min(...user.roles.map(({ rank }) => rank), 4)
    : 4;
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
    parcours,
  });

  const areRecommendationsLoading =
    (isAdministrator && teachersCount.isLoading) ||
    (isRoot && adminsCount.isLoading) ||
    (isTeacher &&
      (studentsCount.isLoading ||
        groupsCount.isLoading ||
        isParcoursLoading));

  return (
    <div className="w-full flex flex-col gap-6">
      {/* --- Bannière de bienvenue --- */}
      <div data-onboarding="admin-dashboard-header">
        {showOnboardingWelcome ? (
          <OnboardingWelcome layout="admin" />
        ) : (
          <Header
            title={`Bonjour, ${user?.firstname} ${user?.lastname} !`}
            description="Bienvenue dans votre panneau d'administration, l'outil central pour gérer et surveiller tous les aspects de l'apprentissage de vos apprenants."
            classname="capitalize"
          />
        )}
      </div>

      {/* --- Contenu Principal --- */}
      <section className="w-full flex flex-col 2xl:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <article className="w-full flex flex-col gap-10">
            {user ? (
              <RecommendedActions
                userId={user._id}
                actions={recommendedActions}
                isLoading={areRecommendationsLoading}
              />
            ) : null}
            <LastParcours parcours={parcours} isLoading={isParcoursLoading} />
            <LastModules modules={modules} isLoading={isModulesLoading} />
          </article>

          <article className="w-full flex flex-col xl:flex-row gap-6">
            <RoleRankGuard ranks={[2]}>
              <LastFeedback />
            </RoleRankGuard>
            <RoleRankGuard ranks={[2]}>
              <TeacherLessonsQualityStats />
            </RoleRankGuard>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
