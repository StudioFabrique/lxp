import type Course from "../../../utils/interfaces/course";
import type Module from "../../../utils/interfaces/module";
import useCourseQuiz from "../../quiz/hooks/use-course-quiz";
import useSmartQuizPrompt from "../../quiz/hooks/use-smart-quiz-prompt";
import type { ModuleContentStore } from "../hooks/use-module-content";
import type { ModuleCalendarStore } from "../hooks/use-module-calendar";
import CourseAssignmentView from "./assignment/course-assignment";
import ModuleCourseCalendar from "./calendar/module-course-calendar";
import ModuleData from "./module-data/module-data";
import ModuleContentPreview from "./preview/module-content-preview";

type ModuleContentBodyProps = {
  module: Module & { parcours: string };
  store: ModuleContentStore;
  calendar?: ModuleCalendarStore;
  selectedCourse?: Course;
  selectedAssignmentCourseId?: number;
  requestedAssignmentSubmissionId?: number;
  quiz: ReturnType<typeof useCourseQuiz>;
  smartQuiz: ReturnType<typeof useSmartQuizPrompt>;
  canEditSelectedLesson: boolean;
  canNavigateAsAdmin: boolean;
  isStaff: boolean;
};

export default function ModuleContentBody({
  module,
  store,
  calendar,
  selectedCourse,
  selectedAssignmentCourseId,
  requestedAssignmentSubmissionId,
  quiz,
  smartQuiz,
  canEditSelectedLesson,
  canNavigateAsAdmin,
  isStaff,
}: ModuleContentBodyProps) {
  if (calendar) {
    return <ModuleCourseCalendar module={module} store={calendar} />;
  }

  if (selectedAssignmentCourseId && selectedCourse?.assignment) {
    return (
      <CourseAssignmentView
        course={selectedCourse}
        staff={isStaff}
        initialSubmissionId={requestedAssignmentSubmissionId}
        onChanged={store.moduleActions.fetchModuleData}
      />
    );
  }

  if (!store.state.selectedLesson) {
    return <ModuleData moduleData={module} />;
  }

  return (
    <ModuleContentPreview
      store={store}
      quizState={quiz}
      aiIndexed={selectedCourse?.aiIndexed !== false}
      smartQuizState={smartQuiz}
      canEditSelectedLesson={canEditSelectedLesson}
      canNavigateAsAdmin={canNavigateAsAdmin}
    />
  );
}
