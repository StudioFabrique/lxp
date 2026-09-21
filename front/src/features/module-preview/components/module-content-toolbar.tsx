import type React from "react";
import {
  ArrowDownUp,
  CalendarDays,
  Check,
  ListChevronsUpDown,
  LoaderCircle,
  PanelLeftClose,
  PanelLeftOpen,
  UploadCloud,
} from "lucide-react";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import RoleRankGuard from "../../../components/guards/RoleRankGuard";
import { cn } from "../../../utils/cn";

type ModuleContentToolbarProps = {
  progress: React.ReactNode;
  progressRef: React.RefObject<HTMLDivElement | null>;
  isSidebarCollapsed: boolean;
  isContentSelected: boolean;
  canPlanCourses: boolean;
  isCalendarView: boolean;
  isCalendarSaving: boolean;
  canReorderCourses: boolean;
  isReorderingCourses: boolean;
  showPublishAll: boolean;
  isPublishingAll: boolean;
  onToggleSidebar: () => void;
  onToggleCalendar: () => void;
  onToggleCourseReordering: () => void;
  onPublishAll: () => void;
  onCloseContent: () => void;
};

const actionClassName = "btn border-secondary/20";

export default function ModuleContentToolbar({
  progress,
  progressRef,
  isSidebarCollapsed,
  isContentSelected,
  canPlanCourses,
  isCalendarView,
  isCalendarSaving,
  canReorderCourses,
  isReorderingCourses,
  showPublishAll,
  isPublishingAll,
  onToggleSidebar,
  onToggleCalendar,
  onToggleCourseReordering,
  onPublishAll,
  onCloseContent,
}: ModuleContentToolbarProps) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-5">
      <button
        type="button"
        className={`${actionClassName} btn-primary tooltip tooltip-right`}
        aria-label={isSidebarCollapsed ? "Ouvrir le panneau" : "Réduire le panneau"}
        data-tip={isSidebarCollapsed ? "Ouvrir le panneau" : "Réduire le panneau"}
        onClick={onToggleSidebar}
      >
        {isSidebarCollapsed ? (
          <PanelLeftOpen className="size-6" />
        ) : (
          <PanelLeftClose className="size-6" />
        )}
      </button>

      {canReorderCourses && !isCalendarView && (
        <PermissionGuard object="course" action="update">
          <button
            type="button"
            className={cn(actionClassName, "tooltip tooltip-right", {
              "btn-primary": isReorderingCourses,
            })}
            aria-label={isReorderingCourses ? "Terminer la réorganisation" : "Réorganiser les cours"}
            aria-pressed={isReorderingCourses}
            data-tip={isReorderingCourses ? "Terminer" : "Réorganiser les cours"}
            onClick={onToggleCourseReordering}
          >
            {isReorderingCourses ? (
              <Check className="size-5" />
            ) : (
              <ArrowDownUp className="size-5" />
            )}
          </button>
        </PermissionGuard>
      )}

      <div
        ref={progressRef}
        className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-secondary/20 bg-secondary/20 px-2"
      >
        {progress}
      </div>

      {canPlanCourses && (
        <button
          type="button"
          className={cn(actionClassName, "gap-2", { "btn-primary": isCalendarView })}
          aria-label="Calendrier"
          aria-pressed={isCalendarView}
          disabled={isCalendarSaving}
          onClick={onToggleCalendar}
        >
          <CalendarDays className="size-5" /> Calendrier
        </button>
      )}

      {showPublishAll && (
        <RoleRankGuard ranks={[0, 1, 2]}>
          <PermissionGuard object="course" action="update">
            <button
              type="button"
              className={`${actionClassName} tooltip tooltip-left`}
              aria-label="Tout publier"
              data-tip="Tout publier"
              disabled={isPublishingAll}
              onClick={onPublishAll}
            >
              {isPublishingAll ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <UploadCloud className="size-5" />
              )}
            </button>
          </PermissionGuard>
        </RoleRankGuard>
      )}

      {isContentSelected && (
        <button
          type="button"
          className={`${actionClassName} tooltip tooltip-left`}
          aria-label="Tout réduire"
          data-tip="Tout réduire"
          onClick={onCloseContent}
        >
          <ListChevronsUpDown className="size-5" />
        </button>
      )}
    </div>
  );
}
