import RoleRankGuard from "../../../components/guards/RoleRankGuard";
import LastParcours from "../components/last-parcours";
import LastFeedback from "../components/last-feedback";
import TeacherLessonsQualityStats from "../components/teacher-lessons-quality-stats/teacher-lessons-quality-stats";
import LastModules from "../components/last-modules";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import OnboardingWelcome from "../../onboarding/OnboardingWelcome";
import RecommendedActions from "../components/recommended-actions";
import { useAdminDashboard } from "../hooks/use-admin-dashboard";

const AdminDashboard = () => {
  const {
    user,
    showOnboardingWelcome,
    welcomeTitle,
    welcomeMessage,
    parcours,
    modules,
    recommendedActions,
    isParcoursLoading,
    isModulesLoading,
    areRecommendationsLoading,
  } = useAdminDashboard();

  return (
    <PageWrapper>
      {/* --- Bannière de bienvenue --- */}
      <div data-onboarding="admin-dashboard-header">
        {showOnboardingWelcome ? (
          <OnboardingWelcome layout="admin" />
        ) : (
          <Header
            title={welcomeTitle}
            description={welcomeMessage}
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
    </PageWrapper>
  );
};

export default AdminDashboard;
