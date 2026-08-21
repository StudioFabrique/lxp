import { isAiDisabled } from "../../../config/ai/ai";
import { ChatbotProvider } from "../../../store/ChatbotProvider";
import Chatbot from "../../../features/chatbot/components/chatbot";
import RouteGuard from "../../guards/RouteGuard";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import FadeWrapper from "../FadeWrapper";
import OnboardingTour from "../../../features/onboarding/OnboardingTour";
import DemoTour from "../../../features/demo/components/DemoTour";
import DemoBanner from "../../../features/demo/components/DemoBanner";
import { useDemoMode } from "../../../store/DemoContext";

const AdminLayout = () => {
  const { demoMode, aiDisabled } = useDemoMode();

  return (
    <ChatbotProvider>
      {/* En démonstration, `OnboardingTour` ne fournit qu'un contexte inerte :
          plusieurs vues appellent `useOnboarding`, mais le tutoriel lui-même
          n'a pas lieu d'être sur un compte partagé. */}
      <OnboardingTour layout="admin">
        <AppWrapper
          sidebar={<Sidebar />}
          loader={<Loader />}
          topbar={demoMode ? <DemoBanner /> : undefined}
        >
          <FadeWrapper>
            <RouteGuard layout="admin" />
          </FadeWrapper>
        </AppWrapper>
        {!isAiDisabled && !aiDisabled && <Chatbot />}
        {demoMode && <DemoTour layout="admin" />}
      </OnboardingTour>
    </ChatbotProvider>
  );
};

export default AdminLayout;
