import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDateToYYYYMMDD } from "../../../utils/helpers/convert-date";
import DatePicker from "../date-picker/date-picker";
import { dateRangeSchema } from "./dates.schema";
import { useFormField } from "../../form/useFormField";
import useAutoSave from "../../../hooks/useAutoSave";

type Dates = z.infer<typeof dateRangeSchema>;
type Props = {
  onSubmitDates: (dates: Dates) => void | Promise<void>;
  label?: string;
  startDateProp?: string;
  endDateProp?: string;
  disabled?: boolean;
};
const defaults = (start: string, end: string): Dates => {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const fallback = formatDateToYYYYMMDD(tomorrow);
  return { startDate: start ? formatDateToYYYYMMDD(new Date(start)) : fallback,
    endDate: end ? formatDateToYYYYMMDD(new Date(end)) : fallback };
};
export default function DatesSelecter({ startDateProp = "", endDateProp = "", label = "", onSubmitDates, disabled = false }: Props) {
  const id = useId();
  const form = useForm<Dates>({ resolver: zodResolver(dateRangeSchema), defaultValues: defaults(startDateProp, endDateProp), mode: "onChange" });
  const [startDate, setStartDate] = useFormField(form, "startDate");
  const [endDate, setEndDate] = useFormField(form, "endDate");
  const { reset, formState: { errors, dirtyFields } } = form;
  void dirtyFields;
  useEffect(() => { reset(defaults(startDateProp, endDateProp), { keepDirtyValues: true }); }, [startDateProp, endDateProp, reset]);
  const save = async () => {
    if (!await form.trigger()) throw new Error("Dates invalides");
    await onSubmitDates(dateRangeSchema.parse(form.getValues()));
  };
  useAutoSave(form.watch, save, !disabled);
  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="font-bold">{label}</h3>
      <DatePicker id={`${id}-start`} name="startDate" label="Début" value={startDate} max={endDate} onChange={setStartDate} disabled={disabled} />
      <DatePicker id={`${id}-end`} name="endDate" label="Fin" value={endDate} min={startDate} onChange={setEndDate} disabled={disabled} />
      {(errors.startDate || errors.endDate) && <p className="text-error text-xs mt-4 text-center font-bold">{errors.startDate?.message ?? errors.endDate?.message}</p>}
    </div>
  );
}
