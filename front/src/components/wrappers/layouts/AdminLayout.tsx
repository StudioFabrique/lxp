import { ChatbotProvider } from "../../../store/ChatbotProvider";
import Chatbot from "../../../features/chatbot/components/chatbot";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import FadeWrapper from "../FadeWrapper";
import { useDemoMode } from "../../../store/DemoContext";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const { aiDisabled, isConfigLoaded } = useDemoMode();

  return (
    <ChatbotProvider>
      <AppWrapper
        sidebar={<Sidebar />}
        loader={<Loader />}
      >
        <FadeWrapper>
          <Outlet />
        </FadeWrapper>
      </AppWrapper>
      {isConfigLoaded && !aiDisabled && <Chatbot />}
    </ChatbotProvider>
  );
};

export default AdminLayout;
