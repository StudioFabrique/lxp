import { Check, Trash2, Edit3, EllipsisIcon } from "lucide-react";
import { cn } from "../../../../utils/cn";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import EditLessonModal from "./edit-lesson-modal";
import type { LessonFormValues } from "./lesson-form.types";
import type Tag from "../../../../utils/interfaces/tag";

type LessonItemProps = {
  lesson: Lesson;
  courseTags: Tag[];
  selectedLesson: Lesson | undefined;
  canEditLesson?: boolean;
  openEditOnMount?: boolean;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenModal: (lesson: Lesson) => void;
  onUpdateLesson: (
    lessonId: number,
    values: LessonFormValues,
  ) => Promise<boolean>;
};

const LessonItem = ({
  lesson,
  courseTags,
  selectedLesson,
  canEditLesson,
  openEditOnMount = false,
  onSelectLesson,
  onOpenModal,
  onUpdateLesson,
  children,
}: PropsWithChildren<LessonItemProps>) => {
  const isLessonSelected = selectedLesson?.id === lesson.id;
  const lessonRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(openEditOnMount);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isLessonRead = lesson.lessonsRead?.some(
    (lessonRead) => lessonRead.finishedAt,
  );

  const handleBeginReadLesson = () => {
    if (!isLessonSelected) onSelectLesson(lesson);
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
      {isEditingLesson && (
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
        onClick={handleBeginReadLesson}
        className={cn(
          "flex items-center justify-between gap-1 rounded-xl px-4 h-10 w-full cursor-pointer group",
          isLessonSelected
            ? "bg-primary text-primary-content"
            : "bg-primary/50 text-primary-content hover:bg-primary/80",
        )}
      >
        <span className="flex gap-1 justify-between items-center min-w-0 w-full">
          <p className="max-h-14 truncate text-sm">{lesson.title}</p>
          {selectedLesson?.id === lesson.id && (
            <div className="flex items-center gap-1">
              {canEditLesson && (
                <PermissionGuard action="update" object="lesson">
                  <button
                    ref={buttonRef}
                    tabIndex={0}
                    type="button"
                    className="btn btn-sm px-2 btn-ghost text-primary-content w-fit hover:text-primary"
                    onClick={handleDropdownToggle}
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
