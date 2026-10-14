import { useId, type ComponentPropsWithoutRef } from "react";
import {
  FieldError,
  FieldPath,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { cn } from "../../utils/cn";

interface FormInputProps<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  autoComplete?: ComponentPropsWithoutRef<"input">["autoComplete"];
}

const FormInput = <TFieldValues extends FieldValues,>({
  label,
  name,
  register,
  error,
  placeholder,
  disabled,
  type = "text",
  autoComplete,
}: FormInputProps<TFieldValues>) => {
  const fieldId = useId();
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor={fieldId} className="text-sm font-bold">
        {label}
      </label>
      <input
        {...register(name)}
        className={cn("w-full input input-bordered focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60", error && "input-error")}
        type={type}
        autoComplete={autoComplete}
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p id={`${fieldId}-error`} role="alert" className="text-error text-xs">{error.message}</p>}
    </div>
  );
};

export default FormInput;
