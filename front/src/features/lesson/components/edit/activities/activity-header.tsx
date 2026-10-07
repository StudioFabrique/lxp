import { formatTitle } from "../../../../../utils/helpers/text-helpers";
import { type ReactNode, useRef, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  fadeScrollButtonsOnly?: boolean;
  hideScrollButtons?: boolean;
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
  fadeScrollButtonsOnly = false,
  hideScrollButtons = false,
}: Props) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAtPageBottom, setIsAtPageBottom] = useState(false);
  const [isAtActivityTop, setIsAtActivityTop] = useState(true);
  const reduceMotion = useReducedMotion();
  const skipScaleAnimation = reduceMotion || fadeScrollButtonsOnly;
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
    if (isAtActivityTop) {
      const scrollContainer = document.getElementById("main-scroll-container");
      (scrollContainer ?? window).scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    stickyMarkerRef.current?.parentElement?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  };

  const handleScrollToBottom = () => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    if (!enableSticky) return;

    const scrollContainer = document.getElementById("main-scroll-container");
    const scrollTarget = scrollContainer ?? window;
    const updateBottomPosition = () => {
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      const viewportHeight = scrollContainer ? scrollContainer.clientHeight : window.innerHeight;
      const contentHeight = scrollContainer ? scrollContainer.scrollHeight : document.documentElement.scrollHeight;
      setIsAtPageBottom(scrollTop + viewportHeight >= contentHeight - 2);
      const activityTop = stickyMarkerRef.current?.parentElement?.getBoundingClientRect().top;
      const viewportTop = scrollContainer?.getBoundingClientRect().top ?? 0;
      setIsAtActivityTop(activityTop === undefined || activityTop >= viewportTop - 2);
    };

    updateBottomPosition();
    scrollTarget.addEventListener("scroll", updateBottomPosition, { passive: true });
    window.addEventListener("resize", updateBottomPosition);

    const resizeObserver = new ResizeObserver(updateBottomPosition);
    resizeObserver.observe(scrollContainer ?? document.documentElement);
    if (scrollContainer?.firstElementChild) {
      resizeObserver.observe(scrollContainer.firstElementChild);
    }

    return () => {
      scrollTarget.removeEventListener("scroll", updateBottomPosition);
      window.removeEventListener("resize", updateBottomPosition);
      resizeObserver.disconnect();
    };
  }, [enableSticky]);

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
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence custom={skipScaleAnimation}>
          {enableSticky && isSticky && !hideScrollButtons && [
            { key: "top", label: isAtActivityTop ? "Revenir en haut de la page" : "Revenir au début de l’activité", Icon: ArrowUp, position: "top-6" },
            { key: "bottom", label: "Aller en bas de la page", Icon: ArrowDown, position: "bottom-32" },
          ].filter(({ key }) => key === "top" || !isAtPageBottom).map(({ key, label, Icon, position }) => (
            <motion.button
              key={`scroll-to-activity-${key}`}
              type="button"
              aria-label={label}
              title={label}
              onClick={key === "top" ? handleScrollToTop : handleScrollToBottom}
              initial={{ opacity: 0, scale: skipScaleAnimation ? 1 : 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit="hidden"
              variants={{
                hidden: (fadeOnly: boolean) => ({
                  opacity: 0,
                  scale: fadeOnly ? 1 : 0,
                  pointerEvents: "none",
                  transition: { duration: 0.2, ease: "easeOut" },
                }),
              }}
              transition={{
                opacity: { duration: 0.15 },
                scale: skipScaleAnimation
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 16, mass: 0.7 },
              }}
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
              className={cn("fixed right-9 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-primary-content shadow-md transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary", position)}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </motion.button>
          ))}
        </AnimatePresence>,
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
        {children ?? (onCancel ? (
          <button
            onClick={handleCancel}
            disabled={cancelDisabled}
            className={cn(cancelClassName, "shrink-0 ml-3")}
          >
            {cancelLabel}
          </button>
        ) : null)}
      </article>
    </>
  );
};

export default ActivityHeader;
