import { createPortal } from "react-dom";
import type { ModuleContentStore } from "../../hooks/use-module-content";
import { useMobileNavigationPanel } from "../../../../hooks/useMobileNavigationPanel";
import MobileModuleNavigation from "./mobile-module-navigation";

type MobileModuleNavigationPanelProps = {
  store: ModuleContentStore;
  selectedAssignmentCourseId?: number;
  /** Faux quand le module n'a pas de navigation à proposer (ex. vue calendrier, qui garde sa liste de cours). */
  enabled: boolean;
  onSelectAssignment: (courseId?: number) => void;
};

/**
 * Mobile : la liste des cours, leçons et activités n'occupe plus une colonne de la page ;
 * elle s'ouvre en plein écran depuis le bouton central de la barre du haut.
 */
export default function MobileModuleNavigationPanel({
  store,
  selectedAssignmentCourseId,
  enabled,
  onSelectAssignment,
}: MobileModuleNavigationPanelProps) {
  const { state, dispatch, acknowledgeLessonScroll } = store;
  const { module, selectedLesson, selectedActivity, lessonIdToScroll } = state;
  const panel = useMobileNavigationPanel(
    enabled && module ? "Navigation du module" : null,
  );

  if (!module || !panel.container) return null;

  return createPortal(
    <MobileModuleNavigation
      module={module}
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
      onNavigated={panel.close}
    />,
    panel.container,
  );
}
