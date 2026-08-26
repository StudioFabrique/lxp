// ModuleDetailsModal.tsx

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { normalizeImageSource } from "../../../../../../src/utils/images/image-source";
import { formatDate } from "../../../../calendar/components/calendar-utils";
import { X } from "lucide-react";
import type Module from "../../../../../utils/interfaces/module";

export interface TimelineDetailsPosition {
  anchor: DOMRect;
  container: DOMRect;
}

interface Props {
  modalId: string;
  isOpen: boolean;
  position?: TimelineDetailsPosition;
  onClose: () => void;
  currentModule: Module | null;
}

const ModuleTimelineDetailsPopover = ({
  isOpen,
  position,
  onClose,
  currentModule,
}: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);

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

  if (!currentModule || !isOpen || !position) {
    return null;
  }

  const { anchor, container } = position;
  const gap = 12;
  const viewportPadding = 12;
  const cardWidth = Math.min(384, window.innerWidth - viewportPadding * 2);
  const fitsOnRight =
    anchor.right + gap + cardWidth <= window.innerWidth - viewportPadding;
  const proposedLeft = fitsOnRight
    ? anchor.right + gap
    : anchor.left - gap - cardWidth;
  const minLeft = viewportPadding;
  const maxLeft = window.innerWidth - viewportPadding - cardWidth;
  const viewportLeft = Math.min(
    Math.max(proposedLeft, minLeft),
    maxLeft,
  );
  const isBottomHalf = anchor.top > window.innerHeight / 2;

  const style: CSSProperties = {
    left: viewportLeft - container.left,
    maxHeight: `min(500px, calc(100vh - ${viewportPadding * 2}px))`,
  };

  if (isBottomHalf) {
    style.bottom = Math.max(
      container.bottom - anchor.bottom,
      container.bottom - (window.innerHeight - viewportPadding),
    );
  } else {
    style.top = Math.max(
      anchor.top - container.top,
      viewportPadding - container.top,
    );
  }

  return (
    <div
      ref={cardRef}
      style={style}
      className={`absolute z-50 card bg-base-100 shadow-2xl w-96 max-w-[calc(100vw-1.5rem)] overflow-y-auto border border-gray-200 animate-in fade-in zoom-in-95 duration-200 ${
        isBottomHalf ? "origin-bottom-left" : "origin-top-left"
      }`}
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
            src={normalizeImageSource(currentModule.thumb)}
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

        {currentModule.description && (
          <p className="text-sm py-2 text-gray-600 line-clamp-4">
            {currentModule.description}
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
