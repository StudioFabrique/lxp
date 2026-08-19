import { useState } from "react";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import { ExplorerStore } from "../../views/ModuleContentExplorer";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import ActivityList from "./activity-list";
import CreateCourseItem from "./create-course-item";
import SidebarCoursesList from "./sidebar-courses-list";
import { useSearchParams } from "react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import activityIconType from "../../../../utils/helpers/activity-icon-type";

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
  const [searchParams] = useSearchParams();
  const editCourseId = Number(searchParams.get("editCourseId")) || undefined;
  const editLessonId = Number(searchParams.get("editLessonId")) || undefined;
  const createCourse = searchParams.get("createCourse") === "true";
  const [openedCourseId, setOpenedCourseId] = useState<number>();

  if (!module) return null;

  return (
    <>
      <nav
        className="sticky top-0 flex flex-col gap-3 rounded-lg border border-base-300 bg-base-200 p-2 shadow-sm md:hidden"
        aria-label="Navigation compacte du module"
      >
        {module.courses.map((course, courseIndex) => {
          const isSelectedCourse = course.lessons.some(
            (lesson) => lesson.id === selectedLesson?.id,
          );
          // Même source que la version bureau : l'API, pas un calcul local.
          const courseProgress = course.stats?.progress ?? 0;

          return (
            <div className="w-full" key={course.id}>
              <div
                className={`relative z-10 overflow-hidden rounded-lg ${
                  isSelectedCourse
                    ? "bg-secondary/60"
                    : "bg-secondary/50 hover:bg-secondary/75"
                }`}
              >
                <button
                  type="button"
                  title={`Cours ${courseIndex + 1} : ${course.title}`}
                  aria-label={`Cours ${courseIndex + 1} : ${course.title}`}
                  aria-expanded={isSelectedCourse}
                  disabled={course.lessons.length === 0}
                  onClick={() => {
                    const firstLessonId = course.lessons[0]?.id;
                    if (firstLessonId) {
                      dispatch({
                        type: "select_lesson_by_id",
                        id: firstLessonId,
                      });
                    }
                  }}
                  className="flex w-full items-center gap-1 px-2 py-2 text-secondary-content/80"
                >
                  {isSelectedCourse ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate text-xs font-semibold">
                    Cours {courseIndex + 1}
                  </span>
                </button>
                <progress
                  className="progress progress-primary block h-1 w-full rounded-b-full bg-secondary"
                  value={courseProgress}
                  max={100}
                />
              </div>

              {isSelectedCourse && (
                <div className="-mt-2 flex flex-col gap-2 rounded-b-xl bg-secondary/20 px-2 pb-2 pt-4">
                  {course.lessons.map((lesson, lessonIndex) => {
                    const isSelectedLesson = lesson.id === selectedLesson?.id;

                    return (
                      <div className="flex flex-col gap-1" key={lesson.id}>
                        <button
                          type="button"
                          title={`Leçon ${lessonIndex + 1} : ${lesson.title}`}
                          aria-label={`Leçon ${lessonIndex + 1} : ${lesson.title}`}
                          aria-current={
                            isSelectedLesson ? "step" : undefined
                          }
                          onClick={() => {
                            if (lesson.id) {
                              dispatch({
                                type: "select_lesson_by_id",
                                id: lesson.id,
                              });
                            }
                          }}
                          className={`h-8 w-full truncate rounded-lg px-2 text-left text-[0.65rem] font-medium text-primary-content transition-colors ${
                            isSelectedLesson
                              ? "bg-primary"
                              : "bg-primary/50 hover:bg-primary/80"
                          }`}
                        >
                          Leçon {lessonIndex + 1}
                        </button>

                        {isSelectedLesson &&
                          lesson.activities &&
                          lesson.activities.length > 0 && (
                            <div className="flex flex-col gap-0.5 px-1 pt-1">
                              {lesson.activities.map(
                                (activity, activityIndex) => (
                                  <button
                                    type="button"
                                    key={activity.id}
                                    title={`Activité ${activityIndex + 1}${activity.title ? ` : ${activity.title}` : ""}`}
                                    aria-label={`Activité ${activityIndex + 1}${activity.title ? ` : ${activity.title}` : ""}`}
                                    aria-current={
                                      activity.id === selectedActivity?.id
                                        ? "step"
                                        : undefined
                                    }
                                    onClick={() =>
                                      dispatch({
                                        type: "select_activity",
                                        activity,
                                      })
                                    }
                                    className={`flex h-7 w-full items-center gap-1 rounded-md px-1 text-left text-[0.58rem] transition-colors ${
                                      activity.id === selectedActivity?.id
                                        ? "bg-base-300 font-semibold text-base-content"
                                        : "hover:bg-base-300/70"
                                    }`}
                                  >
                                    <span className="shrink-0">
                                      {activityIconType(activity.type, 3)}
                                    </span>
                                    <span className="truncate">
                                      Activité {activityIndex + 1}
                                    </span>
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="hidden md:block">
        <SidebarCoursesList
          courses={module.courses}
          moduleProgress={module.stats?.progress ?? 0}
          selectedLesson={selectedLesson}
          onSelectLesson={(lesson: Lesson) => {
            if (lesson.id)
              dispatch({ type: "select_lesson_by_id", id: lesson.id });
          }}
          onDeleteCourse={courseActions.deleteCourse}
          onEnableCourse={courseActions.enableCourse}
          onPublishCourse={courseActions.publishCourse}
          onUpdateCourse={courseActions.updateCourse}
          editCourseId={editCourseId}
          editLessonId={editLessonId}
          openedCourseId={openedCourseId}
          onDeleteLesson={lessonActions.deleteLesson}
          onCreateLesson={lessonActions.createLesson}
          onLessonCreated={(lessonId) =>
            dispatch({ type: "select_lesson_by_id", id: lessonId })
          }
          onUpdateLesson={lessonActions.updateLesson}
        >
          {canEditModule && (
            <PermissionGuard action="write" object="course">
              <CreateCourseItem
                parcoursId={module.parcoursId}
                moduleId={module.id || 0}
                onCreate={courseActions.createCourse}
                onCreated={setOpenedCourseId}
                openDetailsOnMount={createCourse}
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

export default ModuleExplorerSidebar;
