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
import { isTeacherUser } from "../../../utils/helpers/user-role";
import GroupAiAlerts from "../components/group-ai-alerts";
import QuickActions from "../components/quick-actions";
import { useSearchParams } from "react-router";
import { emitOnboardingEvent } from "../../onboarding/onboarding-events";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const isTeacher = isTeacherUser(user);

  const openCreateModal = (key: "createFormation" | "createParcours") => {
    if (key === "createFormation") emitOnboardingEvent({ type: "formation_entry_clicked" });
    const next = new URLSearchParams(searchParams);
    next.set(key, "true");
    setSearchParams(next);
  };

  return (
    <PageWrapper>
      {showOnboardingWelcome ? (
        <div data-onboarding="admin-dashboard-header">
          <OnboardingWelcome layout="admin" />
        </div>
      ) : (
        <Header
          title={welcomeTitle}
          description={welcomeMessage}
          classname="capitalize"
          containerClassname="z-20"
        >
          {isTeacher && (
            <QuickActions
              onCreateFormation={() => openCreateModal("createFormation")}
              onCreateParcours={() => openCreateModal("createParcours")}
            />
          )}
        </Header>
      )}

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
            <LastParcours parcours={parcours} isLoading={isParcoursLoading} showQuickActions={!isTeacher} />
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
        {isTeacherUser(user) && <GroupAiAlerts />}
      </section>
    </PageWrapper>
  );
};

export default AdminDashboard;
