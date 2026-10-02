import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDatesSchema } from "../../../course-dates.schema";
import { useFormField } from "../../../../../components/form/useFormField";
import { showFormErrors } from "../../../../../components/form/form-errors";
import BoxWrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import CourseDates from "../../../interfaces/course-dates";
import Module from "../../../../../../src/utils/interfaces/module";
import { useMemo } from "react";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";
import DatePicker from "../../../../../components/UI/date-picker/date-picker";
import { formatDateToYYYYMMDD } from "../../../../../utils/helpers/convert-date";

import CourseTimeFields from "./course-time-fields";
import { cn } from "../../../../../utils/cn";

interface DatesFormProps {
  isLoading: boolean;
  module: Module;
  datesList: CourseDates[] | null;
  onSubmitDates: (dates: CourseDates) => void;
}

const DatesForm = (props: DatesFormProps) => {
  const usedDuration = (props.datesList ?? []).reduce(
    (sum, date) =>
      sum + Number(date.synchroneDuration) + Number(date.asynchroneDuration),
    0,
  );
  const schema = useMemo(
    () =>
      createDatesSchema(
        props.module.minDate,
        props.module.maxDate,
        props.module.duration,
        usedDuration,
      ),
    [
      props.module.minDate,
      props.module.maxDate,
      props.module.duration,
      usedDuration,
    ],
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      minDate: "",
      maxDate: "",
      synchroneDuration: 0,
      asynchroneDuration: 0,
      startTime: "",
      endTime: "",
    },
  });
  const [minDate, setMinDate] = useFormField(form, "minDate");
  const [maxDate, setMaxDate] = useFormField(form, "maxDate");
  const times = {
    startTime: form.watch("startTime"),
    endTime: form.watch("endTime"),
  };
  const setTimes = (next: { startTime?: string; endTime?: string }) => {
    form.setValue("startTime", next.startTime ?? "", { shouldDirty: true });
    form.setValue("endTime", next.endTime ?? "", { shouldDirty: true });
  };
  const handleSubmit = form.handleSubmit((values) => {
    if (!props.isLoading) props.onSubmitDates(values);
  }, showFormErrors);
  const setInputStyle = (hasError: boolean) =>
    cn(
      "flex-1 input input-sm input-bordered focus:outline-none w-full",
      hasError && "input-error text-error",
    );

  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      onSubmit={handleSubmit}
    >
      <BoxWrapper>
        <h2 className="text-sm font-bold">Dates de cours *</h2>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-end gap-4">
              <DatePicker
                id="startingDate"
                name="startingDate"
                label="Début"
                value={minDate}
                min={
                  props.module.minDate
                    ? formatDateToYYYYMMDD(new Date(props.module.minDate))
                    : undefined
                }
                max={
                  maxDate ||
                  (props.module.maxDate
                    ? formatDateToYYYYMMDD(new Date(props.module.maxDate))
                    : undefined)
                }
                onChange={setMinDate}
              />
            </div>
            <div className="flex justify-between items-end gap-4">
              <DatePicker
                id="endingDate"
                name="endingDate"
                label="Fin"
                value={maxDate}
                min={
                  minDate ||
                  (props.module.minDate
                    ? formatDateToYYYYMMDD(new Date(props.module.minDate))
                    : undefined)
                }
                max={
                  props.module.maxDate
                    ? formatDateToYYYYMMDD(new Date(props.module.maxDate))
                    : undefined
                }
                onChange={setMaxDate}
              />
            </div>
          </div>
          <CourseTimeFields {...times} onChange={setTimes} />
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <h2 className="text-sm font-bold">Durée du cours (nombre d'heures)</h2>
        <div className="flex flex-col gap-y-8">
          <div className="flex justify-between items-center gap-x-4">
            <label className="w-2/6" htmlFor="synchrone">
              Synchrone
            </label>
            <input
              className={setInputStyle(
                Boolean(form.formState.errors.synchroneDuration),
              )}
              type="number"
              id="synchrone"
              min={0}
              {...form.register("synchroneDuration", { valueAsNumber: true })}
            />
          </div>
          <div className="flex justify-between items-center gap-x-4">
            <label className="w-2/6" htmlFor="asynchrone">
              Asynchrone
            </label>
            <input
              className={setInputStyle(
                Boolean(form.formState.errors.asynchroneDuration),
              )}
              type="number"
              id="asynchrone"
              min={0}
              {...form.register("asynchroneDuration", { valueAsNumber: true })}
            />
          </div>
        </div>
      </BoxWrapper>
      <div>
        <ButtonAdd
          label="Ajouter une plage"
          loading={props.isLoading}
          isDisabled={props.isLoading}
          type="submit"
        />
      </div>
    </form>
  );
};

export default DatesForm;
