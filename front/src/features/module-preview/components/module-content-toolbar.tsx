import type React from "react";
import { useState } from "react";
import {
  ArrowDownUp,
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
import { cn } from "../../../utils/cn";
import TrophyIcon from "../../../components/UI/svg/trophy-icon.component";
import Modal from "../../../components/UI/modal/modal";

type ModuleContentToolbarProps = {
  progress: React.ReactNode;
  progressRef: React.RefObject<HTMLDivElement | null>;
  isSidebarCollapsed: boolean;
  isContentSelected: boolean;
  showCompletionBadge?: boolean;
  canPlanCourses: boolean;
  isCalendarView: boolean;
  isCalendarSaving: boolean;
  canReorderCourses: boolean;
  isReorderingCourses: boolean;
  showPublishAll: boolean;
  isPublishingAll: boolean;
  showCourseVisibility: boolean;
  areAllCoursesVisible: boolean;
  isUpdatingCourseVisibility: boolean;
  onToggleSidebar: () => void;
  onToggleCalendar: () => void;
  onToggleCourseReordering: () => void;
  onPublishAll: () => void;
  onToggleCourseVisibility: (visibility: boolean) => Promise<void>;
  onCloseContent: () => void;
  onOpenCompletionBadge?: () => void;
};

const actionClassName = "btn border-secondary/20";

export default function ModuleContentToolbar({
  progress,
  progressRef,
  isSidebarCollapsed,
  isContentSelected,
  showCompletionBadge = false,
  canPlanCourses,
  isCalendarView,
  isCalendarSaving,
  canReorderCourses,
  isReorderingCourses,
  showPublishAll,
  isPublishingAll,
  showCourseVisibility,
  areAllCoursesVisible,
  isUpdatingCourseVisibility,
  onToggleSidebar,
  onToggleCalendar,
  onToggleCourseReordering,
  onPublishAll,
  onToggleCourseVisibility,
  onCloseContent,
  onOpenCompletionBadge,
}: ModuleContentToolbarProps) {
  const [pendingVisibility, setPendingVisibility] = useState<boolean | null>(null);

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-5">
      {pendingVisibility !== null && (
        <Modal
          title="Visibilité des cours"
          leftLabel="Annuler"
          rightLabel="Confirmer"
          isSubmitting={isUpdatingCourseVisibility}
          onLeftClick={() => setPendingVisibility(null)}
          onRightClick={async () => {
            await onToggleCourseVisibility(pendingVisibility);
            setPendingVisibility(null);
          }}
        >
          <p className="py-4">
            {pendingVisibility
              ? "Êtes-vous sûr de rendre visibles tous les cours ?"
              : "Êtes-vous sûr de rendre invisibles tous les cours ?"}
          </p>
        </Modal>
      )}
      <button
        type="button"
        className={cn(actionClassName, "btn-primary tooltip tooltip-right")}
        aria-label={
          isSidebarCollapsed ? "Ouvrir le panneau" : "Réduire le panneau"
        }
        data-tip={
          isSidebarCollapsed ? "Ouvrir le panneau" : "Réduire le panneau"
        }
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
            aria-label={
              isReorderingCourses
                ? "Terminer la réorganisation"
                : "Réorganiser les cours"
            }
            aria-pressed={isReorderingCourses}
            data-tip={
              isReorderingCourses ? "Terminer" : "Réorganiser les cours"
            }
            onClick={onToggleCourseReordering}
          >
            <ArrowDownUp className="size-5" />
          </button>
        </PermissionGuard>
      )}

      {showCourseVisibility && (
        <PermissionGuard object="course" action="update">
          <button
            type="button"
            className={cn(actionClassName, "tooltip tooltip-right")}
            aria-label={areAllCoursesVisible ? "Rendre tous les cours invisibles" : "Rendre tous les cours visibles"}
            data-tip={areAllCoursesVisible ? "Rendre tous les cours invisibles" : "Rendre tous les cours visibles"}
            disabled={isUpdatingCourseVisibility}
            onClick={() => setPendingVisibility(!areAllCoursesVisible)}
          >
            {isUpdatingCourseVisibility ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : areAllCoursesVisible ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
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
          className={cn(actionClassName, "gap-2", {
            "btn-primary": isCalendarView,
          })}
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
              className={cn(actionClassName, "tooltip tooltip-left")}
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

      {showCompletionBadge && (
        <button
          type="button"
          className={cn(actionClassName, "tooltip tooltip-left")}
          aria-label="Mes réussites"
          data-tip="Mes réussites"
          onClick={onOpenCompletionBadge}
        >
          <span className="block size-5" aria-hidden="true">
            <TrophyIcon />
          </span>
        </button>
      )}
      {isContentSelected && (
        <button
          type="button"
          className={cn(actionClassName, "tooltip tooltip-left")}
          aria-label="Tout réduire"
          data-tip="Tout réduire"
          disabled={isCalendarView}
          onClick={onCloseContent}
        >
          <ListChevronsUpDown className="size-5" />
        </button>
      )}
    </div>
  );
}
