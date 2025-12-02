import { Check, Trash2, Edit3, EllipsisIcon } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";
import { Link } from "react-router-dom";
import Can from "../../UI/can/can.component";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LessonItemProps = {
  lesson: Lesson;
  moduleId: number;
  selectedLesson: Lesson | undefined;
  canEditLesson?: boolean;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenModal: (lesson: Lesson) => void;
};

const LessonItem = ({
  lesson,
  moduleId,
  selectedLesson,
  canEditLesson,
  onSelectLesson,
  onOpenModal,
  children,
}: PropsWithChildren<LessonItemProps>) => {
  const isLessonSelected = selectedLesson?.id === lesson.id;
  const lessonRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isLessonRead = lesson.lessonsRead?.some(
    (lessonRead) => lessonRead.finishedAt
  );

  const handleBeginReadLesson = () => {
    if (!isLessonSelected) onSelectLesson(lesson);
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    onOpenModal(lesson);
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
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="w-full">
      <div
        ref={lessonRef}
        onClick={handleBeginReadLesson}
        className={`flex items-center justify-between gap-1 rounded-xl px-4 h-10 w-full cursor-pointer group ${
          isLessonSelected
            ? "bg-primary text-base-100"
            : "bg-primary/50 text-base-100 hover:bg-primary/80"
        }`}
      >
        <span className="flex gap-1 justify-between items-center min-w-0 w-full">
          <p className="max-h-14 truncate text-sm">{lesson.title}</p>
          {selectedLesson?.id === lesson.id && (
            <div className="flex items-center gap-1">
              {canEditLesson && (
                <Can action="update" object="lesson">
                  <button
                    ref={buttonRef}
                    tabIndex={0}
                    type="button"
                    className="btn btn-sm px-2 btn-ghost w-fit hover:bg-transparent hover:text-base-100"
                    onClick={handleDropdownToggle}
                  >
                    <EllipsisIcon className="w-4 h-4" />
                  </button>

                  {isOpen &&
                    createPortal(
                      <ul
                        className="menu bg-base-100 rounded-lg shadow-lg fixed min-w-[10rem] p-1 z-50"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                        }}
                      >
                        <li>
                          <Link
                            to={`/admin/lesson/edit-lesson/${lesson.id}`}
                            state={{ moduleId: moduleId }}
                            className="flex items-center gap-2 text-sm text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Éditer les détails</span>
                          </Link>
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
                      document.body
                    )}
                </Can>
              )}
            </div>
          )}
        </span>

        {isLessonRead && (
          <Check
            className={`w-5 h-5 p-1 rounded-full stroke-3 ${"bg-success stroke-success-content"}`}
          />
        )}
      </div>
      {isLessonSelected && children}
    </div>
  );
};

export default LessonItem;
