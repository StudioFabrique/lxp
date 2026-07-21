import { UseFormRegister, FieldError } from "react-hook-form";

interface FormTextareaProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

const FormTextarea = ({
  label,
  name,
  register,
  error,
  placeholder,
  disabled,
  rows = 4,
}: FormTextareaProps) => {
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
