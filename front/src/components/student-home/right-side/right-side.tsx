import Chat from "./chat";
import FeedbackApprenant from "./feedback-apprenant";
import FeelingFeedback from "./feeling-feedback";
import MostReadCourses from "./most-read-courses";

const RightSide = () => {
  return (
    <div className="flex flex-col px-10 gap-5">
      <FeelingFeedback />
      <Chat />
      <FeedbackApprenant />
      <MostReadCourses />
    </div>
  );
};

export default RightSide;
