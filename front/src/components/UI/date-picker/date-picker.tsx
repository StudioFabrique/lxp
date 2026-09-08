import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { DayPicker, type Matcher } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "react-day-picker/style.css";

import { formatDateToYYYYMMDD } from "../../../utils/helpers/convert-date";
import "./date-picker.css";
import { parseDateValue } from "./date-picker.utils";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  label?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  placeholder?: string;
  ariaLabel?: string;
  clearable?: boolean;
  display?: "long" | "short";
  className?: string;
};

const formatVisibleDate = (date: Date, display: Props["display"]) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: display === "short" ? "short" : "long",
    year: "numeric",
  }).format(date);

const clampMonth = (date: Date, min?: Date, max?: Date) => {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
};

const DatePicker = ({
  value = "",
  onChange,
  id,
  name,
  label,
  disabled = false,
  min,
  max,
  placeholder = "Choisir une date",
  ariaLabel,
  clearable = true,
  display = "long",
  className = "",
}: Props) => {
  const generatedId = useId();
  const triggerId = id ?? `date-picker-${generatedId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement>();

  const selected = useMemo(() => parseDateValue(value), [value]);
  const minDate = useMemo(() => parseDateValue(min), [min]);
  const maxDate = useMemo(() => parseDateValue(max), [max]);

  const disabledDays = useMemo<Matcher[] | undefined>(() => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    return matchers.length ? matchers : undefined;
  }, [maxDate, minDate]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startMonth = minDate ?? new Date(today.getFullYear() - 100, 0, 1);
  const endMonth = maxDate ?? new Date(today.getFullYear() + 50, 11, 1);
  const defaultMonth = clampMonth(selected ?? today, minDate, maxDate);
  const todayIsAvailable =
    (!minDate || today >= minDate) && (!maxDate || today <= maxDate);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      const dialog = triggerRef.current?.closest("dialog");
      setPortalContainer((dialog as HTMLElement | null) ?? document.body);
    }
    setOpen(nextOpen);
  };

  const handleSelect = (date?: Date) => {
    if (!date) return;
    onChange(formatDateToYYYYMMDD(date));
    setOpen(false);
  };

  return (
    <div className={`app-date-picker ${className}`}>
      {label && (
        <label htmlFor={triggerId} className="text-sm font-medium">
          {label}
        </label>
      )}

      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            disabled={disabled}
            className="app-date-picker__trigger input input-sm input-bordered"
            aria-label={ariaLabel || label || placeholder}
          >
            <CalendarDays aria-hidden="true" />
            <span className={selected ? "" : "app-date-picker__placeholder"}>
              {selected ? formatVisibleDate(selected, display) : placeholder}
            </span>
            <ChevronDown className="app-date-picker__chevron" aria-hidden="true" />
          </button>
        </Popover.Trigger>

        <Popover.Portal container={portalContainer}>
          <Popover.Content
            className="app-date-picker__popover"
            sideOffset={8}
            align="start"
            collisionPadding={12}
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              defaultMonth={defaultMonth}
              startMonth={startMonth}
              endMonth={endMonth}
              disabled={disabledDays}
              locale={fr}
              captionLayout="dropdown"
              navLayout="after"
              fixedWeeks
              showOutsideDays
              className="app-date-picker__calendar"
              labels={{
                labelNext: () => "Mois suivant",
                labelPrevious: () => "Mois précédent",
                labelMonthDropdown: () => "Choisir le mois",
                labelYearDropdown: () => "Choisir l’année",
              }}
            />

            <div className="app-date-picker__actions">
              {todayIsAvailable ? (
                <button
                  type="button"
                  className="btn btn-xs btn-ghost"
                  onClick={() => handleSelect(today)}
                >
                  Aujourd’hui
                </button>
              ) : (
                <span />
              )}
              {clearable && selected && (
                <button
                  type="button"
                  className="btn btn-xs btn-ghost"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                >
                  Effacer
                </button>
              )}
            </div>
            <Popover.Arrow className="app-date-picker__arrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
};

export default DatePicker;
