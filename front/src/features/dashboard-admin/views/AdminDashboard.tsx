import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardAdminApi } from "../api/dashboard-admin.api";
import { AuthContext } from "../../../store/AuthProvider";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import TeacherLastParcours from "../components/teacher-last-parcours";
import LastParcours from "../components/last-parcours";
import LastFeedback from "../components/last-feedback";
import TeacherLessonsQualityStats from "../components/teacher-lessons-quality-stats/teacher-lessons-quality-stats";
import LastModules from "../components/last-modules";
import SidebarRouteIcon from "../../../components/headers/SidebarRouteIcon";
import OnboardingWelcome from "../../onboarding/OnboardingWelcome";
import { useOnboarding } from "../../onboarding/OnboardingContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { status: onboardingStatus } = useOnboarding();
  const isTeacher =
    user?.roles.some((role) => role.role === "teacher") ?? false;
  const showOnboardingWelcome = onboardingStatus === "pending";

  const { data: teacherParcours = [], isLoading: isTeacherParcoursLoading } =
    useQuery({
      queryKey: ["last-parcours"],
      queryFn: dashboardAdminApi.queries.getLastParcours,
      enabled: isTeacher,
    });

  const { data: parcours = [], isLoading: isParcoursLoading } = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
  });

  const { data: modules = [], isLoading: isModulesLoading } = useQuery({
    queryKey: ["dashboard", "last-modules"],
    queryFn: dashboardAdminApi.queries.getLastModules,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* --- Bannière de bienvenue --- */}
      <div data-onboarding="admin-dashboard-header">
        {showOnboardingWelcome ? (
          <OnboardingWelcome layout="admin" />
        ) : (
          <section className="bg-base-200 border border-base-300 rounded-lg p-6 shadow-sm w-full">
            <h2 className="flex items-center gap-3 text-3xl font-extrabold capitalize text-primary mb-2">
              <SidebarRouteIcon />
              <span>
                Bonjour, {user?.firstname} {user?.lastname} !
              </span>
            </h2>
            <p className="text-base-content opacity-80 max-w-3xl">
              Bienvenue dans votre panneau d'administration, l'outil central
              pour gérer et surveiller tous les aspects de l'apprentissage de
              vos apprenants.
            </p>
          </section>
        )}
      </div>

      {/* --- Contenu Principal --- */}
      <section className="w-full flex flex-col 2xl:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <article className="w-full flex flex-col gap-10">
            {isTeacher && teacherParcours.length > 0 ? (
              <TeacherLastParcours
                parcours={teacherParcours}
                isLoading={isTeacherParcoursLoading}
              />
            ) : null}
            <LastParcours parcours={parcours} isLoading={isParcoursLoading} />
            {modules.length > 0 && (
              <LastModules modules={modules} isLoading={isModulesLoading} />
            )}
          </article>

          <article className="w-full flex flex-col xl:flex-row gap-6">
            <PermissionGuard action="component" object="last-feedback">
              <LastFeedback />
            </PermissionGuard>
            <PermissionGuard action="component" object="lessons-rating-stats">
              <TeacherLessonsQualityStats />
            </PermissionGuard>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
