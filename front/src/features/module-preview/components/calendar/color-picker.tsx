import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { calendarColors, colorDots, type CalendarColor } from "../../../calendar/components/calendar-configuration";
import { cn } from "../../../../utils/cn";

export function ColorPicker({
  color,
  disabled,
  onChange,
}: {
  color: CalendarColor;
  disabled: boolean;
  onChange: (color: CalendarColor) => void;
}) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative mt-1 size-4 shrink-0">
      <div className="absolute left-0 top-0 z-10 flex items-center gap-1.5">
        <AnimatePresence>
          {open && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1 rounded-full bg-base-100/20 backdrop-blur-[2px]"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.16 }}
            />
          )}
        </AnimatePresence>
        <button
          type="button"
          disabled={disabled}
          aria-label="Changer la couleur du cours"
          aria-expanded={open}
          className={cn(
            "relative z-10 size-4 shrink-0 cursor-pointer rounded-full border border-base-content/20 ring-offset-2 ring-offset-base-100 hover:border-base-content/70 hover:ring-2 hover:ring-base-content/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
            colorDots[color],
          )}
          onClick={() => setOpen((value) => !value)}
        />
        <AnimatePresence>
          {open &&
            calendarColors
              .filter((option) => option !== color)
              .map((option, index) => (
                <motion.button
                  key={option}
                  type="button"
                  disabled={disabled}
                  aria-label={`Choisir la couleur ${option}`}
                  className={cn(
                    "relative z-10 size-4 shrink-0 cursor-pointer rounded-full border border-base-content/20 hover:border-base-content/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
                    colorDots[option],
                  )}
                  initial={
                    reducedMotion ? false : { opacity: 0, scale: 0.3, x: -8 }
                  }
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={
                    reducedMotion
                      ? undefined
                      : { opacity: 0, scale: 0.3, x: -8 }
                  }
                  transition={{
                    duration: reducedMotion ? 0 : 0.16,
                    delay: reducedMotion ? 0 : index * 0.035,
                  }}
                  onClick={() => {
                    setOpen(false);
                    onChange(option);
                  }}
                />
              ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
