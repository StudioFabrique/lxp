import Chat from "./chat";
import StudentAccomplishments from "./feedback-apprenant/student-accomplishments";
import FeelingFeedback from "./feeling-feedback";
import MostReadCourses from "./most-read-courses";

const RightSide = () => {
  return (
    <div className="flex flex-col xl:px-10 gap-5">
      <FeelingFeedback />
      <StudentAccomplishments />
      <MostReadCourses />
      <Chat />
    </div>
  );
};

export default RightSide;
