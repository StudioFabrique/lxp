import {
  FieldError,
  FieldPath,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface FormTextareaProps<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

const FormTextarea = <TFieldValues extends FieldValues,>({
  label,
  name,
  register,
  error,
  placeholder,
  disabled,
  rows = 4,
}: FormTextareaProps<TFieldValues>) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      <textarea
        {...register(name)}
        className={`textarea textarea-bordered w-full focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60 ${error ? "textarea-error" : ""}`}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
      />
      {error && <p className="text-error text-xs">{error.message}</p>}
    </div>
  );
};

export default FormTextarea;
