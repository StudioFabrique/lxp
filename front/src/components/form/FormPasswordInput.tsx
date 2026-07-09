import { useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface FormPasswordInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
}

const FormPasswordInput = ({
  label,
  name,
  register,
  error,
  placeholder,
  disabled,
}: FormPasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          className={`w-full input input-bordered focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60 ${error ? "input-error" : ""}`}
          type={visible ? "text" : "password"}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-error text-xs">{error.message}</p>}
    </div>
  );
};

export default FormPasswordInput;
