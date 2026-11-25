import { useId, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays } from "lucide-react";
import { useForm } from "react-hook-form";
import DatePicker from "../../../components/UI/date-picker/date-picker";
import { useFormField } from "../../../components/form/useFormField";
import { cn } from "../../../utils/cn";
import { formatDateToYYYYMMDD } from "../../../utils/helpers/convert-date";
import {
  addDays,
  customRangeSchema,
  MAX_RANGE_DAYS,
  type CustomRangeValues,
} from "../observability.schema";
import {
  customRangeLabel,
  type ActivityRange,
} from "../helpers/activity-range";

type Props = {
  value: ActivityRange;
  onApply: (range: ActivityRange) => void;
};

/** Par défaut : les sept derniers jours, aujourd'hui compris. */
const defaultValues = (value: ActivityRange): CustomRangeValues => {
  if (value.kind === "custom") {
    return { startDate: value.startDate, endDate: value.endDate };
  }
  const today = formatDateToYYYYMMDD(new Date());
  return { startDate: addDays(today, -6), endDate: today };
};

/**
 * Bouton calendrier à droite des périodes : ouvre un popover pour cibler un
 * intervalle de jours précis. Le formulaire est validé par Zod avant l'appel.
 */
export default function ActivityRangePopover({ value, onApply }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const errorId = useId();
  const isActive = value.kind === "custom";
  const today = formatDateToYYYYMMDD(new Date());

  const form = useForm<CustomRangeValues>({
    resolver: zodResolver(customRangeSchema()),
    defaultValues: defaultValues(value),
    mode: "onChange",
  });
  const [startDate, setStartDate] = useFormField(form, "startDate");
  const [endDate, setEndDate] = useFormField(form, "endDate");
  const { errors, isSubmitting } = form.formState;
  const errorMessage = errors.startDate?.message ?? errors.endDate?.message;

  const handleOpenChange = (nextOpen: boolean) => {
    // Chaque ouverture repart de l'intervalle actif, sans reprendre une saisie abandonnée.
    if (nextOpen) form.reset(defaultValues(value));
    setOpen(nextOpen);
  };

  const submit = form.handleSubmit(({ startDate: start, endDate: end }) => {
    onApply({ kind: "custom", startDate: start, endDate: end });
    setOpen(false);
  });

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-pressed={isActive}
          aria-label={
            isActive
              ? `Intervalle personnalisé : ${customRangeLabel(value.startDate, value.endDate)}`
              : "Choisir un intervalle de dates"
          }
          className={cn(
            "btn btn-sm cursor-pointer gap-2",
            isActive ? "btn-primary" : "btn-outline",
          )}
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          {isActive ? customRangeLabel(value.startDate, value.endDate) : null}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 w-80 rounded-xl border border-base-300 bg-base-100 p-4 text-base-content shadow-lg"
        >
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold">Choisir les dates</h3>
              <p className="text-xs text-base-content/70">
                Les journaux sont conservés {MAX_RANGE_DAYS - 1} jours.
              </p>
            </div>

            <DatePicker
              label="Début"
              name="startDate"
              value={startDate}
              min={addDays(today, -MAX_RANGE_DAYS)}
              max={endDate && endDate < today ? endDate : today}
              onChange={setStartDate}
              clearable={false}
              display="short"
            />
            <DatePicker
              label="Fin"
              name="endDate"
              value={endDate}
              min={startDate || addDays(today, -MAX_RANGE_DAYS)}
              max={today}
              onChange={setEndDate}
              clearable={false}
              display="short"
            />

            {errorMessage && (
              <p
                id={errorId}
                role="alert"
                className="text-xs font-bold text-error"
              >
                {errorMessage}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setOpen(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSubmitting || Boolean(errorMessage)}
                aria-describedby={errorMessage ? errorId : undefined}
              >
                Appliquer
              </button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
