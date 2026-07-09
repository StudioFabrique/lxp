import Lesson from "../../../../../src/utils/interfaces/lesson";
import { ExplorerStore } from "../../views/ModuleContentExplorer";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
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
      onPublishCourse={courseActions.publishCourse}
      onDeleteLesson={lessonActions.deleteLesson}
    >
      {canEditModule && (
        <PermissionGuard action="write" object="course">
          <CreateCourseItem
            parcoursId={module.parcoursId}
            moduleId={module.id || 0}
          />
        </PermissionGuard>
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
