import { isAiDisabled } from "../../../config/ai/ai";
import { ChatbotProvider } from "../../../store/ChatbotProvider";
import Chatbot from "../../../features/chatbot/components/chatbot";
import RouteGuard from "../../guards/RouteGuard";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import FadeWrapper from "../FadeWrapper";
import OnboardingTour from "../../../features/onboarding/OnboardingTour";

const AdminLayout = () => (
  <ChatbotProvider>
    <OnboardingTour layout="admin">
      <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
        <FadeWrapper>
          <RouteGuard layout="admin" />
        </FadeWrapper>
      </AppWrapper>
      {!isAiDisabled && <Chatbot />}
    </OnboardingTour>
  </ChatbotProvider>
);

export default AdminLayout;
