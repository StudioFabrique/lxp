import RoleRankGuard from "../../../components/guards/RoleRankGuard";
import LastParcours from "../components/last-parcours";
import LastFeedback from "../components/last-feedback";
import TeacherLessonsQualityStats from "../components/teacher-lessons-quality-stats/teacher-lessons-quality-stats";
import LastModules from "../components/last-modules";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import RecommendedActions from "../components/recommended-actions";
import { useAdminDashboard } from "../hooks/use-admin-dashboard";
import { isTeacherUser } from "../../../utils/helpers/user-role";
import GroupAiAlerts from "../components/group-ai-alerts";
import QuickActions from "../components/quick-actions";
import { useSearchParams } from "react-router";

const AdminDashboard = () => {
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
  const [searchParams, setSearchParams] = useSearchParams();
  const isTeacher = isTeacherUser(user);

  const openCreateModal = (key: "createFormation" | "createParcours") => {
    const next = new URLSearchParams(searchParams);
    next.set(key, "true");
    setSearchParams(next);
  };

  return (
    <PageWrapper>
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

      {/* --- Contenu Principal --- */}
      <section className="flex w-full flex-col gap-10">
        {user ? (
          <RecommendedActions
            userId={user._id}
            actions={recommendedActions}
            isLoading={areRecommendationsLoading}
          />
        ) : null}
        <LastParcours
          parcours={parcours}
          isLoading={isParcoursLoading}
          showQuickActions={!isTeacher}
          sideContent={isTeacher && parcours.some((formation) => formation.parcours.length > 0) ? <GroupAiAlerts /> : null}
        />
        <LastModules modules={modules} isLoading={isModulesLoading} />
        <article className="flex w-full flex-col gap-6 xl:flex-row">
          <RoleRankGuard ranks={[2]}>
            <LastFeedback />
          </RoleRankGuard>
          <RoleRankGuard ranks={[2]}>
            <TeacherLessonsQualityStats />
          </RoleRankGuard>
        </article>
      </section>
    </PageWrapper>
  );
};

export default AdminDashboard;
