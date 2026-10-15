import {
  CalendarDays,
  Eye,
  EyeOff,
  ListChevronsUpDown,
  LoaderCircle,
  PanelLeftClose,
  PanelLeftOpen,
  UploadCloud,
} from "lucide-react";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import RoleRankGuard from "../../../components/guards/RoleRankGuard";
import TrophyIcon from "../../../components/UI/svg/trophy-icon.component";
import { cn } from "../../../utils/cn";
import type { ModuleContentToolbarProps } from "./module-content-toolbar";

type ModuleContentMobileActionsProps = Pick<
  ModuleContentToolbarProps,
  | "isSidebarCollapsed"
  | "isContentSelected"
  | "showCompletionBadge"
  | "canPlanCourses"
  | "isCalendarView"
  | "isCalendarSaving"
  | "showPublishAll"
  | "isPublishingAll"
  | "showCourseVisibility"
  | "areAllCoursesVisible"
  | "isUpdatingCourseVisibility"
  | "onToggleSidebar"
  | "onToggleCalendar"
  | "onPublishAll"
  | "onCloseContent"
  | "onOpenCompletionBadge"
> & {
  /** Demande la confirmation du changement de visibilité ; la fenêtre est affichée par la barre d'outils. */
  onRequestCourseVisibility: (visibility: boolean) => void;
};

const actionClassName = "btn btn-outline justify-start gap-2";

/**
 * Actions du module pour le mobile, avec leur libellé : elles remplacent la barre d'outils
 * et sont déposées dans le tiroir d'actions de la barre du haut.
 * La réorganisation des cours n'y figure pas : elle agit sur la liste de gauche, absente du mobile.
 */
export default function ModuleContentMobileActions({
  isSidebarCollapsed,
  isContentSelected,
  showCompletionBadge = false,
  canPlanCourses,
  isCalendarView,
  isCalendarSaving,
  showPublishAll,
  isPublishingAll,
  showCourseVisibility,
  areAllCoursesVisible,
  isUpdatingCourseVisibility,
  onToggleSidebar,
  onToggleCalendar,
  onPublishAll,
  onCloseContent,
  onOpenCompletionBadge,
  onRequestCourseVisibility,
}: ModuleContentMobileActionsProps) {
  return (
    <>
      {canPlanCourses && (
        <button
          type="button"
          className={cn(actionClassName, isCalendarView && "btn-primary")}
          aria-pressed={isCalendarView}
          disabled={isCalendarSaving}
          onClick={onToggleCalendar}
        >
          <CalendarDays className="size-5" aria-hidden="true" /> Calendrier
        </button>
      )}

      {/* En vue calendrier, la liste des cours reste affichée à côté du calendrier. */}
      {isCalendarView && (
        <button
          type="button"
          className={actionClassName}
          onClick={onToggleSidebar}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="size-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-5" aria-hidden="true" />
          )}
          {isSidebarCollapsed ? "Afficher la liste des cours" : "Masquer la liste des cours"}
        </button>
      )}

      {showCourseVisibility && (
        <PermissionGuard object="course" action="update">
          <button
            type="button"
            className={actionClassName}
            disabled={isCalendarView || isUpdatingCourseVisibility}
            onClick={() => onRequestCourseVisibility(!areAllCoursesVisible)}
          >
            {isUpdatingCourseVisibility ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            ) : areAllCoursesVisible ? (
              <EyeOff className="size-5" aria-hidden="true" />
            ) : (
              <Eye className="size-5" aria-hidden="true" />
            )}
            {areAllCoursesVisible
              ? "Rendre tous les cours invisibles"
              : "Rendre tous les cours visibles"}
          </button>
        </PermissionGuard>
      )}

      {showPublishAll && (
        <RoleRankGuard ranks={[0, 1, 2]}>
          <PermissionGuard object="course" action="update">
            <button
              type="button"
              className={actionClassName}
              disabled={isPublishingAll}
              onClick={onPublishAll}
            >
              {isPublishingAll ? (
                <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <UploadCloud className="size-5" aria-hidden="true" />
              )}
              Tout publier
            </button>
          </PermissionGuard>
        </RoleRankGuard>
      )}

      {showCompletionBadge && (
        <button
          type="button"
          className={actionClassName}
          onClick={onOpenCompletionBadge}
        >
          <span className="block size-5" aria-hidden="true">
            <TrophyIcon />
          </span>
          Mes réussites
        </button>
      )}

      {isContentSelected && (
        <button
          type="button"
          className={actionClassName}
          disabled={isCalendarView}
          onClick={onCloseContent}
        >
          <ListChevronsUpDown className="size-5" aria-hidden="true" />
          Retour à la présentation du module
        </button>
      )}
    </>
  );
}
