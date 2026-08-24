import { ChatbotProvider } from "../../../store/ChatbotProvider";
import Chatbot from "../../../features/chatbot/components/chatbot";
import RouteGuard from "../../guards/RouteGuard";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import ConfettiWrapper from "../ConfettiWrapper";
import FadeWrapper from "../FadeWrapper";
import OnboardingTour from "../../../features/onboarding/OnboardingTour";
import DemoTour from "../../../features/demo/components/DemoTour";
import DemoBanner from "../../../features/demo/components/DemoBanner";
import { useDemoMode } from "../../../store/DemoContext";

const StudentLayout = () => {
  const { demoMode, aiDisabled } = useDemoMode();

  return (
    <ChatbotProvider>
      {/* Voir AdminLayout : le fournisseur reste monté, le tutoriel non. */}
      <OnboardingTour layout="student">
        <ConfettiWrapper>
          <AppWrapper
            sidebar={<Sidebar />}
            loader={<Loader />}
            topbar={demoMode ? <DemoBanner /> : undefined}
          >
            <FadeWrapper>
              <RouteGuard layout="student" />
            </FadeWrapper>
          </AppWrapper>
        </ConfettiWrapper>
        {!aiDisabled && <Chatbot />}
        {demoMode && <DemoTour layout="student" />}
      </OnboardingTour>
    </ChatbotProvider>
  );
};

export default StudentLayout;
