import { ChatbotProvider } from "../../../store/ChatbotProvider";
import Chatbot from "../../../features/chatbot/components/chatbot";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import ConfettiWrapper from "../ConfettiWrapper";
import FadeWrapper from "../FadeWrapper";
import IntroPresentationHidden from "../../../features/intro-presentation/IntroPresentationHidden";
import IntroPresentationGate from "../../../features/intro-presentation/IntroPresentationGate";
import { IntroPresentationProvider } from "../../../features/intro-presentation/IntroPresentationProvider";
import { useDemoMode } from "../../../store/DemoContext";
import { useQuery } from "@tanstack/react-query";
import {
  learningProfileApi,
  learningProfileKey,
} from "../../../features/learning-profile/learning-profile.api";
import { Outlet } from "react-router";

const StudentLayout = () => {
  const { demoMode, aiDisabled, isConfigLoaded } = useDemoMode();
  const learningContext = useQuery({
    queryKey: learningProfileKey,
    queryFn: learningProfileApi.get,
    enabled: isConfigLoaded && !demoMode,
  });
  // La présentation vient après le questionnaire d'apprentissage, et seulement
  // s'il y a du contenu à illustrer.
  const isIntroEligible =
    learningContext.data?.hasAvailableContent === true &&
    learningContext.data.onboardingRequired === false;

  return (
    <ChatbotProvider>
      <IntroPresentationProvider isEligible={isIntroEligible}>
        <ConfettiWrapper>
          <AppWrapper
            sidebar={<Sidebar />}
            loader={<Loader />}
          >
            <FadeWrapper>
              <IntroPresentationGate>
                <Outlet />
              </IntroPresentationGate>
            </FadeWrapper>
          </AppWrapper>
        </ConfettiWrapper>
        {isConfigLoaded && !aiDisabled && (
          <IntroPresentationHidden>
            <Chatbot enableQuizSuggestion />
          </IntroPresentationHidden>
        )}
      </IntroPresentationProvider>
    </ChatbotProvider>
  );
};

export default StudentLayout;
