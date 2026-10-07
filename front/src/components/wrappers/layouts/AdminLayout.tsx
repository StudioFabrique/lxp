import { ChatbotProvider } from "../../../store/ChatbotProvider";
import Chatbot from "../../../features/chatbot/components/chatbot";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import FadeWrapper from "../FadeWrapper";
import IntroPresentationHidden from "../../../features/intro-presentation/IntroPresentationHidden";
import IntroPresentationGate from "../../../features/intro-presentation/IntroPresentationGate";
import { IntroPresentationProvider } from "../../../features/intro-presentation/IntroPresentationProvider";
import { useDemoMode } from "../../../store/DemoContext";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const { aiDisabled, isConfigLoaded } = useDemoMode();

  return (
    <ChatbotProvider>
      <IntroPresentationProvider>
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
        {isConfigLoaded && !aiDisabled && (
          <IntroPresentationHidden>
            <Chatbot />
          </IntroPresentationHidden>
        )}
      </IntroPresentationProvider>
    </ChatbotProvider>
  );
};

export default AdminLayout;
