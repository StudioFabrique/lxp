import { isAiDisabled } from "../../../config/ai/ai";
import { ChatbotProvider } from "../../../store/ChatbotProvider";
import Chatbot from "../../../features/chatbot/components/chatbot";
import RouteGuard from "../../guards/RouteGuard";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import ConfettiWrapper from "../ConfettiWrapper";
import FadeWrapper from "../FadeWrapper";
import OnboardingTour from "../../../features/onboarding/OnboardingTour";

const StudentLayout = () => (
  <ChatbotProvider>
    <OnboardingTour layout="student">
      <ConfettiWrapper>
        <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
          <FadeWrapper>
            <RouteGuard layout="student" />
          </FadeWrapper>
        </AppWrapper>
      </ConfettiWrapper>
      {!isAiDisabled && <Chatbot />}
    </OnboardingTour>
  </ChatbotProvider>
);

export default StudentLayout;
