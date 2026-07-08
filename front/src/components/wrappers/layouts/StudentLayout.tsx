import { isAiDisabled } from "../../../config/ai/ai";
import { ChatbotProvider } from "../../../store/ChatbotProvider";
import { ROLES_RANKS } from "../../../utils/helpers/roles-rank";
import Chatbot from "../../chatbot/chatbot";
import RouteGuard from "../../guards/RouteGuard";
import Loader from "../../loaders/Loader";
import Sidebar from "../../sidebar/Sidebar";
import AppWrapper from "../AppWrapper";
import ConfettiWrapper from "../ConfettiWrapper";
import FadeWrapper from "../FadeWrapper";

const StudentLayout = () => (
  <ChatbotProvider>
    <ConfettiWrapper>
      <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
        <FadeWrapper>
          <RouteGuard allowedRanks={[ROLES_RANKS.STUDENT]} />
        </FadeWrapper>
      </AppWrapper>
    </ConfettiWrapper>
    {!isAiDisabled && <Chatbot />}
  </ChatbotProvider>
);

export default StudentLayout;
