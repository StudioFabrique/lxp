import {
  FieldError,
  FieldPath,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface FormNumberInputProps<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
}

const FormNumberInput = <TFieldValues extends FieldValues,>({
  label,
  name,
  register,
  error,
  placeholder,
  disabled,
  min,
}: FormNumberInputProps<TFieldValues>) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      <input
        {...register(name, { valueAsNumber: true })}
        className={`w-full input input-bordered focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60 ${error ? "input-error" : ""}`}
        type="number"
        defaultValue={0}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
      />
      {error && <p className="text-error text-xs">{error.message}</p>}
    </div>
  );
};

export default FormNumberInput;
