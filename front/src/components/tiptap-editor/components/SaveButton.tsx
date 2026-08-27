import { Save } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "../../loaders/Loader";

const FLOATING_SIZE = 32;
const BUTTON_TRANSITION = {
  duration: 0.36,
  ease: [0.4, 0, 0.2, 1] as const,
};

type SaveButtonProps = {
  pending?: boolean;
  onSave: () => void;
  floating?: boolean;
};

const SaveButton = ({ pending, onSave, floating = false }: SaveButtonProps) => {
  const [isAtNaturalPosition, setIsAtNaturalPosition] = useState(true);
  const [naturalWidth, setNaturalWidth] = useState<number>();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFloating = floating && !isAtNaturalPosition;
  const animatedWidth = isFloating ? FLOATING_SIZE : naturalWidth;

  const measureNaturalWidth = useCallback(
    (button: HTMLButtonElement | null) => {
      if (!button) return;

      const width = Math.ceil(button.getBoundingClientRect().width);
      if (width > 0) setNaturalWidth((current) => current ?? width);
    },
    [],
  );

  useEffect(() => {
    if (!floating || !sentinelRef.current) return;

    const scrollRoot = sentinelRef.current.closest("#main-scroll-container");
    const observer = new IntersectionObserver(
      ([entry]) => setIsAtNaturalPosition(entry.isIntersecting),
      {
        root: scrollRoot,
        threshold: 0.1,
      },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [floating]);

  const icon = pending ? (
    <span>
      <Loader />
    </span>
  ) : (
    <Save className="size-5 shrink-0" />
  );

  if (!floating) {
    return (
      <button
        className="self-center btn btn-sm btn-info text-info-content"
        type="button"
        onClick={onSave}
        disabled={pending}
        aria-label="Sauvegarder l'activité"
      >
        {icon}
        Sauvegarder l'activité
      </button>
    );
  }

  return (
    <>
      <div
        className={`relative z-30 mt-4 h-8 w-full ${
          isAtNaturalPosition ? "" : "sticky bottom-4"
        }`}
        data-floating={isAtNaturalPosition ? "false" : "true"}
      >
        <motion.div
          initial={false}
          animate={{
            left: isFloating ? "calc(100% - 0px)" : "calc(50% - 0px)",
          }}
          transition={BUTTON_TRANSITION}
          className="absolute top-0 -translate-x-1/2"
        >
          <div
            className={`relative inline-flex ${
              isFloating ? "tooltip tooltip-left" : ""
            }`}
            data-tip={isFloating ? "Sauvegarder l'activité" : undefined}
          >
            <motion.button
              ref={measureNaturalWidth}
              initial={false}
              animate={{
                ...(animatedWidth ? { width: animatedWidth } : {}),
                borderRadius: isFloating ? FLOATING_SIZE / 2 : 8,
                paddingLeft: isFloating ? 6 : 16,
                paddingRight: isFloating ? 6 : 16,
              }}
              transition={BUTTON_TRANSITION}
              className={`btn btn-sm btn-info justify-start overflow-hidden px-0 text-info-content ${
                isFloating ? "btn-circle shadow-lg" : ""
              }`}
              type="button"
              onClick={onSave}
              disabled={pending}
              aria-label="Sauvegarder l'activité"
            >
              {icon}
              <motion.span
                initial={false}
                animate={{
                  opacity: isFloating ? 0 : 1,
                  x: isFloating ? -4 : 0,
                }}
                transition={{ duration: 0.16, ease: "easeInOut" }}
                aria-hidden={isFloating}
                className="ml-1 shrink-0 whitespace-nowrap text-left"
              >
                Sauvegarder l'activité
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </div>
      <div ref={sentinelRef} className="h-px w-full" />
    </>
  );
};

export default SaveButton;
