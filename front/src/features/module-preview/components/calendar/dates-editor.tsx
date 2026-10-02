import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseDatesListSchema } from "../../../course/course-dates.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import { Trash2 } from "lucide-react";
import type CourseDates from "../../../course/interfaces/course-dates";
import { dateInputValue } from "../../hooks/use-module-calendar";
import DatePicker from "../../../../components/UI/date-picker/date-picker";
import CourseTimeFields from "../../../course/components/edit/calendar/course-time-fields";

export function DatesEditor({
  dates,
  isSaving,
  onSave,
  onDelete,
}: {
  dates: CourseDates[];
  isSaving: boolean;
  onSave: (dates: CourseDates[]) => Promise<boolean>;
  onDelete: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(courseDatesListSchema),
    defaultValues: { dates: dates.map((date) => ({ ...date })) },
  });
  const [draft, setDraft] = useFormField(form, "dates");
  const valid = courseDatesListSchema.safeParse({ dates: draft }).success;
  const validDates = courseDatesListSchema.safeParse({
    dates: draft.map((date) => ({
      ...date,
      startTime: undefined,
      endTime: undefined,
    })),
  }).success;
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(async ({ dates }) => {
        if (!isSaving) await onSave(dates);
      }, showFormErrors)}
    >
      <div className="max-h-[50vh] space-y-4 overflow-y-auto">
        {draft.map((date, index) => (
          <fieldset
            key={index}
            disabled={isSaving}
            className="flex flex-col gap-3"
          >
            {draft.length > 1 && (
              <legend className="mb-2 text-sm font-medium">
                Plage {index + 1}
              </legend>
            )}
            <div className="flex flex-col gap-4 divide-y divide-base-300">
              <div className="@container min-w-0 space-y-2 pb-4">
                <p className="text-sm font-medium">Dates</p>
                <div className="grid grid-cols-1 gap-3 @min-[19rem]:grid-cols-2">
                  <DatePicker
                    label="Date de début"
                    display="short"
                    className="min-w-0"
                    value={dateInputValue(date.minDate)}
                    max={dateInputValue(date.maxDate)}
                    clearable={false}
                    onChange={(value) =>
                      setDraft((previous) =>
                        previous.map((item, i) =>
                          i === index
                            ? { ...item, minDate: `${value}T00:00:00.000Z` }
                            : item,
                        ),
                      )
                    }
                  />
                  <DatePicker
                    label="Date de fin"
                    display="short"
                    className="min-w-0"
                    value={dateInputValue(date.maxDate)}
                    min={dateInputValue(date.minDate)}
                    clearable={false}
                    onChange={(value) =>
                      setDraft((previous) =>
                        previous.map((item, i) =>
                          i === index
                            ? { ...item, maxDate: `${value}T00:00:00.000Z` }
                            : item,
                        ),
                      )
                    }
                  />
                </div>
              </div>
              <div className="min-w-0">
                <CourseTimeFields
                  startTime={date.startTime}
                  endTime={date.endTime}
                  onChange={(times) =>
                    setDraft((previous) =>
                      previous.map((item, i) =>
                        i === index ? { ...item, ...times } : item,
                      ),
                    )
                  }
                />
              </div>
            </div>
          </fieldset>
        ))}
      </div>
      {!validDates && (
        <p role="alert" className="text-sm text-error">
          Vérifiez les dates de chaque plage.
        </p>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSaving || !valid}
      >
        {isSaving ? "Enregistrement…" : "Enregistrer"}
      </button>
      <button
        type="button"
        className="btn btn-ghost text-error border-t border-base-300"
        disabled={isSaving}
        onClick={onDelete}
      >
        <Trash2 className="size-4" /> Supprimer les dates du cours
      </button>
    </form>
  );
}
