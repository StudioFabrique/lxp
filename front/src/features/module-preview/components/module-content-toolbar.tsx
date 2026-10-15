import type React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
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
import { useIsMobile } from "../../../hooks/useMediaQuery";
import { useMobileHeaderActions } from "../../../hooks/useMobileHeaderActions";
import ModuleContentMobileActions from "./module-content-mobile-actions";

export type ModuleContentToolbarProps = {
  progress: React.ReactNode;
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
  const mobileActions = useMobileHeaderActions();
  const isMobile = useIsMobile();

  const visibilityConfirmation = pendingVisibility !== null && (
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
  );

  // Mobile : la barre d'outils disparaît, ses actions passent dans le tiroir de la barre du haut.
  // Seule la progression, qui n'est pas une action, reste affichée.
  if (isMobile && mobileActions) {
    return (
      <>
        {visibilityConfirmation}
        {mobileActions.container &&
          createPortal(
            <ModuleContentMobileActions
              isSidebarCollapsed={isSidebarCollapsed}
              isContentSelected={isContentSelected}
              showCompletionBadge={showCompletionBadge}
              canPlanCourses={canPlanCourses}
              isCalendarView={isCalendarView}
              isCalendarSaving={isCalendarSaving}
              showPublishAll={showPublishAll}
              isPublishingAll={isPublishingAll}
              showCourseVisibility={showCourseVisibility}
              areAllCoursesVisible={areAllCoursesVisible}
              isUpdatingCourseVisibility={isUpdatingCourseVisibility}
              onToggleSidebar={onToggleSidebar}
              onToggleCalendar={onToggleCalendar}
              onPublishAll={onPublishAll}
              onCloseContent={onCloseContent}
              onOpenCompletionBadge={onOpenCompletionBadge}
              onRequestCourseVisibility={setPendingVisibility}
            />,
            mobileActions.container,
          )}
        <div className="mt-5 flex h-10 items-center rounded-lg border border-secondary/20 bg-secondary/20 px-2 empty:hidden">
          {progress}
        </div>
      </>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-5">
      {visibilityConfirmation}
      <button
        type="button"
        className={cn(
          actionClassName,
          "tooltip tooltip-top",
          !isSidebarCollapsed && "btn-primary",
        )}
        aria-pressed={!isSidebarCollapsed}
        aria-label={
          isSidebarCollapsed ? "Ouvrir le panneau" : "Réduire le panneau"
        }
        data-tip={
          isSidebarCollapsed ? "Ouvrir le panneau" : "Réduire le panneau"
        }
        disabled={isReorderingCourses}
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
            className={cn(actionClassName, "tooltip tooltip-top", {
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
            className={cn(actionClassName, "tooltip tooltip-top")}
            aria-label={areAllCoursesVisible ? "Rendre tous les cours invisibles" : "Rendre tous les cours visibles"}
            data-tip={areAllCoursesVisible ? "Rendre tous les cours invisibles" : "Rendre tous les cours visibles"}
            disabled={isCalendarView || isUpdatingCourseVisibility || isReorderingCourses}
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
          disabled={isCalendarSaving || isReorderingCourses}
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
              className={cn(actionClassName, "tooltip tooltip-top")}
              aria-label="Tout publier"
              data-tip="Tout publier"
              disabled={isPublishingAll || isReorderingCourses}
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
          className={cn(actionClassName, "tooltip tooltip-top")}
          aria-label="Mes réussites"
          data-tip="Mes réussites"
          disabled={isReorderingCourses}
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
          className={cn(actionClassName, "tooltip tooltip-top")}
          aria-label="Tout réduire"
          data-tip="Tout réduire"
          disabled={isCalendarView || isReorderingCourses}
          onClick={onCloseContent}
        >
          <ListChevronsUpDown className="size-5" />
        </button>
      )}
    </div>
  );
}
