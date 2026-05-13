import Lesson from "../../../utils/interfaces/lesson";
import { ExplorerStore } from "../../../views/module-content-explorer/module-content-explorer";
import Can from "../../UI/can/can.component";
import ActivityList from "./activity-list";
import CreateCourseItem from "./create-course-item";
import SidebarCoursesList from "./sidebar-courses-list";

type Props = {
  store: ExplorerStore;
  canEditModule?: boolean;
  canEditSelectedLesson?: boolean;
};

const ModuleExplorerSidebar = ({
  store,
  canEditModule,
  canEditSelectedLesson,
}: Props) => {
  const { state, dispatch, courseActions, lessonActions, activityActions } =
    store;
  const { module, selectedLesson, selectedActivity } = state;

  if (!module) return null;

  return (
    <SidebarCoursesList
      courses={module.courses}
      parcoursId={module.parcoursId}
      moduleId={module.id}
      selectedLesson={selectedLesson}
      onSelectLesson={(lesson: Lesson) => {
        if (lesson.id) dispatch({ type: "select_lesson_by_id", id: lesson.id });
      }}
      onDeleteCourse={courseActions.deleteCourse}
      onEnableCourse={courseActions.enableCourse}
      onDeleteLesson={lessonActions.deleteLesson}
    >
      {canEditModule && (
        <Can action="write" object="course">
          <CreateCourseItem
            parcoursId={module.parcoursId}
            moduleId={module.id || 0}
          />
        </Can>
      )}
      <ActivityList
        canEdit={canEditSelectedLesson}
        activities={selectedLesson?.activities}
        selectedActivity={selectedActivity}
        onActivityReorder={activityActions.activityReorder}
        onSelectActivity={(activity) =>
          dispatch({ type: "select_activity", activity })
        }
        newActivityButtonDisabled={state.mode === "write"}
        onClickCreateActivity={() =>
          dispatch({ type: "select_mode", mode: "activity_type_selection" })
        }
        isLoading={store.isLoading}
      />
    </SidebarCoursesList>
  );
};

export default ModuleExplorerSidebar;
