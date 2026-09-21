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
import { useDemoMode } from "../../../store/DemoContext";
import { useQuery } from "@tanstack/react-query";
import {
  learningProfileApi,
  learningProfileKey,
} from "../../../features/learning-profile/learning-profile.api";

const StudentLayout = () => {
  const { demoMode, aiDisabled, isConfigLoaded } = useDemoMode();
  const learningContext = useQuery({
    queryKey: learningProfileKey,
    queryFn: learningProfileApi.get,
    enabled: isConfigLoaded && !demoMode,
  });
  const navigationTourEnabled =
    demoMode ||
    (learningContext.data?.hasAvailableContent === true &&
      learningContext.data.onboardingRequired === false);

  return (
    <ChatbotProvider>
      {/* Voir AdminLayout : le fournisseur reste monté, le tutoriel non. */}
      <OnboardingTour layout="student" enabled={navigationTourEnabled}>
        <ConfettiWrapper>
          <AppWrapper
            sidebar={<Sidebar />}
            loader={<Loader />}
          >
            <FadeWrapper>
              <RouteGuard area="student" />
            </FadeWrapper>
          </AppWrapper>
        </ConfettiWrapper>
        {isConfigLoaded && !aiDisabled && <Chatbot enableQuizSuggestion />}
        {demoMode && <DemoTour layout="student" />}
      </OnboardingTour>
    </ChatbotProvider>
  );
};

export default StudentLayout;
