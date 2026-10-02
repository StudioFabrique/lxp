import { formatTitle } from "../../../../../utils/helpers/text-helpers";
import { type ReactNode, useRef, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";
import activityIconType from "../../../../../utils/helpers/activity-icon-type";
import type { Activity } from "../../../../../utils/interfaces/activity";
import { cn } from "../../../../../utils/cn";

type Props = {
  title: string;
  activityType?: Activity["type"];
  titleEditable?: boolean;
  autoFocusTitle?: boolean;
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
  autoFocusTitle = true,
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
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const input = titleInputRef.current;
    if (!titleEditable || !input) return;

    const resize = () => {
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
    };
    resize();

    let previousWidth = input.getBoundingClientRect().width;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width !== previousWidth) {
        previousWidth = width;
        resize();
      }
    });
    observer.observe(input);
    return () => observer.disconnect();
  }, [title, titleEditable, isSticky]);

  const handleCancel = () => {
    if (!onCancel) return;
    onCancel();
    setIsSticky(false);
  };

  const handleScrollToTop = () => {
    stickyMarkerRef.current?.parentElement?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
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
      {enableSticky && isSticky && createPortal(
        <button
          type="button"
          aria-label="Revenir au début de l’activité"
          title="Revenir au début de l’activité"
          onClick={handleScrollToTop}
          className="fixed top-6 right-9 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-primary-content shadow-md transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </button>,
        document.body,
      )}
      {enableSticky && (
        <div
          ref={stickyMarkerRef}
          className="absolute -top-6 left-0 w-full h-4 pointer-events-none"
        />
      )}
      <article
        className={
          cn(
            className,
            isSticky && "sticky top-0 left-0 z-10 flex justify-between items-center px-4 py-3 bg-base-200 transition-all duration-300",
            titleEditable && "items-start",
          )
        }
      >
        <div className="flex gap-3 items-center min-w-0 flex-1">
          {activityType && (
            <span className="w-6 shrink-0 self-start mt-1.5 text-primary">
              {activityIconType(activityType)}
            </span>
          )}
          {titleEditable && isSticky ? (
            <input
              data-onboarding-field="activity-title"
              type="text"
              aria-label="Titre de l’activité"
              aria-invalid={Boolean(titleError)}
              value={title}
              onChange={(e) => onEditTitle?.(e.target.value)}
              className={cn(titleClassName, "flex-1 min-w-0 w-full truncate border-0 bg-transparent p-0 rounded-none shadow-none outline-none focus:outline-none focus:ring-0 text-primary", titleError && "text-error", inputClassName ?? "")}
              placeholder={titlePlaceholder}
              title={title}
            />
          ) : titleEditable ? (
            <textarea
              ref={titleInputRef}
              data-onboarding-field="activity-title"
              rows={1}
              aria-label="Titre de l’activité"
              aria-invalid={Boolean(titleError)}
              value={title}
              onChange={(e) => onEditTitle?.(e.target.value)}
              className={cn(titleClassName, "flex-1 min-w-0 w-full resize-none overflow-hidden border-0 bg-transparent p-0 rounded-none shadow-none outline-none focus:outline-none focus:ring-0 text-primary", titleError && "text-error", inputClassName ?? "")}
              placeholder={titlePlaceholder}
              autoFocus={autoFocusTitle}
            />
          ) : (
            <h1
              className={cn(titleClassName, isSticky && "min-w-0 flex-1 truncate")}
              title={isSticky ? formatTitle(title) : undefined}
            >
              {formatTitle(title)}
            </h1>
          )}
        </div>
        {children ?? (
          <button
            onClick={handleCancel}
            disabled={cancelDisabled}
            className={cn(cancelClassName, "shrink-0 ml-3")}
          >
            {cancelLabel}
          </button>
        )}
      </article>
    </>
  );
};

export default ActivityHeader;
