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
  helperText?: string;
}

const FormNumberInput = <TFieldValues extends FieldValues,>({
  label,
  name,
  register,
  error,
  placeholder,
  disabled,
  min,
  helperText,
}: FormNumberInputProps<TFieldValues>) => {
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      <input
        {...register(name, { valueAsNumber: true })}
        className={`w-full input input-bordered focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60 ${error ? "input-error" : ""}`}
        type="number"
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        step="any"
        inputMode="decimal"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
      />
      {error ? (
        <p id={errorId} className="text-error text-xs" role="alert">
          {error.message}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-base-content/60 text-xs">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default FormNumberInput;
