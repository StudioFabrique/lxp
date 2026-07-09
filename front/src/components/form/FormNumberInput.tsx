import { UseFormRegister, FieldError } from "react-hook-form";

interface FormNumberInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
}

const FormNumberInput = ({
  label,
  name,
  register,
  error,
  placeholder,
  disabled,
  min,
}: FormNumberInputProps) => {
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
      />
      {error && <p className="text-error text-xs">{error.message}</p>}
    </div>
  );
};

export default FormNumberInput;
