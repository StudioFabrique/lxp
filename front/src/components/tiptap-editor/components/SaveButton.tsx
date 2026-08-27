import { Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Loader from "../../loaders/Loader";

type SaveButtonProps = {
  pending?: boolean;
  onSave: () => void;
  floating?: boolean;
};

const SaveButton = ({ pending, onSave, floating = false }: SaveButtonProps) => {
  const [isAtNaturalPosition, setIsAtNaturalPosition] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFloating = floating && !isAtNaturalPosition;
  const transition = {
    duration: 0.42,
    ease: [0.4, 0, 0.2, 1] as const,
  };

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
        className="self-center flex btn btn-sm btn-info text-info-content"
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
            left: isFloating ? "calc(100%)" : "calc(50%)",
          }}
          transition={transition}
          className="absolute top-0 -translate-x-1/2"
        >
          <motion.button
            initial={false}
            animate={{
              width: isFloating ? 32 : "auto",
              borderRadius: isFloating ? 16 : 8,
              paddingLeft: isFloating ? 0 : 16,
              paddingRight: isFloating ? 0 : 16,
            }}
            transition={transition}
            className={`btn btn-sm btn-info overflow-hidden px-0 text-info-content ${
              isFloating ? "btn-circle shadow-lg" : ""
            }`}
            type="button"
            onClick={onSave}
            disabled={pending}
            aria-label="Sauvegarder l'activité"
            title={isFloating ? "Sauvegarder l'activité" : undefined}
          >
            {icon}
            <motion.span
              initial={false}
              animate={{
                opacity: isFloating ? 0 : 1,
                width: isFloating ? 0 : "auto",
              }}
              transition={{
                width: transition,
                opacity: { duration: 0.18, ease: "easeInOut" },
              }}
              aria-hidden={isFloating}
              className="shrink-0 overflow-hidden whitespace-nowrap text-left"
            >
              Sauvegarder l'activité
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
      <div ref={sentinelRef} className="h-px w-full" />
    </>
  );
};

export default SaveButton;
