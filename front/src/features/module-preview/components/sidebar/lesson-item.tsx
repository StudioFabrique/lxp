import { formatTitle } from "../../../../utils/helpers/text-helpers";
import {
  Check,
  Trash2,
  Edit3,
  EllipsisIcon,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { cn } from "../../../../utils/cn";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import EditLessonModal from "./edit-lesson-modal";
import type { LessonFormValues } from "./lesson-form.types";
import type Tag from "../../../../utils/interfaces/tag";
import { modulePreviewApi } from "../../api/module-preview.api";
import toast from "react-hot-toast";

type LessonItemProps = {
  calendarMode?: boolean;
  disabled?: boolean;
  lesson: Lesson;
  courseTags: Tag[];
  selectedLesson: Lesson | undefined;
  canEditLesson?: boolean;
  isReordering?: boolean;
  openEditOnMount?: boolean;
  isCourseOpen?: boolean;
  shouldScrollIntoView?: boolean;
  onScrolledIntoView?: (lessonId: number) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenModal: (lesson: Lesson) => void;
  onUpdateLesson: (
    lessonId: number,
    values: LessonFormValues,
  ) => Promise<boolean>;
};

const LessonItem = ({
  calendarMode = false,
  disabled = false,
  lesson,
  courseTags,
  selectedLesson,
  canEditLesson,
  isReordering = false,
  openEditOnMount = false,
  isCourseOpen = false,
  shouldScrollIntoView = false,
  onScrolledIntoView,
  onSelectLesson,
  onOpenModal,
  onUpdateLesson,
  children,
}: PropsWithChildren<LessonItemProps>) => {
  const [calendarExpanded, setCalendarExpanded] = useState(selectedLesson?.id === lesson.id);
  const isLessonSelected = !isReordering && (calendarMode ? calendarExpanded : selectedLesson?.id === lesson.id);
  const lessonRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(openEditOnMount);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isVisible, setIsVisible] = useState(Boolean(lesson.visibility));
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isLessonRead = lesson.lessonsRead?.some(
    (lessonRead) => lessonRead.finishedAt,
  );

  const handleBeginReadLesson = () => {
    if (disabled) return;
    if (calendarMode) {
      setCalendarExpanded(expanded => !expanded);
    } else if (!isLessonSelected) {
      onSelectLesson(lesson);
    }
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    onOpenModal(lesson);
  };

  const handleUpdateLesson = async (values: LessonFormValues) => {
    if (!lesson.id) return false;
    setIsSavingLesson(true);
    const updated = await onUpdateLesson(lesson.id, values);
    setIsSavingLesson(false);
    return updated;
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Update position when dropdown opens or on scroll
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isLessonSelected || !isCourseOpen || !shouldScrollIntoView) return;

    const isDesktop = window.matchMedia?.("(min-width: 768px)").matches;
    if (isDesktop === false) return;

    const animationFrame = window.requestAnimationFrame(() => {
      const lessonElement = lessonRef.current;
      if (!lessonElement) return;

      lessonElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      if (lesson.id) onScrolledIntoView?.(lesson.id);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [
    isCourseOpen,
    isLessonSelected,
    lesson.id,
    onScrolledIntoView,
    shouldScrollIntoView,
  ]);

  // Handle scroll - update position or close dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      updatePosition(); // Update position on scroll
      // Or close dropdown instead: setIsOpen(false);
    };

    // Listen to both window scroll and any parent scroll
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Check if click is outside both button and dropdown menu
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        !(target as HTMLElement).closest(".menu") // Don't close if clicking inside menu
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="w-full">
      {!calendarMode && isEditingLesson && (
        <EditLessonModal
          lesson={lesson}
          courseTags={courseTags}
          isSubmitting={isSavingLesson}
          onClose={() => setIsEditingLesson(false)}
          onSubmit={handleUpdateLesson}
        />
      )}
      <div
        ref={lessonRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        inert={disabled}
        aria-label={formatTitle(lesson.title)}
        aria-expanded={isLessonSelected}
        onClick={handleBeginReadLesson}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleBeginReadLesson();
          }
        }}
        className={cn(
          "flex items-center justify-between gap-1 rounded-xl px-4 h-10 w-full cursor-pointer group",
          disabled && "pointer-events-none opacity-50",
          isLessonSelected
            ? "bg-secondary text-secondary-content"
            : "bg-secondary/20 text-base-content hover:bg-secondary/30",
        )}
      >
        <span className="flex gap-1 justify-between items-center min-w-0 w-full">
          {calendarMode && (isLessonSelected ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />)}
          {!calendarMode && canEditLesson && !isVisible ? (
            <span
              className="tooltip opacity-65"
              data-tip="Leçon invisible"
              aria-label="Leçon invisible"
            >
              <EyeOff className="size-3.5" />
            </span>
          ) : null}
          <p className="min-w-0 max-h-14 flex-1 truncate text-sm">{formatTitle(lesson.title)}</p>
          {isReordering && <GripVertical aria-hidden="true" className="size-4 shrink-0" />}
          {!isReordering && selectedLesson?.id === lesson.id && (
            <div className="flex items-center gap-1">
              {!calendarMode && canEditLesson && (
                <PermissionGuard action="update" object="lesson">
                  <button
                    ref={buttonRef}
                    tabIndex={0}
                    type="button"
                    className="btn btn-sm px-2 btn-ghost text-secondary-content w-fit hover:text-secondary"
                    onClick={handleDropdownToggle}
                    aria-label={`Actions pour ${formatTitle(lesson.title)}`}
                  >
                    <EllipsisIcon className="w-4 h-4" />
                  </button>

                  {isOpen &&
                    createPortal(
                      <ul
                        className="menu bg-base-100 rounded-lg shadow-lg fixed min-w-40 p-1 z-9999"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling
                      >
                        <li>
                          <button
                            type="button"
                            className="flex items-center gap-2 text-sm text-base-content"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await modulePreviewApi.mutations.setLessonVisibility(
                                  lesson.id!,
                                  !isVisible,
                                );
                                setIsVisible(!isVisible);
                                setIsOpen(false);
                              } catch {
                                toast.error("Impossible de modifier la visibilité de la leçon.");
                              }
                            }}
                          >
                            {isVisible ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                            <span>
                              {isVisible
                                ? "Rendre invisible"
                                : "Rendre visible"}
                            </span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="flex items-center gap-2 text-sm text-base-content"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                              setIsEditingLesson(true);
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Modifier les détails</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick();
                            }}
                            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Supprimer</span>
                          </button>
                        </li>
                      </ul>,
                      document.body,
                    )}
                </PermissionGuard>
              )}
            </div>
          )}
        </span>

        {isLessonRead && (
          <Check className="w-5 h-5 p-1 rounded-full stroke-3 bg-success stroke-success-content" />
        )}
      </div>
      {isLessonSelected && children}
    </div>
  );
};

export default LessonItem;
