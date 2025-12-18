// ModuleDetailsModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../UI/calendar/calendar-utils";
import { X } from "lucide-react";

interface Props {
  modalId: string;
  isOpen: boolean;
  position?: DOMRect;
  onClose: () => void;
}

const ModuleTimelineDetailsPopover = ({ isOpen, position, onClose }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const currentModule = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  // Helper to close if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!currentModule || !isOpen || !position) return null;

  // --- POSITIONING LOGIC ---
  const viewportHeight = window.innerHeight;
  // Threshold: If clicked element is below 50% of the screen height, flip up.
  const isBottomHalf = position.top > viewportHeight * 0.5;

  const style: React.CSSProperties = {
    position: "fixed",
    left: position.right + 20, // 20px offset to the right
    zIndex: 50,
    maxHeight: "500px",
    overflowY: "auto",
  };

  if (isBottomHalf) {
    // ALIGN BOTTOM:
    // We set 'bottom' to the distance from the viewport bottom to the element's bottom.
    // This aligns the bottom of the card with the bottom of the clicked row.
    style.bottom = viewportHeight - position.bottom;
    // Reset top to auto to ensure CSS uses bottom
    style.top = "auto";
  } else {
    // ALIGN TOP (Default):
    style.top = position.top;
    style.bottom = "auto";
  }

  // Animation class changes based on position for a nice effect
  const animationClass = isBottomHalf
    ? "origin-bottom-left"
    : "origin-top-left";

  return (
    <div
      ref={cardRef}
      style={style}
      className={`card bg-base-100 shadow-2xl w-96 border border-gray-200 animate-in fade-in zoom-in-95 duration-200 ${animationClass}`}
    >
      {/* --- BANNER IMAGE --- */}
      {currentModule.thumb && (
        <figure className="h-32 w-full relative bg-gray-100">
          <button
            onClick={onClose}
            className="z-50 absolute top-2 right-2 btn btn-xs btn-circle"
          >
            <X className="w-3 h-3" />
          </button>
          <img
            src={`data:image/jpeg;base64,${currentModule.thumb}`}
            alt={currentModule.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent"></div>
        </figure>
      )}

      <div className="card-body p-5">
        {/* Header with Close Button */}
        <div className="flex justify-between items-start">
          <h2 className="card-title text-lg leading-tight">
            {currentModule.title}
          </h2>
          {!currentModule.thumb && (
            <button
              onClick={onClose}
              className="btn btn-xs btn-circle btn-ghost"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="badge badge-primary badge-outline gap-1 text-xs">
          Module
        </div>

        {currentModule.module.description && (
          <p className="text-sm py-2 text-gray-600 line-clamp-4">
            {currentModule.module.description}
          </p>
        )}

        {/* Info Grid */}
        {currentModule.minDate && currentModule.maxDate && (
          <div className="grid grid-cols-2 gap-2 bg-base-200/50 p-3 rounded-lg border border-base-200 text-xs">
            <div>
              <span className="uppercase font-bold text-gray-400 block mb-1">
                Début
              </span>
              <span className="font-semibold">
                {formatDate(currentModule.minDate)}
              </span>
            </div>
            <div>
              <span className="uppercase font-bold text-gray-400 block mb-1">
                Fin
              </span>
              <span className="font-semibold">
                {formatDate(currentModule.maxDate)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleTimelineDetailsPopover;
