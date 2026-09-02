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

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { status: onboardingStatus } = useOnboarding();
  const showOnboardingWelcome = onboardingStatus === "pending";

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
            <LastParcours parcours={parcours} isLoading={isParcoursLoading} />
            {modules.length > 0 && (
              <LastModules modules={modules} isLoading={isModulesLoading} />
            )}
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
