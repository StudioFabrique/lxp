import { type ReactNode, useRef, useEffect, useState } from "react";
import activityIconType from "../../../../../utils/helpers/activity-icon-type";
import type { Activity } from "../../../../../utils/interfaces/activity";

type Props = {
  title: string;
  activityType?: Activity["type"];
  titleEditable?: boolean;
  titleError?: string;
  onEditTitle?: (title: string) => void;
  titlePlaceholder?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  cancelClassName?: string;
  cancelDisabled?: boolean;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  inputClassName?: string;
  enableSticky?: boolean;
  onStickyChange?: (isSticky: boolean) => void;
};

const ActivityHeader = ({
  title,
  activityType,
  titleEditable = false,
  titleError,
  onEditTitle,
  titlePlaceholder = "Saisissez le titre de l'activité",
  onCancel,
  cancelLabel = "Annuler",
  cancelClassName = "btn btn-warning",
  cancelDisabled = false,
  children,
  className = "w-full flex justify-between items-center",
  titleClassName = "text-xl font-bold",
  inputClassName,
  enableSticky = false,
  onStickyChange,
}: Props) => {
  const [isSticky, setIsSticky] = useState(false);
  const stickyMarkerRef = useRef<HTMLDivElement>(null);

  const handleCancel = () => {
    if (!onCancel) return;
    onCancel();
    setIsSticky(false);
  };

  useEffect(() => {
    if (!enableSticky || !stickyMarkerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const sticky =
          !entry.isIntersecting && entry.boundingClientRect.top < 1;
        setIsSticky(sticky);
        onStickyChange?.(sticky);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "-10px 0px 0px 0px",
      },
    );

    observer.observe(stickyMarkerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enableSticky, onStickyChange]);

  return (
    <>
      {enableSticky && (
        <div
          ref={stickyMarkerRef}
          className="absolute -top-6 left-0 w-full h-4 pointer-events-none"
        />
      )}
      <article
        className={
          isSticky
            ? `sticky top-0 left-0 z-10 flex justify-between items-center px-4 py-3 backdrop-blur-md rounded-2xl transition-all duration-300`
            : className
        }
      >
        <div className="flex gap-3 items-center min-w-0 flex-1">
          {activityType && (
            <span className="w-6 shrink-0">
              {activityIconType(activityType)}
            </span>
          )}
          {titleEditable ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onEditTitle?.(e.target.value)}
              className={`input input-bordered ${titleClassName} flex-1 min-w-0 ${
                titleError && "input-error text-error"
              } ${inputClassName ?? ""}`}
              placeholder={titlePlaceholder}
              autoFocus
            />
          ) : (
            <h1 className={titleClassName}>{title}</h1>
          )}
        </div>
        {children ?? (
          <button
            onClick={handleCancel}
            disabled={cancelDisabled}
            className={`${cancelClassName} shrink-0 ml-3`}
          >
            {cancelLabel}
          </button>
        )}
      </article>
    </>
  );
};

export default ActivityHeader;
