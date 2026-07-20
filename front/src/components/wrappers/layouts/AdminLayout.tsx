import { isAiDisabled } from "../../../config/ai/ai";
import { ChatbotProvider } from "../../../store/ChatbotProvider";
import { ROLES_RANKS } from "../../../utils/helpers/roles-rank";
import Chatbot from "../../../features/chatbot/components/chatbot";
import RouteGuard from "../../guards/RouteGuard";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import FadeWrapper from "../FadeWrapper";

const AdminLayout = () => (
  <ChatbotProvider>
    <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
      <FadeWrapper>
        <RouteGuard
          allowedRanks={[ROLES_RANKS.SUPER_ADMIN, ROLES_RANKS.ADMIN]}
        />
      </FadeWrapper>
    </AppWrapper>
    {!isAiDisabled && <Chatbot />}
  </ChatbotProvider>
);

export default AdminLayout;
