import { useState } from "react";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import type { ModuleContentStore } from "../../hooks/use-module-content";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import ActivityList from "./activity-list";
import CreateCourseItem from "./create-course-item";
import SidebarCoursesList from "./sidebar-courses-list";
import { useLocation, useSearchParams } from "react-router";
import MobileModuleNavigation from "./mobile-module-navigation";

import type { ModuleCalendarStore } from "../../hooks/use-module-calendar";
import { cn } from "../../../../utils/cn";

type Props = {
  calendar?: ModuleCalendarStore;
  store: ModuleContentStore;
  canEditModule?: boolean;
  canEditSelectedLesson?: boolean;
  selectedAssignmentCourseId?: number;
  onSelectAssignment: (courseId?: number) => void;
  isReorderingCourses?: boolean;
};

const ModuleContentSidebar = ({
  store,
  calendar,
  canEditModule,
  canEditSelectedLesson,
  selectedAssignmentCourseId,
  onSelectAssignment,
  isReorderingCourses = false,
}: Props) => {
  const { state, dispatch, courseActions, lessonActions, activityActions } =
    store;
  const {
    module,
    selectedLesson,
    selectedActivity,
    lessonIdToScroll,
  } = state;
  const { acknowledgeLessonScroll } = store;
  const location = useLocation();
  const requestedCourseId = (location.state as { courseId?: number } | null)?.courseId;
  const [searchParams] = useSearchParams();
  const editCourseId = Number(searchParams.get("editCourseId")) || undefined;
  const editLessonId = Number(searchParams.get("editLessonId")) || undefined;
  const createCourse = searchParams.get("createCourse") === "true";
  const [openedCourse, setOpenedCourse] = useState({ key: location.key, id: requestedCourseId });
  const openedCourseId = openedCourse.key === location.key ? openedCourse.id : requestedCourseId;
  if (!module) return null;

  return (
    <>
      <MobileModuleNavigation
        module={module}
        hidden={Boolean(calendar)}
        selectedLesson={selectedLesson}
        selectedActivity={selectedActivity}
        selectedAssignmentCourseId={selectedAssignmentCourseId}
        lessonIdToScroll={lessonIdToScroll}
        onSelectLesson={(lessonId) => {
          onSelectAssignment(undefined);
          dispatch({ type: "select_lesson_by_id", id: lessonId });
        }}
        onSelectActivity={(activity) =>
          dispatch({ type: "select_activity", activity })
        }
        onSelectAssignment={onSelectAssignment}
        onLessonScrolled={acknowledgeLessonScroll}
      />

      <div className={cn(calendar ? "block" : "hidden md:block")}>
        <SidebarCoursesList
          calendarMode={Boolean(calendar)}
          calendarSelectedCourseId={calendar?.selection?.courseId}
          calendarAdding={calendar?.isAdding && !calendar.isSaving}
          calendarOrphanIds={calendar?.orphanIds}
          onAddCalendarCourse={calendar?.addCourse}
          onSelectCalendarCourse={calendar?.selectCourse}
          courses={module.courses}
          moduleProgress={module.stats?.progress ?? 0}
          selectedLesson={selectedLesson}
          selectedAssignmentCourseId={selectedAssignmentCourseId}
          onSelectAssignment={(courseId) => onSelectAssignment(courseId)}
          onSelectLesson={(lesson: Lesson) => {
            onSelectAssignment(undefined);
            if (lesson.id)
              dispatch({ type: "select_lesson_by_id", id: lesson.id });
          }}
          onDeleteCourse={courseActions.deleteCourse}
          onEnableCourse={courseActions.enableCourse}
          onPublishCourse={courseActions.publishCourse}
          onUpdateCourse={courseActions.updateCourse}
          onCourseReorder={courseActions.courseReorder}
          isReorderingCourses={isReorderingCourses}
          editCourseId={editCourseId}
          editLessonId={editLessonId}
          openedCourseId={openedCourseId}
          lessonIdToScroll={lessonIdToScroll}
          onLessonScrolled={acknowledgeLessonScroll}
          onDeleteLesson={lessonActions.deleteLesson}
          onCreateLesson={lessonActions.createLesson}
          onLessonCreated={(lessonId) =>
            dispatch({ type: "select_lesson_by_id", id: lessonId })
          }
          onUpdateLesson={lessonActions.updateLesson}
          disableCourseCreationFloating={
            (state.mode === "write" && state.activityType === "text") ||
            (state.mode === "edit" && selectedActivity?.type === "text")
          }
        >
          {canEditModule && (
            <PermissionGuard action="write" object="course">
              <CreateCourseItem
                parcoursId={module.parcoursId}
                moduleId={module.id || 0}
                parcoursTags={module.tags}
                onCreate={courseActions.createCourse}
                onCreated={id => setOpenedCourse({ key: location.key, id })}
                openDetailsOnMount={!calendar && createCourse}
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
              dispatch({
                type: "select_mode",
                mode: "activity_type_selection",
              })
            }
            isLoading={store.isLoading}
          />
        </SidebarCoursesList>
      </div>
    </>
  );
};

export default ModuleContentSidebar;
