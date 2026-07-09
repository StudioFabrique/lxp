import { UseFormRegister, FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}

const FormInput = ({
  label,
  name,
  register,
  error,
  placeholder,
  disabled,
  type = "text",
}: FormInputProps) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      <input
        {...register(name)}
        className={`w-full input input-bordered focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60 ${error ? "input-error" : ""}`}
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p className="text-error text-xs">{error.message}</p>}
    </div>
  );
};

export default FormInput;
